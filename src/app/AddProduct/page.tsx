"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddProductForm from "@/components/AddProductForm";
import SuccessMessage from "@/components/SuccessMessage";
import {verifyLogin} from "@/helpers/LoginHelper";
import SimilarProducts from "@/components/SimilarProducts";
import BackToDashboard from "@/components/BackToDashboard";

interface Product {
    product_id: string;
    productName: string;
    productStock: number;
    productPrice: number;
    createdBy: string;
    lastUpdatedAt: string;
}

const AddProductPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [addedProduct, setAddedProduct] = useState<Product | null>(null);

    //For similar products
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState({
        productName: "",
        productQuantity: 0,
        productPrice: 0,
    });

    useEffect(() => {
        //Verify Login
        const checkLogin = async () => {
            const result = await verifyLogin();
            if (result?.loggedIn) router.push("/AddProduct");
            else {
                setLoading(false);
                router.push("/Login");}
        };
        checkLogin();

        // Load all products once
        const loadProducts = async () => {
            try {
                const res = await fetch("http://localhost:7070/allProducts", {
                    method: "POST",
                    credentials: "include"
                });
                const data = await res.json();
                setAllProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            }
        };
        loadProducts();
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

    // Called when user clicks a similar product
    const handleSelectProduct = (product: any) => {
        setFormData({
            productName: product.productName,
            productQuantity: product.productStock.toString(),
            productPrice: product.productPrice.toString(),
        });
        setSimilarProducts([]); // hide suggestions after selection
    };

    const handleAddProduct = async (productData: {
        productName: string;
        productQuantity: number;
        productPrice: number;
    }) => {
        setLoading(true);
        setSuccessMessage("");
        setAddedProduct(null);

        try {
            const res = await fetch("http://localhost:7070/addProduct", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(productData),
            });

            const data = await res.json();
            if (res.status !== 200) throw new Error(data.message || "Failed to add product");

            setSuccessMessage("Product successfully added!");
            setAddedProduct(data.product);
        } catch (error) {
            setSuccessMessage("Failed to add product");
        } finally {
            setLoading(false);
        }
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
                        <li><strong>Price:</strong> ₹{addedProduct.productPrice}</li>
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
                    formData={formData}
                    setFormData={setFormData}/>
            </div>

            {/*Similar products section */}
            <SimilarProducts
                products={similarProducts}
                onSelect={handleSelectProduct}/>

            {/* Back to Dashboard */}
            <BackToDashboard />
        </div>
    );
};

export default AddProductPage;
