"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddProductForm from "@/components/AddProductForm";
import SuccessMessage from "@/components/SuccessMessage";
import SimilarProducts from "@/components/SimilarProducts";
import BackToDashboard from "@/components/BackToDashboard";
import ApiHelper from "@/helpers/ApiHelper";
import {Product, AddProductRequest, AddProductResponse, VerifyLoginResponse} from "@/blueprint/blueprint";



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
            try {
                const res: VerifyLoginResponse = await ApiHelper.verifyLogin();
                if (res.loggedIn && res.user?.userRole === "admin")
                    router.push("/AddProduct");
                else {
                    setLoading(false);
                    alert("Only Admins can add product!!!");
                    router.push("/Dashboard");
                }
            }catch (err){
                setLoading(false);
                router.push("/Dashboard");
            }
        };
        checkLogin();

        // Load all products once
        const loadProducts = async () => {
            const data = await ApiHelper.getAllProducts();

            setAllProducts(data);
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
    const handleSelectProduct = (product: Product) => {
        setFormData({
            productName: product.productName,
            productQuantity: product.productStock,
            productPrice: product.productPrice,
        });
        setSimilarProducts([]); // hide suggestions after selection
    };

    const handleAddProduct = async (productData: AddProductRequest) => {
        setLoading(true);
        setSuccessMessage("");
        setAddedProduct(null);

        try {
           const data : AddProductResponse = await ApiHelper.addProduct(productData);
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
