"use client";

import React, { useState } from "react";

interface UpdateInventoryFormProps {
    onSubmit: (data: {
        productId: string;
        productQuantity: number;
        productCostPrice: number;
        productSellingPrice: number;
        requestType: string;
    }) => void;
    loading: boolean;
}

const UpdateInventoryForm: React.FC<UpdateInventoryFormProps> = ({onSubmit,loading}) => {
    const [formData, setFormData] = useState({
        productId: "",
        productQuantity: "",
        productCostPrice: 0,
        productSellingPrice: 0,
        requestType: "procure",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const { productId, productQuantity, productCostPrice, productSellingPrice, requestType } = formData;
        if (!productId || !productQuantity || !productCostPrice || !productSellingPrice) {
            alert("Please fill all fields");
            return;
        }

        onSubmit({
            productId,
            productQuantity: Number(productQuantity),
            productSellingPrice: Number(productSellingPrice),
            productCostPrice: Number(productCostPrice),
            requestType,
        });

        // Do not reset immediately — user should see current data
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product ID */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    Product ID
                </label>
                <input
                    type="text"
                    name="productId"
                    placeholder="Enter product ID"
                    value={formData.productId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                />
            </div>

            {/* Quantity */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    Quantity
                </label>
                <input
                    type="number"
                    name="productQuantity"
                    placeholder="Enter quantity"
                    value={formData.productQuantity}
                    onChange={handleChange}
                    required
                    min={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                />
            </div>

            {/* Price */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    Cost Price (₹)
                </label>
                <input
                    type="number"
                    name="productSellingPrice"
                    placeholder="Enter price"
                    value={formData.productSellingPrice}
                    onChange={handleChange}
                    required
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                />
            </div>

            {/* Request Type */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    Request Type
                </label>
                <select
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
                >
                    <option value="procure">Procure (Add Stock)</option>
                    <option value="sell">Sell (Reduce Stock)</option>
                </select>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-lg bg-blue-600 font-semibold text-white transition ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-600 hover:bg-yellow-700"
                }`}
            >
                {loading ? "Updating..." : "Update Inventory"}
            </button>
        </form>
    );
};

export default UpdateInventoryForm;
