"use client";
import React, {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {Product} from "@/blueprint/customBlueprints";
import apiHelper from "@/helpers/ApiHelper";
import Fuse from "fuse.js";
import NavigationPanel from "@/components/NavigationPanel";
import LoadingScreen from "@/components/LoadingScreen";
import SuccessMessage from "@/components/AddProduct/SuccessMessage";
import ProductsInInventory from "@/components/ProductsInInventory";
import {Search, X} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const UpdateInventoryPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [updatedProduct, setUpdatedProduct] = useState<Product | null>(null);
    const [searchName, setSearchName] = useState("");
    const [quantity, setQuantity] = useState<number>(0);
    const [requestType, setRequestType] = useState("sell");
    const [unitPrice, setUnitPrice] = useState<number | null>(0);
    const [admin, setAdmin] = useState(false);
    const [distinctCategory, setDistinctCategory] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");

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

    // Verify login and fetch products
    useEffect(() => {

        apiHelper.verifyLogin()
            .then(res => {
                if (!res.loggedIn)
                    return router.push("/Login");
                if (res?.user.userRole === "admin")
                    setAdmin(true);
                apiHelper.getAllProducts().then(data => {
                    setAllProducts(data);
                    setDistinctCategory(fetchDistinctCategories(data));
                });
            })
            .catch(() => router.push("/Login"))
            .finally(() => setLoading(false));
    }, [router]);

    const productPrice = (requestType === "sell"
        ? selectedProduct?.productSellingPrice
        : selectedProduct?.productCostPrice) ?? 0;

    if(unitPrice === 0 && productPrice !== 0) setUnitPrice(productPrice);

    const fuse = new Fuse(
        selectedCategory === "" || selectedCategory === "All" ? allProducts : allProducts.filter(p => p.productCategory === selectedCategory),
        {
            keys: ["productName", "productCategory"],
            threshold: 0.3,
            includeScore: true,
        }
    );

    // Handle product search
    const handleSearchChange = (typed: string) => {
        setSearchName(typed);
        if (!typed.trim()) {
            setFilteredProducts([]);
            return;
        }
        const matches = fuse.search(typed).map(result => result.item);
        setFilteredProducts(matches.slice(0, 5));
    };

    // Handle Selecting a product
    const handleSelectedProduct = (product:Product) =>{
        setSelectedProduct(product);
        setUpdatedProduct(null);
        setFilteredProducts([]);
        setSearchName("");
    };

    // Handle inventory update
    const handleUpdateInventory = async () => {
        if (!selectedProduct || !requestType) {
            setSuccessMessage("Please select a product and request type");
            return;
        }
        if (unitPrice && (unitPrice <= 0 || quantity <= 0)) {
            setSuccessMessage("Quantity and price must be positive values.");
            return;
        }

        setLoading(true);
        apiHelper.updateInventory(
            selectedProduct.product_id,
            quantity,
            requestType,
            unitPrice ? unitPrice : 0)
        .then(res => {
            if (res?.product) {
                setSuccessMessage("Inventory updated successfully!");
                setUpdatedProduct(res.product);
                setSelectedProduct(res.product);
            } else {
                setSuccessMessage("Failed to update inventory");
            }
        })
        .catch (err => {
            console.error(err);
            setSuccessMessage("Error while updating inventory");
        })
        .finally(() => setLoading(false));
    };

    if (loading) return <LoadingScreen />;

    const categoryFilteredProducts =
        selectedCategory === "All"
            ? allProducts
            : allProducts.filter(
                (p) => p.productCategory === selectedCategory
            );


    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <NavigationPanel admin={admin} />
            <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-2">Update Inventory</h1>

            {(!selectedProduct) && (
                <>
            <div className=" bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg mb-4">

                {/* Search Box */}
                <div className="flex items-center">
                    <Search className="h-5 w-5 text-gray-950 absolute ml-3 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search product by name..."
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-950"
                        value={searchName}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mt-2 mb-4">
                        {distinctCategory.map(cat => (
                            <button
                                key={cat}
                                onClick={() => {setSelectedCategory(cat); setSearchName("");}}
                                className={`px-3 py-1 rounded text-black ${
                                    selectedCategory === cat
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence>
                        {selectedCategory &&
                            !searchName.trim() &&
                            categoryFilteredProducts.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <ProductsInInventory
                                        products={categoryFilteredProducts}
                                        onSelect={handleSelectedProduct}
                                    />
                                </motion.div>
                            )}
                        {/* Matching results */}
                        {searchName.trim() && filteredProducts.length > 0 && (
                            <ProductsInInventory
                                products={filteredProducts}
                                onSelect={handleSelectedProduct}
                            />
                        )}
                        {/* ZERO matches → show nothing (optional message) */}
                        {searchName.trim() && filteredProducts.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="border rounded-xl bg-gray-50 p-2 shadow-inner max-h-64 overflow-y-auto flex items-center justify-center"
                            >
                                <p className="text-sm text-gray-600">No products found</p>
                            </motion.div>
                        )}
                    </AnimatePresence>


            </div>
            </>
            )}

            {/* Inline success or error message */}
            <div className="w-full max-w-lg mb-3">
            <SuccessMessage message={successMessage} product={updatedProduct} />
            </div>



            {/* Product details and update form */}
            {selectedProduct && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="relative bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg">
                    <button
                        onClick={() => {
                            setSelectedProduct(null);
                            setSelectedCategory("");
                            setUnitPrice(0);
                            setQuantity(0);
                            setRequestType("sell");
                        }}
                        className="absolute -top-4 right-4 bg-black text-white w-8 h-8 flex items-center justify-center rounded-full
                                   shadow-lg hover:scale-110 active:scale-95 transition duration-200"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="p-4">
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Product ID
                            </label>
                            <input
                                type="text"
                                value={selectedProduct.product_id}
                                disabled
                                className="w-full p-2 border rounded-lg bg-gray-100 text-gray-950"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={selectedProduct.productName}
                                disabled
                                className="w-full p-2 border rounded-lg bg-gray-100 text-gray-950"
                            />
                        </div>

                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                Current Stock
                            </label>
                            <input
                                type="number"
                                value={selectedProduct.productStock}
                                disabled
                                className="w-full p-2 border rounded-lg bg-gray-100 text-gray-950"
                            />
                        </div>

                        {/* Request type */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Request Type
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-gray-950">
                                    <input
                                        type="radio"
                                        name="requestType"
                                        className="text-gray-950"
                                        value="sell"
                                        checked={requestType === "sell"}
                                        onChange={() => setRequestType("sell")}
                                    />
                                    Sell
                                </label>
                                <label className="flex items-center gap-2 text-gray-950">
                                    <input
                                        type="radio"
                                        name="requestType"
                                        className="text-gray-950"
                                        value="procure"
                                        checked={requestType === "procure"}
                                        onChange={() => setRequestType("procure")}
                                    />
                                    Buy
                                </label>

                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg text-gray-950"
                                placeholder="Enter Quantity"
                                value={quantity === 0 ? "" : quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />
                        </div>

                        {/* Unit price */}
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-950 mb-1">
                                {requestType === "sell" ? "Selling Price" : "Cost price"}
                            </label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg text-gray-950"
                                placeholder="Enter unit price"
                                value={(unitPrice === null ? "" : unitPrice)}
                                onChange={(e) =>{
                                    const val = e.target.value;
                                if (val === "") setUnitPrice(null)
                                    else setUnitPrice(Number(val))
                                }}
                            />
                        </div>
                    </div>

                    {/* Update Button */}
                    <button
                        onClick={handleUpdateInventory}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition"
                    >
                        {loading ? "Updating..." : "Update Inventory"}
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default UpdateInventoryPage;
