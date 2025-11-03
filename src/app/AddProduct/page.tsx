"use client";

import React, { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
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
    const [productQuantity, setProductQuantity] = useState(0);
    const [productCostPrice, setProductCostPrice] = useState(0);
    const [productSellingPrice, setProductSellingPrice] = useState(0);

    useEffect(() => {
        apiHelper.verifyLogin()
            .then(res => {
                if (!res.loggedIn || res.user?.userRole !== "admin")
                    return router.push("/Login");
                apiHelper.getAllProducts().then(data => {
                    setAllProducts(data);
                })
            })
            .catch(err => router.push("/Login"))
            .finally(() => setLoading(false));
    }, [router]);

    const fuse = new Fuse(allProducts,{
        keys: ["productName"],
        threshold: 0.4,
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
        // const matches = allProducts.filter((p) =>
        //     p.productName.toLowerCase().includes(typedName.toLowerCase()));
        // setSimilarProducts(matches.slice(0, 5)); // limit
    };

    const handleAddProduct = async (
        productName:string, productQuantity:number, productCostPrice: number,
        productSellingPrice: number ) => {

        setLoading(true);

        apiHelper.addProduct(productName, productQuantity, productCostPrice, productSellingPrice)
            .then(res => {
                setSuccessMessage("Product successfully added!");
                setAddedProduct(res.product);
            })
            .catch(err => {
                setSuccessMessage("Failed to add product");
                setAddedProduct(null);
            })
            .finally(() => setLoading(false));
    };

    if (loading) return (<LoadingScreen />);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-2">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Product</h1>

            {/* Inline success or error message */}
            <SuccessMessage message={successMessage} product={addedProduct} />

             {/*AddProduct form */}
            <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg">
                <AddProductForm
                    onSubmit={handleAddProduct}
                    onNameChange={handleNameChange}
                    loading={loading}
                    productName={productName}
                    setProductName={setProductName}
                    productQuantity={productQuantity}
                    setProductQuantity={setProductQuantity}
                    productCostPrice={productCostPrice}
                    setProductCostPrice={setProductCostPrice}
                    productSellingPrice={productSellingPrice}
                    setProductSellingPrice={setProductSellingPrice}
                />
            </div>

            {/*Similar products section */}
            <SimilarProducts products={similarProducts} />

            {/* Back to Dashboard */}
            <BackToDashboard />
        </div>
    );
};

export default AddProductPage;
