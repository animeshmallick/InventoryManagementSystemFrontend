"use client";

import React from "react";
import {Product} from "@/blueprint/customBlueprints";

interface SuccessMessageProps {
    message: string | null;
    product: Product | null;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, product }) => {
    if (!message) return null;

    return (
        <div className="bg-green-100 border border-green-400 text-green-800 p-2 rounded mb-2 w-full max-w-lg text-center shadow-sm">
            <div className="mb-2 font-bold">✅ {message}</div>
            {product && (
                <div className="bg-white shadow-md rounded-xl p-2 w-full max-w-lg border border-gray-200">
                    <div className="text-gray-700">
                        <div className="font-bold flex justify-around items-center">
                            <div><strong>Name:</strong> {product.productName} </div>
                        </div>
                        <div className="flex justify-around items-center">
                            <div><strong>ID:</strong> {product.product_id} </div>
                            <div><strong>Category:</strong> {product.productCategory}</div>
                        </div>
                        <div className="flex justify-around items-center">
                            <div><strong>Selling Price:</strong> ₹{product.productSellingPrice} </div>
                            <div><strong>Cost Price:</strong> ₹{product.productCostPrice}</div>
                        </div>
                        <div><strong>Updated At:</strong> {new Date(product.lastUpdatedAt).toLocaleString("en-IN")}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuccessMessage;
