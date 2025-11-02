"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import {Product} from "@/blueprint/customBlueprints";

interface SimilarProductsProps {
    products: Product[];
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ products}) => {
    if (!products || products.length === 0)
        return null;

    return (
        <div className="mt-8">
            {/* Header Box */}
            <div className="bg-yellow-200 border border-gray-200 shadow-sm rounded-xl px-3 py-1.5 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-indigo-500" />
                        Products in your inventory
                    </h3>
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {products.map((p) => (
                    <motion.div
                        key={p.product_id}
                        initial={{ opacity: 1, y: 15 }}
                        transition={{ duration: 0.2 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-3 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-indigo-300 hover:bg-indigo-50"

                    >
                        <p className="font-semibold text-gray-800 text-base mb-1">
                            {p.productName}
                        </p>

                        <p className="text-sm text-gray-600 mb-0.5">
                            <span className="font-medium text-gray-700">Stock:</span>{" "}
                            {p.productStock}
                        </p>

                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Cost Price:</span>{" "}
                            ₹{p.productCostPrice.toLocaleString()}
                        </p>

                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Selling Price:</span>{" "}
                            ₹{p.productSellingPrice.toLocaleString()}
                        </p>

                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-700">Last updated at:</span>{" "}
                            {new Date(p.lastUpdatedAt).toLocaleString("en-IN")}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default SimilarProducts;
