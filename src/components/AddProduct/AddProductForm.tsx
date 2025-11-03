"use client";

import React, {useState, useEffect, useRef} from "react";
import {ChevronDown} from "lucide-react";
import Fuse from "fuse.js";

interface AddProductFormProps {
    onSubmit: (
        productName: string,
        productCategory: string,
        productCostPrice: number,
        productSellingPrice: number
    ) => void;
    onNameChange: (name: string) => void;
    loading: boolean;
    productName: string;
    setProductName: React.Dispatch<React.SetStateAction<string>>;
    productCategory: string;
    setProductCategory: React.Dispatch<React.SetStateAction<string>>;
    productCostPrice: number;
    setProductCostPrice: React.Dispatch<React.SetStateAction<number>>;
    productSellingPrice: number;
    setProductSellingPrice: React.Dispatch<React.SetStateAction<number>>;
    categories: string[];
    }

const AddProductForm: React.FC<AddProductFormProps> = ({
   onSubmit,
   onNameChange,
   loading,
    productName,
    setProductName,
    productCategory,
    setProductCategory,
    productCostPrice,
    setProductCostPrice,
    productSellingPrice,
    setProductSellingPrice,
    categories,
}) => {
    const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const fuse = new Fuse(categories,{
        threshold: 0.5,
        includeScore: true,
    })

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        // 🟩 Whenever categories change, update filteredCategories too
        setFilteredCategories(categories);
    }, [categories]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch (name) {
            case "productName":
                setProductName(value);
                onNameChange(value);
                break;
            case "productCategory":
                setProductCategory(value);
                if(value.trim()) {
                    const results = fuse.search(value);
                    const filtered = results.map((r) => r.item);
                    setFilteredCategories(filtered);
                    }else setFilteredCategories(categories);
                    setShowDropdown(true);
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

        if (!productName || !productCategory || !productCostPrice || !productSellingPrice) {
            alert("Please fill in all fields");
            return;
        }


        onSubmit(
            productName.trim(),
            productCategory.trim(),
            productCostPrice,
            productSellingPrice,
        );

        // Reset form after submission
        setProductName("");
        setProductCategory("");
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

            <div className="relative">
                <label className="block text-gray-700 font-medium">Product Category</label>
                <input
                    type="text"
                    name="productCategory"
                    placeholder="Enter product category"
                    value={productCategory}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-950"
                    autoComplete="off"
                />
                {/* 🟩 Dropdown toggle icon */}
                <button
                    type="button"
                    onClick={() => setShowDropdown((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1} // prevent losing focus when clicking icon
                >
                    <ChevronDown className={`w-5 h-5 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                </button>

            {/* 🟩 Dropdown List */}
            {showDropdown && filteredCategories.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-md">
                    {filteredCategories.map((category, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                setProductCategory(category);
                                setShowDropdown(false);
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-black"
                        >
                            {category}
                        </li>
                    ))}
                </ul>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium">Cost Price (₹)</label>
                <input
                    type="text"
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
                    type="text"
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
