"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {AnimatePresence, motion} from "framer-motion";
import BackToDashboard from "@/components/BackToDashboard";
import {ShoppingBag, Search, X, Trash2} from "lucide-react";
import apiHelper from "@/helpers/ApiHelper";
import {Product} from "@/blueprint/customBlueprints";
import LoadingScreen from "@/components/LoadingScreen";
import DisplayProductCompactContainer from "@/components/DisplayProductCompactContainer";

const ShowAllProductsPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        apiHelper.verifyLogin()
            .then(result => {
                if (!result.loggedIn)
                    return router.push("/Login");
                apiHelper.getAllProducts().then(data => setProducts(data))
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, [router]);

    // Filtered list based on search
    const filteredProducts = products.filter((p) =>
        p.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (productId: string) => {
        try {
            const confirmed = confirm("Are you sure you want to delete this product?");
            if (!confirmed) return;
            apiHelper.deleteProduct(productId)
                .then(res => {
                    if (res.message.includes("deleted successfully"))
                        setProducts(products.filter(p => p.product_id !== productId))
                })
                .catch(err => console.log(err))
        } catch (err) {
            console.error(err);
            alert("Failed to delete product");
        }
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-2">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-5xl">
                {/* Header */}
                <div className="bg-yellow-100 border border-gray-200 rounded-xl p-2 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-indigo-500" />
                            {filteredProducts.length} All Products in Inventory
                        </h3>
                    </div>
                </div>

                {/*Search Box */}
                <div className="relative mb-3">
                    <input
                        type="text"
                        placeholder="Search products by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all text-gray-950"
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

                {/* LoadingScreen / Empty states */}
                {loading ? (
                    <LoadingScreen />
                ) : filteredProducts.length === 0 ? (
                    <p className="text-gray-600 text-center py-10">
                        {searchQuery
                            ?"No matching products found."
                            : "No products found." }
                    </p>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {filteredProducts.map((p) => (
                                <DisplayProductCompactContainer
                                    product={p}
                                    key={p.product_id}
                                    handleDelete={handleDelete} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <BackToDashboard />
        </div>
    );
};

export default ShowAllProductsPage;
