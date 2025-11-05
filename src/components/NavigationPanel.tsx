"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, ArrowLeft } from "lucide-react";
import apiHelper from "@/helpers/ApiHelper";

interface NavigationPanelProps {
    admin: boolean;
}

const NavigationPanel: React.FC<NavigationPanelProps> = ({ admin }) => {
    const [isOpen, setIsOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // 🟩 Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleNavigate = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    const handleLogout = async ()  => {
        apiHelper.logoutUser()
            .then((result) => {
                if (result.success)
                    return router.push("/Login");
            })
            .catch(err => console.log(err));
    };

    return (
        <>
            <header
                className="fixed top-0 left-0 w-full flex items-center justify-between
                bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 sm:px-6 py-3 shadow-md z-50"
            >
                {/* Hamburger Icon */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center justify-center w-10 h-10 rounded-md
                        bg-white/20 hover:bg-white/30 transition text-blue-100 hover:text-white"
                    >
                        {isOpen ? <ArrowLeft size={26} /> : <Menu size={26} />}
                    </button>
                <h1 className="text-base sm:text-lg md:text-xl font-semibold tracking-wide text-center flex-1 mx-3 sm:mx-6 truncate">
                    Inventory Management System
                </h1>
                {/*<div className="w-10" />*/}
            </header>
            {/* 🟩 Slide-out Navigation Panel */}
            <div
                ref={panelRef}
                className={`fixed top-[4rem] left-0 h-[calc(100%-4rem)] bg-gradient-to-b from-blue-50 to-blue-100 shadow-2xl border-r border-blue-200 transition-transform duration-300 ease-in-out z-40
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                w-3/5 sm:w-2/5 md:w-1/4 lg:w-[30%]`}
            >
                <div className="p-3 flex flex-col gap-4">
                    <ul className="space-y-3 mt-4 text-gray-800 font-medium">
                        <li
                            className="cursor-pointer bg-white text-blue-700 font-semibold rounded-xl
                            shadow-sm hover:shadow-md hover:bg-blue-100 px-4 py-3 text-center transition"
                            onClick={() => handleNavigate("/Dashboard")}
                        >
                            Dashboard
                        </li>
                        {admin && (
                            <li
                                className="cursor-pointer bg-white text-blue-700 font-semibold rounded-xl
                                shadow-sm hover:shadow-md hover:bg-blue-100 px-4 py-3 text-center transition"
                                onClick={() => handleNavigate("/AddProduct")}
                            >
                                Add Product
                            </li>
                        )}
                        <li
                            className="cursor-pointer bg-white text-blue-700 font-semibold rounded-xl
                            shadow-sm hover:shadow-md hover:bg-blue-100 px-4 py-3 text-center transition"
                            onClick={() => handleNavigate("/UpdateInventory")}
                        >
                            Update Product
                        </li>
                        <li
                            className="cursor-pointer bg-white text-blue-700 font-semibold rounded-xl
                            shadow-sm hover:shadow-md hover:bg-blue-100 px-4 py-3 text-center transition"
                            onClick={() => handleNavigate("/AllProducts")}
                        >
                            Show All Products
                        </li>
                        <li
                            className="cursor-pointer bg-white text-red-500 font-semibold rounded-xl
                            shadow-sm hover:shadow-md hover:bg-red-100 px-4 py-3 text-center transition"
                            onClick={() => handleLogout()}
                        >
                            Logout
                        </li>
                    </ul>
                </div>
            </div>

            {/* 🟨 Overlay (optional) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-40 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default NavigationPanel;
