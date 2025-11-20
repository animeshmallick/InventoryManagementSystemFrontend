"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import NavigationPanel from "@/components/NavigationPanel";
import LoadingScreen from "@/components/LoadingScreen";
import OrderCard from "@/components/OrderCard";
import { Transaction } from "@/blueprint/customBlueprints";
import { AnimatePresence } from "framer-motion";
import apiHelper from "@/helpers/ApiHelper";
import { ShoppingBag } from "lucide-react";
import MessageToast from "@/components/MessageToast";

const parseDate = (dateStr: string): Date => {
    const [d, m, y] = dateStr.replace(/\//g, "-").split("-").map(Number);
    return new Date(y, m - 1, d);
};

const ShowAllOrdersPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [admin, setAdmin] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [requestType, setRequestType] = useState<"sell" | "procure">("sell");
    const [dateFilter, setDateFilter] = useState("today");
    const [toast, setToast] = useState({
        visible: false,
        message: "",
        type: "success" as "success" | "error" | "info",
    });

    const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        setToast({ visible: true, message, type });
    };

    useEffect(() => {
        apiHelper.verifyLogin()
            .then(result => {
                if (!result.loggedIn)
                    return router.push("/Login");
                if(result.user.userRole === "admin")
                    setAdmin(true);
                apiHelper.getAllOrders()
                    .then(data => {
                    setTransactions(data.allOrders);
                });
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, [router]);

    const filteredOrders = useMemo(() => {
        return transactions.filter((tx) => {
            if (!tx || !tx.orderDate) return false;
            if (tx.requestType !== requestType) return false;
            const orderDate = parseDate(tx.orderDate);
            const now = new Date();

            if (requestType !== tx.requestType) return false;

            if (dateFilter === "today") {
                return orderDate.toDateString() === now.toDateString();
            }

            if (dateFilter === "yesterday") {
                const y = new Date();
                y.setDate(now.getDate() - 1);
                return orderDate.toDateString() === y.toDateString();
            }

            if (dateFilter === "last7") {
                const week = new Date();
                week.setDate(now.getDate() - 7);
                return orderDate >= week && orderDate <= now;
            }

            if (dateFilter === "thisMonth") {
                return (
                    orderDate.getMonth() === now.getMonth() &&
                    orderDate.getFullYear() === now.getFullYear()
                );
            }

            if (dateFilter === "lastMonth") {
                const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                return (
                    orderDate.getMonth() === last.getMonth() &&
                    orderDate.getFullYear() === last.getFullYear()
                );
            }

            return true;
        });
    }, [transactions, requestType, dateFilter]);


    const dateFilterLabels: Record<string, string> = {
        today: "today",
        yesterday: "yesterday",
        last7: "last 7 days",
        thisMonth: "this month",
        lastMonth: "last month",
    };

    const handleCancelOrder = (orderId: string) => {
        if (!window.confirm("Are you sure you want to cancel this transaction?")) return;
        setLoading(true);
        apiHelper.deleteOrder(orderId)
            .then((res) => {
                if (res.success) {
                    setTransactions((prev) =>
                        prev.filter((tx) => tx.order_id !== orderId)
                    );
                    showToast(res.message, "success");
                } else {
                    showToast("Failed to cancel the order", "error");
                }

                })
            .catch((err) => {
                console.error("Failed to delete past transactions:", err);
                showToast("Failed to delete order", "error");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <NavigationPanel admin={admin} />

            <div className="bg-white shadow-lg rounded-2xl p-2 w-full max-w-5xl">

                {/* HEADER */}
                <div className="bg-yellow-100 border border-gray-200 rounded-xl p-2 mb-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-indigo-500" />
                            {filteredOrders.length} Orders
                        </h3>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-4">
                    {/* REQUEST TYPE DROPDOWN */}
                    <select
                        value={requestType}
                        onChange={(e) => setRequestType(e.target.value as "sell" | "procure")}
                        className="px-2 py-0.5 rounded-lg border-gray-300 bg-gray-50 text-gray-800 shadow-sm"
                    >
                        <option className="text-gray-800 text-xs" value="sell">Sell</option>
                        <option className="text-gray-800 text-xs" value="procure">Buy</option>
                    </select>


                    {/* DATE FILTER DROPDOWN */}
                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-2 py-0.5 rounded-lg border-gray-300 bg-gray-50 text-gray-800 shadow-sm"
                    >
                        <option className="text-gray-800 text-xs" value="today">Today</option>
                        <option className="text-gray-800 text-xs" value="yesterday">Yesterday</option>
                        <option className="text-gray-800 text-xs" value="last7">Last 7 Days</option>
                        <option className="text-gray-800 text-xs" value="thisMonth">This Month</option>
                        <option className="text-gray-800 text-xs" value="lastMonth">Last Month</option>
                    </select>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <LoadingScreen />
                ) : filteredOrders.length === 0 ? (
                    <p className="text-gray-600 text-center py-10 text-lg">
                        No {requestType} transactions for {dateFilterLabels[dateFilter]}.
                    </p>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {filteredOrders.map((order) => (
                                <OrderCard
                                    key={order.order_id}
                                    tx={order}
                                    onCancel={handleCancelOrder}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            <MessageToast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />
        </div>
    );
};

export default ShowAllOrdersPage;
