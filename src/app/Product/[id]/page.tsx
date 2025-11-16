"use client";

import React, { useEffect, useLayoutEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import apiHelper from "@/helpers/ApiHelper";
import { Product } from "@/blueprint/customBlueprints";
import { Pencil, Trash2, Save} from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import NavigationPanel from "@/components/NavigationPanel";
import PastTransactions from "@/components/PastTransactions";

const ProductPage = () => {
    const params = useParams();
    const productId = Array.isArray(params.id)
        ? params.id[0]
        : params.id;
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [productName, setProductName] = useState<string>("");
    const [productCategory, setProductCategory] = useState<string>("");
    const [productSellingPrice, setProductSellingPrice] = useState<number>(0);
    const [productStock, setProductStock] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [message, setMessage] = useState("");
    const headerRef = useRef<HTMLElement>(null);
    const [topOffset, setTopOffset] = useState(0);

    useLayoutEffect(() => {
        const updateHeight = () => {
            if (headerRef.current) setTopOffset(headerRef.current.offsetHeight);
        };
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    const refreshProduct = () => {
        if(!productId) return;
        apiHelper.getProductById(productId)
            .then((product ) => {
                if(!product) {
                    setMessage("Invalid product ID");
                    return;
                }
                setProduct(product);
                setProductName(product.productName);
                setProductCategory(product.productCategory);
                setProductSellingPrice(product.productSellingPrice);
                setProductStock(product.productStock);
            })
            .catch((err) => console.error("Error fetching product:", err))
    };

    useEffect(() => {
        apiHelper
            .verifyLogin()
            .then((result) => {
                if (!result.loggedIn)
                    return router.push("/Login");

                if (result.user.userRole === "admin") setAdmin(true);
                refreshProduct();
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));

    }, [productId, router]);

    const handleDelete = async () => {
        if (!product) return;
        const confirmed = confirm("Are you sure you want to delete this product?");
        if (!confirmed) return;

        apiHelper
            .deleteProduct(product.product_id)
            .then((res) => {
                if (res.message.includes("deleted successfully")) {
                    alert("Product deleted successfully");
                    router.push("/AllProducts");
                }
            })
            .catch((err) => {
                console.error(err);
                alert("Failed to delete product");
            });
    };

    const handleSave = async () => {
        if (!product) return;
        apiHelper
            .updateProduct(product.product_id, productName, productCategory, productSellingPrice)
            .then((res) => {
                if (res.product) {
                    setMessage("✅ Changes saved successfully!");
                    setEditMode(false);
                    setProduct({
                        ...product,
                        productName,
                        productCategory,
                        productSellingPrice,
                    });
                    setTimeout(() => setMessage(""), 3000);
                } else {
                    alert("Failed to update product");
                }
            })
            .catch((err) => {
                console.error("Error updating product:", err);
                alert("Failed to save changes");
            });
    };

    if (loading) return <LoadingScreen />;
    if (!product) return <p className="text-center text-gray-600">Product not found.</p>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-2"
        style={{ paddingTop: topOffset + 30 }}
        >
            <NavigationPanel admin={admin} headerRef={headerRef}/>
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl relative">

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 mt-2">
                    Product Details
                </h2>

                {/* Product Fields */}
                <div className="space-y-4">
                    {/* Product ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product ID
                        </label>
                        <p className="mt-1 text-gray-700 bg-gray-100 p-2 rounded-md">
                            {product.product_id}
                        </p>
                    </div>

                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Name
                        </label>
                        {editMode ? (
                            <input
                                type="text"
                                value={productName ? productName : ""}
                                onChange={(e) => setProductName(e.target.value )}
                                className="mt-1 w-full border rounded-md p-2 text-gray-700"
                            />
                        ) : (
                            <p className="mt-1 text-gray-900">{productName}</p>
                        )}
                    </div>

                    {/* Product Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Category
                        </label>
                        {editMode ? (
                            <input
                                type="text"
                                value={productCategory ? productCategory : ""}
                                onChange={(e) => setProductCategory(e.target.value)}
                                className="mt-1 w-full border rounded-md p-2 text-gray-700"
                            />
                        ) : (
                            <p className="mt-1 text-gray-700">{productCategory}</p>
                        )}
                    </div>

                    {/* Product Stock (always visible, readonly) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Stock
                        </label>
                        <input
                            type="number"
                            value={productStock}
                            readOnly
                            className="mt-1 w-full rounded-md p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                        />
                    </div>

                    {/* Product Selling Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Selling Price
                        </label>
                        {editMode ? (
                            <input
                                type="number"
                                value={productSellingPrice ? productSellingPrice : ""}
                                onChange={(e) => setProductSellingPrice(Number(e.target.value))}
                                className="mt-1 w-full border rounded-md p-2 text-gray-700"
                            />
                        ) : (
                            <p className="mt-1 text-gray-700">
                                ₹{productSellingPrice ? productSellingPrice: 0}
                            </p>
                        )}
                    </div>
                </div>

                {/* Edit && Delete Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    {admin && (
                        <>
                    {!editMode && (
                        <>
                            <button
                                onClick={() => setEditMode(true)}
                                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg transition"
                            >
                                <Pencil className="w-4 h-4" /> Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </>
                    )}

                    {editMode && (
                        <>
                            <button
                                onClick={() => {
                                    setProductName(product.productName);
                                    setProductCategory(product.productCategory);
                                    setProductSellingPrice(product.productSellingPrice);
                                    setEditMode(false);
                                }}
                                className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                <Save className="w-4 h-4" /> Save Changes
                            </button>
                        </>
                    )}
                    </>
                    )}
                </div>

                {message && (
                    <p className="text-green-600 text-center mt-4 font-medium">
                        {message}
                    </p>
                )}
            </div>
            <PastTransactions
                productId={product.product_id}
                editMode={editMode}
                refreshProduct={refreshProduct}/>
        </div>
    );
};

export default ProductPage;
