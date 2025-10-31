"use client";

import React, { useEffect, useState } from "react";
import { verifyLogin, logoutUser } from "@/helpers/LoginHelper";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

const DashboardPage = () => {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const checkLogin = async () => {
            const res = await verifyLogin();
            if (!res?.loggedIn){
                router.push("/Login");
            } else {
                setChecking(false);
            }
        };
        checkLogin();
    }, [router]);

    const handleAction = async (action: string) => {
        router.push(`/${action}`);

    };

    const handleLogout = async () => {
        await logoutUser();
        router.push("/Login");
    };

    if (checking) return <LoadingScreen />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center">
                Welcome to the Dashboard
            </h1>

            <div className="flex flex-wrap justify-center gap-6 mb-10">
                <button
                    onClick={() => handleAction("AddProduct")}
                    className="w-full py-2 rounded-lg font-semibold shadow-md text-white transition bg-blue-600 hover:bg-blue-700"
                >
                    Add Product
                </button>

                <button
                    onClick={() => handleAction("UpdateInventory")}
                    className="w-full py-2 rounded-lg font-semibold shadow-md text-white transition bg-blue-600 hover:bg-blue-700"
                >
                    Update Inventory
                </button>

                <button
                    onClick={() => handleAction("AllProducts")}
                    className="w-full py-2 rounded-lg font-semibold shadow-md text-white transition bg-blue-600 hover:bg-blue-700"
                >
                    Show All Products
                </button>
            </div>

            <button
                onClick={handleLogout}
                className="items-center justify-center p-3 rounded-lg font-semibold shadow-md text-white transition bg-red-500 hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
};

export default DashboardPage;
