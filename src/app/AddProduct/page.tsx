"use client";

import React, { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import NavigationPanel from "@/components/NavigationPanel";
import AddProductForm from "@/components/AddProduct/AddProductForm";
import SuccessMessage from "@/components/AddProduct/SuccessMessage";
import SimilarProducts from "@/components/SimilarProducts";
import BackToDashboard from "@/components/BackToDashboard";
import {Product} from "@/blueprint/customBlueprints";
import apiHelper from "@/helpers/ApiHelper";
import LoadingScreen from "@/components/LoadingScreen";



const AddProductPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [addedProduct, setAddedProduct] = useState<Product | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [productCostPrice, setProductCostPrice] = useState(0);
    const [productSellingPrice, setProductSellingPrice] = useState(0);
    const [categories, setCategories] = useState<string[]>([]);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        apiHelper.verifyLogin()
            .then(res => {
                if (!res.loggedIn || res.user?.userRole !== "admin")
                    return router.push("/Login");
                setAdmin(true);
                apiHelper.getAllProducts().then(data => {
                    setAllProducts(data);
                    const uniqueCategories = Array.from(
                        new Set(data.map((p: Product) => p.productCategory).filter(Boolean)),
                    ) as string[];
                    setCategories(uniqueCategories);
                })
            })
            .catch(err => router.push("/Login"))
            .finally(() => setLoading(false));
    }, [router]);

    const fuse = new Fuse(allProducts,{
        keys: ["productName", "productCategory"],
        threshold: 0.3,
        includeScore: true,
    });

    // When product name changes in child form
    const handleNameChange = (typedName: string) => {
        if (!typedName.trim()) {
            setSimilarProducts([]);
            return;
        }
        const matches = fuse.search(typedName).map(result => result.item);
        setSimilarProducts(matches.slice(0, 5));
    };

    const handleAddProduct = async (
        productName:string, productCategory:string, productCostPrice: number,
        productSellingPrice: number ) => {
        setLoading(true);

        const duplicate = similarProducts.some(
            (r) =>
                r.productName.toLowerCase() === productName.trim().toLowerCase() &&
                r.productCategory.toLowerCase() === productCategory.trim().toLowerCase()
        );
        if (duplicate) {
            setSuccessMessage("Product already exists");
            setLoading(false);}
        else {
            apiHelper.addProduct(productName, productCategory, productCostPrice, productSellingPrice)
                .then(res => {
                    if (res.product) {
                        setSuccessMessage("Product successfully added!");
                        setAddedProduct(res.product);
                        setSimilarProducts([]);
                    } else {
                        setSuccessMessage("Product not added");
                        setAddedProduct(null);
                        setSimilarProducts([]);
                    }
                })
                .catch(err => {
                    setSuccessMessage("Failed to add product");
                    setAddedProduct(null);
                })
                .finally(() => setLoading(false));
        }
    };

    if (loading) return (<LoadingScreen />);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-2">
            <NavigationPanel admin={admin}/>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Product</h1>

            {/* Inline success or error message */}
            <SuccessMessage message={successMessage} product={addedProduct} />

            {/*Similar products section */}
            <SimilarProducts products={similarProducts} />

             {/*AddProduct form */}
            <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg">
                <AddProductForm
                    onSubmit={handleAddProduct}
                    onNameChange={handleNameChange}
                    loading={loading}
                    productName={productName}
                    setProductName={setProductName}
                    productCategory={productCategory}
                    setProductCategory={setProductCategory}
                    productCostPrice={productCostPrice}
                    setProductCostPrice={setProductCostPrice}
                    productSellingPrice={productSellingPrice}
                    setProductSellingPrice={setProductSellingPrice}
                    categories={categories}
                />
            </div>

            {/* Back to Dashboard */}
            <BackToDashboard />
        </div>
    );
};

export default AddProductPage;
