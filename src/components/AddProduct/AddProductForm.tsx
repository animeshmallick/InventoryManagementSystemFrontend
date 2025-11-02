"use client";

import React from "react";

interface AddProductFormProps {
    onSubmit: (
        productName: string,
        productQuantity: number,
        productCostPrice: number,
        productSellingPrice: number
    ) => void;
    onNameChange: (name: string) => void;
    loading: boolean;
    productName: string;
    setProductName: React.Dispatch<React.SetStateAction<string>>;
    productQuantity: number;
    setProductQuantity: React.Dispatch<React.SetStateAction<number>>;
    productCostPrice: number;
    setProductCostPrice: React.Dispatch<React.SetStateAction<number>>;
    productSellingPrice: number;
    setProductSellingPrice: React.Dispatch<React.SetStateAction<number>>;
    }

const AddProductForm: React.FC<AddProductFormProps> = ({
   onSubmit,
   onNameChange,
   loading,
    productName,
    setProductName,
    productQuantity,
    setProductQuantity,
    productCostPrice,
    setProductCostPrice,
    productSellingPrice,
    setProductSellingPrice,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "productName":
                setProductName(value);
                onNameChange(value);
                break;
            case "productQuantity":
                setProductQuantity(Number(value));
                break;
            case "productCostPrice":
                setProductCostPrice(Number(value));
                break;
            case "productSellingPrice":
                setProductSellingPrice(Number(value));
                break;
            default:
                break;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!productName || !productQuantity || !productCostPrice || !productSellingPrice) {
            alert("Please fill in all fields");
            return;
        }

        onSubmit(
            productName.trim(),
            productQuantity,
            productCostPrice,
            productSellingPrice,
        );

        // Reset form after submission
        setProductName("");
        setProductQuantity(0);
        setProductCostPrice(0);
        setProductSellingPrice(0);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-gray-700 font-medium">Product Name</label>
                <input
                    type="text"
                    name="productName"
                    placeholder="Enter product name"
                    value={productName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-950"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium">Quantity</label>
                <input
                    type="number"
                    name="productQuantity"
                    placeholder="Enter product quantity"
                    value={productQuantity}
                    onChange={handleChange}
                    min={1}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-950"
                />
            </div>

            <div>
                <label className="block text-gray-700 font-medium">Cost Price (₹)</label>
                <input
                    type="number"
                    name="productCostPrice"
                    placeholder="Enter price"
                    value={productCostPrice}
                    onChange={handleChange}
                    min={1}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-950"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium">Selling Price (₹)</label>
                <input
                    type="number"
                    name="productSellingPrice"
                    placeholder="Enter price"
                    value={productSellingPrice}
                    onChange={handleChange}
                    min={1}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-950"
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
