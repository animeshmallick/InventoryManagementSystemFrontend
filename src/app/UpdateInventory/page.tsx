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
import BackToDashboard from "@/components/BackToDashboard";
import {Search} from "lucide-react";

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
    const [requestType, setRequestType] = useState("");
    const [unitPrice, setUnitPrice] = useState(0);
    const [admin, setAdmin] = useState(false);

    // 🔹 Verify login and fetch products
    useEffect(() => {

        apiHelper.verifyLogin()
            .then(res => {
                if (!res.loggedIn)
                    return router.push("/Login");
                if (res?.user.userRole === "admin")
                    setAdmin(true);
                apiHelper.getAllProducts().then(data => setAllProducts(data));
            })
            .catch(() => router.push("/Login"))
            .finally(() => setLoading(false));
    }, [router]);

    const fuse = new Fuse(allProducts, {
        keys: ["productName", "productCategory"],
        threshold: 0.3,
        includeScore: true,
    });

    // 🔹 Handle product search
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
        setSearchName(product.productName);
    };

    // 🔹 Handle inventory update
    const handleUpdateInventory = async () => {
        if (!selectedProduct || !requestType) {
            setSuccessMessage("Please select a product and request type");
            return;
        }
        if (quantity <= 0 || unitPrice <= 0) {
            setSuccessMessage("Quantity and price must be positive values.");
            return;
        }

        setLoading(true);
        apiHelper.updateInventory(
            selectedProduct.product_id,
            quantity,
            requestType,
            unitPrice)
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-2">
            <NavigationPanel admin={admin} />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Update Inventory</h1>

            {/* Search Box */}
            <div className=" bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg mb-4">
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

                {/* Matching results */}
                {filteredProducts.length > 0 && (
                    <ProductsInInventory
                        products={filteredProducts}
                        onSelect={handleSelectedProduct}
                    />
                )}
            </div>

            {/* Inline success or error message */}
            <div className="w-full max-w-lg mb-3">
            <SuccessMessage message={successMessage} product={updatedProduct} />
            </div>



            {/* Product details and update form */}
            {selectedProduct && (
                <div className="bg-white shadow-lg rounded-2xl p-4 w-full max-w-lg">
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
                                    value="procure"
                                    checked={requestType === "procure"}
                                    onChange={() => setRequestType("procure")}
                                />
                                Procure
                            </label>
                            <label className="flex items-center gap-2 text-gray-950">
                                <input
                                    type="radio"
                                    name="requestType"
                                    value="sell"
                                    checked={requestType === "sell"}
                                    onChange={() => setRequestType("sell")}
                                />
                                Sell
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
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </div>

                    {/* Per unit price */}
                    <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Per Unit Price
                        </label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded-lg text-gray-950"
                            value={unitPrice}
                            onChange={(e) => setUnitPrice(Number(e.target.value))}
                        />
                    </div>

                    {/* Update Button */}
                    <button
                        onClick={handleUpdateInventory}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition"
                    >
                        {loading ? "Updating..." : "Update Inventory"}
                    </button>
                </div>
            )}

            {/* Back to Dashboard */}
            <BackToDashboard />
        </div>
    );
};

export default UpdateInventoryPage;
