"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import {Product} from "@/blueprint/customBlueprints";
import DisplayProductCompactContainer from "@/components/DisplayProductCompactContainer";

interface SimilarProductsProps {
    products: Product[];
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ products}) => {
    if (!products || products.length === 0)
        return null;

    return (
        <div className="my-2">
            {/* Header Box */}
            <div className="bg-yellow-200 border border-gray-200 shadow-sm rounded-xl px-3 py-1.5 mb-2 flex items-center justify-between">
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
                    <DisplayProductCompactContainer key={p.product_id} product={p} />
                ))}
            </div>
        </div>
    );
};

export default SimilarProducts;
