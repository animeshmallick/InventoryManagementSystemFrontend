"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import {AnimatePresence} from "framer-motion";
import NavigationPanel from "@/components/NavigationPanel";
import BackToDashboard from "@/components/BackToDashboard";
import {ShoppingBag, Search, X} from "lucide-react";
import apiHelper from "@/helpers/ApiHelper";
import {Product} from "@/blueprint/customBlueprints";
import LoadingScreen from "@/components/LoadingScreen";
import DisplayProductCompactContainer from "@/components/DisplayProductCompactContainer";

const ShowAllProductsPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [distinctCategory, setDistinctCategory] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [admin, setAdmin] = useState(true);

    const fetchDistinctCategories = (products: Product[]): string[] => {
        const distinctCategory: string[] = [];
        products.map(p => {
            if (!distinctCategory.includes(p.productCategory))
                distinctCategory.push(p.productCategory);
        });
        distinctCategory.sort((a, b) => (a > b ? 1 : -1));
        distinctCategory.unshift("All");
        return distinctCategory;
    }

    useEffect(() => {
        apiHelper.verifyLogin()
            .then(result => {
                if (!result.loggedIn)
                    return router.push("/Login");
                if(result.user.userRole === "admin")
                    setAdmin(true);
                apiHelper.getAllProducts().then(data => {
                    setProducts(data);
                    setDistinctCategory(fetchDistinctCategories(data));
                });
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, [router]);

    // Filtered list based on search
    const fuse = useMemo(() => {
        return new Fuse(products, {
            keys: ["productName"],
            threshold: 0.4,
            includeScore: true,
        });
    }, [products]);

    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;     // same as before if empty
        return fuse.search(searchQuery).map(result => result.item);
    }, [fuse, products, searchQuery]);

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
        <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-1.5 pt-16 sm:pt-20">
            <NavigationPanel admin={admin} />
            <div className="bg-white shadow-lg rounded-2xl p-1.5 w-full max-w-5xl">
                {/* Header */}
                <div className="bg-yellow-100 border border-gray-200 rounded-xl p-1.5 mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-indigo-500" />
                            {filteredProducts.length} All Products in Inventory
                        </h3>
                    </div>
                </div>
                {/*Search Box */}
                <div className="relative mb-2">
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
                <div className="flex flex-wrap gap-2 mb-4">
                    {distinctCategory.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded text-black ${selectedCategory === cat ? "bg-blue-600" : "bg-gray-200"}`}
                        >
                            {cat}
                        </button>
                    ))}
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
                            {filteredProducts
                                .filter(product => product.productCategory === selectedCategory || selectedCategory === "All")
                                .map((p) => (
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
