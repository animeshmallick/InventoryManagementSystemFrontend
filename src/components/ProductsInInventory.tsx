"use client";

import React from "react";
import { Product } from "@/blueprint/customBlueprints";

interface ProductsInInventoryProps {
    products: Product[];
    onSelect: (product: Product) => void;
}

const ProductsInInventory: React.FC<ProductsInInventoryProps> = ({ products, onSelect }) => {
    if (products.length === 0) return null;

    return (
        <div className="border rounded-xl bg-gray-50 p-2 shadow-inner max-h-64 overflow-y-auto">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 px-2">
                Existing Products in Inventory
            </h3>

            <div className="grid gap-2">
                {products.map((p) => (
                    <div
                        key={p.product_id}
                        onClick={() => onSelect(p)}
                        className="cursor-pointer bg-white border border-gray-200 hover:border-blue-400 rounded-lg p-3 shadow-sm hover:shadow-md transition"
                    >
                        <p className="text-sm font-medium text-gray-800">{p.productName}</p>
                        <p className="text-xs text-gray-500">
                            ID: {p.product_id} | Category: {p.productCategory}
                        </p>
                        <p className="text-xs text-gray-600">Stock: {p.productStock}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsInInventory;
