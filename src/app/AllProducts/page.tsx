"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { verifyLogin } from "@/helpers/LoginHelper";
import BackToDashboard from "@/components/BackToDashboard";
import { ShoppingBag, Search, X } from "lucide-react";

interface Product {
    product_id: string;
    productName: string;
    productStock: number;
    productPrice: number;
    createdBy: string;
    lastUpdatedAt: string;
}

const ShowAllProductsPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const checkLogin = async () => {
            const result = await verifyLogin();
            if (!result?.loggedIn) {
                router.push("/Login");
                return;
            }

            try {
                const res = await fetch("http://localhost:7070/allProducts", {
                    method: "POST",
                    credentials: "include",
                });
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };

        checkLogin();
    }, [router]);

    // Filtered list based on search
    const filteredProducts = products.filter((p) =>
        p.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-6">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-5xl">
                {/* Header */}
                <div className="bg-yellow-100 border border-gray-200 rounded-xl p-3 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-indigo-500" />
                            All Products in Inventory
                        </h3>
                    </div>
                    <p className="text-sm text-gray-600">
                        Total: <span className="font-medium">{filteredProducts.length}</span>
                    </p>
                </div>

                {/*Search Box */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all text-gray-700"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Loading / Empty states */}
                {loading ? (
                    <p className="text-gray-600 text-center py-10">Loading products...</p>
                ) : filteredProducts.length === 0 ? (
                    <p className="text-gray-600 text-center py-10">
                        {searchQuery
                            ?"No matching products found."
                            : "No products found." }
                    </p>
                ) : (
                    <div className="space-y-3">
                        {filteredProducts.map((p, index) => (
                            <motion.div
                                key={p.product_id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                whileHover={{ scale: 1.01 }}
                                className="flex items-center justify-between bg-white border border-gray-200 shadow-sm rounded-xl px-2 py-1 hover:shadow-md transition-all"
                            >
                                {/* Left section - serial + product name */}
                                <div className="flex items-center gap-4">
                                    <div className="w-6 h-6 flex items-center justify-center text-sm font-semibold bg-indigo-100 text-indigo-600 rounded-full">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-base">
                                            {p.productName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            ID: {p.product_id}
                                        </p>
                                    </div>
                                </div>

                                {/* Right section - details */}
                                <div className="flex flex-col text-right text-sm text-gray-700">
                                    <p>
                                        <span className="font-medium">Stock:</span> {p.productStock}
                                    </p>
                                    <p>
                                        <span className="font-medium">Price:</span> ₹
                                        {p.productPrice.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(p.lastUpdatedAt).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <BackToDashboard />
        </div>
    );
};

export default ShowAllProductsPage;
