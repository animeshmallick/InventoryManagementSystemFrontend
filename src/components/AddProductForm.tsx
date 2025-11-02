"use client";

import React from "react";

interface AddProductFormProps {
    onSubmit: (data: {
        productName: string;
        productQuantity: number;
        productCostPrice: number;
        productSellingPrice: number
    }) => void;
    onNameChange: (name: string) => void;
    loading: boolean;
    formData: {
        productName: string;
        productQuantity: number;
        productCostPrice: number;
        productSellingPrice: number
    };
    setFormData: React.Dispatch<
        React.SetStateAction<{
            productName: string;
            productQuantity: number;
            productCostPrice: number;
            productSellingPrice: number
        }>
    >;

}

const AddProductForm: React.FC<AddProductFormProps> = ({onSubmit, onNameChange, loading, formData, setFormData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Only trigger similar product search when typing product name
        if (name === "productName") {
            onNameChange(value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { productName, productQuantity, productCostPrice, productSellingPrice } = formData;

        if (!productName || !productQuantity || !productCostPrice || !productSellingPrice) {
            alert("Please fill in all fields");
            return;
        }

        onSubmit({
            productName: productName.trim(),
            productQuantity: Number(productQuantity),
            productCostPrice: Number(productCostPrice),
            productSellingPrice: Number(productSellingPrice),
        });

        // Reset form after submission
        setFormData({ productName: "", productQuantity: 0, productCostPrice: 0, productSellingPrice: 0 });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-gray-700 font-medium mb-2">Product Name</label>
                <input
                    type="text"
                    name="productName"
                    placeholder="Enter product name"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                <input
                    type="number"
                    name="productQuantity"
                    placeholder="Enter product quantity"
                    value={formData.productQuantity}
                    onChange={handleChange}
                    min={1}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Selling Price (₹)</label>
                <input
                    type="number"
                    name="productSellingPrice"
                    placeholder="Enter price"
                    value={formData.productSellingPrice}
                    onChange={handleChange}
                    min={1}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium mb-2">Cost Price (₹)</label>
                <input
                    type="number"
                    name="productCostPrice"
                    placeholder="Enter price"
                    value={formData.productCostPrice}
                    onChange={handleChange}
                    min={1}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 rounded-lg font-semibold shadow-md text-white transition ${
                    loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {loading ? "Adding..." : "Add Product"}
            </button>
        </form>
    );
};

export default AddProductForm;
