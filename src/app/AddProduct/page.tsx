"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddProductForm from "@/components/AddProductForm";
import SuccessMessage from "@/components/SuccessMessage";
import SimilarProducts from "@/components/SimilarProducts";
import BackToDashboard from "@/components/BackToDashboard";
import {Product} from "@/blueprint/customBlueprints";
import apiHelper from "@/helpers/ApiHelper";



const AddProductPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [addedProduct, setAddedProduct] = useState<Product | null>(null);

    //For similar products
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [productName, setProductName] = useState("");
    const [productQuantity, setProductQuantity] = useState(0);
    const [productCostPrice, setProductCostPrice] = useState(0);
    const [productSellingPrice, setProductSellingPrice] = useState(0);

    useEffect(() => {
        apiHelper.verifyLogin()
            .then(res => {
                if (res.loggedIn && res.user?.userRole === "admin")
                    return router.push("/AddProduct");
                apiHelper.getAllProducts().then(data => setAllProducts(data));
            })
            .catch(err => {
                setLoading(false);
                router.push("/Login");
            });
    }, [router]);

    // When product name changes in child form
    const handleNameChange = (typedName: string) => {
        if (!typedName.trim()) {
            setSimilarProducts([]);
            return;
        }
        const lower = typedName.toLowerCase();
        const matches = allProducts.filter((p) =>
            p.productName.toLowerCase().includes(lower)
        );
        setSimilarProducts(matches.slice(0, 5)); // limit
    };

    // // Called when user clicks a similar product
    // const handleSelectProduct = (product: Product) => {
    //     setProductName(productName);
    //     setProductQuantity(productQuantity);
    //     setProductCostPrice(productCostPrice);
    //     setProductSellingPrice(productSellingPrice);
    //     setSimilarProducts([]); // hide suggestions after selection
    // };

    const handleAddProduct = async (
        productName:string,
        productQuantity:number,
        productCostPrice: number,
        productSellingPrice: number ) => {
        setLoading(true);
        setSuccessMessage("");
        setAddedProduct(null);

        apiHelper.addProduct(productName, productQuantity, productCostPrice, productSellingPrice)
            .then(res => {
                setSuccessMessage("Product successfully added!");
                setAddedProduct(res.product);
            })
            .catch(err => setSuccessMessage("Failed to add product"))
            .finally(() => setLoading(false));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Product</h1>

            {/* Inline success or error message */}
            <SuccessMessage message={successMessage} />

            {/* Added product details */}
            {addedProduct && (
                <div className="bg-white shadow-md rounded-xl p-4 mb-6 w-full max-w-lg border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        Added Product Details
                    </h2>
                    <ul className="text-gray-700 space-y-1">
                        <li><strong>ID:</strong> {addedProduct.product_id}</li>
                        <li><strong>Name:</strong> {addedProduct.productName}</li>
                        <li><strong>Stock:</strong> {addedProduct.productStock}</li>
                        <li><strong>Selling Price:</strong> ₹{addedProduct.productSellingPrice}</li>
                        <li><strong>Cost Price:</strong> ₹{addedProduct.productCostPrice}</li>
                        <li><strong>Updated At:</strong> {new Date(addedProduct.lastUpdatedAt).toLocaleString("en-IN")}</li>
                    </ul>
                </div>
            )}

             {/*AddProduct form */}
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
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
            <SimilarProducts
                products={similarProducts}
                />

            {/* Back to Dashboard */}
            <BackToDashboard />
        </div>
    );
};

export default AddProductPage;
