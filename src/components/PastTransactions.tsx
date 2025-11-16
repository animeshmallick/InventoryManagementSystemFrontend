"use client";

import React, { useEffect, useState, useMemo } from "react";
import apiHelper from "@/helpers/ApiHelper";
import { Transaction } from "@/blueprint/customBlueprints";
import {Trash2} from "lucide-react";

const parseDate = (dateStr: string) => {
    const norm = dateStr.replace(/\//g, "-");
    const [d, m, y] = norm.split("-").map(Number);
    return new Date(y, m - 1, d);
};

const isToday = (dateStr: string) => {
    const d = parseDate(dateStr);
    const t = new Date();
    return d.toDateString() === t.toDateString();
};
const isYesterday = (dateStr: string) => {
    const d = parseDate(dateStr);
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return d.toDateString() === y.toDateString();
};
const isLast7Days = (dateStr: string) => {
    const d = parseDate(dateStr);
    const t = new Date();
    const s = new Date();
    s.setDate(t.getDate() - 7);
    return d >= s && d <= t;
};
const isThisMonth = (dateStr: string) => {
    const d = parseDate(dateStr);
    const t = new Date();
    return d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
};
const isLastMonth = (dateStr: string) => {
    const d = parseDate(dateStr);
    const t = new Date();
    let lm = t.getMonth() - 1;
    let y = t.getFullYear();
    if (lm < 0) { lm = 11; y--; }
    return d.getMonth() === lm && d.getFullYear() === y;
};

interface PastTransactionsProps {
    productId: string;
    editMode: boolean;
    refreshProduct: () => void;
}

const PastTransactions: React.FC<PastTransactionsProps> = ({ productId, editMode, refreshProduct }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState("today");
    const [typeFilter, setTypeFilter] = useState("sell");

    const loadTransactions = () => {
        apiHelper
            .getPastTransactions(productId)
            .then((res) => {
                setLoading(true);
                const tx = res?.transactions || [];
                setTransactions(tx);
                setTypeFilter("sell");

                if (tx.length > 0) {
                    if (tx.some((t) => isToday(t.orderDate))) setDateFilter("today");
                    else if (tx.some((t) => isYesterday(t.orderDate))) setDateFilter("yesterday");
                    else if (tx.some((t) => isLast7Days(t.orderDate))) setDateFilter("last7");
                    else if (tx.some((t) => isThisMonth(t.orderDate))) setDateFilter("thisMonth");
                    else setDateFilter("lastMonth");
                }
            })
            .catch((err) => {
                console.error("Failed to load past transactions:", err);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadTransactions();
    }, [productId]);

    const handleCancel = (orderId:string) => {
        setLoading(true);
        if (!window.confirm("Are you sure you want to cancel this transaction?")) return;
        apiHelper.deleteOrder(orderId)
            .then((res) =>{
                loadTransactions();
                refreshProduct();
            })
            .catch((err) => {
                console.error("Failed to load past transactions:", err);
            })
            .finally(() => setLoading(false));
    };

    const filteredTransactions = useMemo(() => {
        let list = [...transactions];

        list = list.filter(t => {
            if (dateFilter === "today") return isToday(t.orderDate);
            if (dateFilter === "yesterday") return isYesterday(t.orderDate);
            if (dateFilter === "last7") return isLast7Days(t.orderDate);
            if (dateFilter === "thisMonth") return isThisMonth(t.orderDate);
            if (dateFilter === "lastMonth") return isLastMonth(t.orderDate);
            return true;
        });

        list = list.filter(t => t.requestType === typeFilter);

        return list;
    }, [transactions, dateFilter, typeFilter]);

    const totals = useMemo(
        () =>
            filteredTransactions.reduce(
                (acc, t) => {
                    acc.qty += t.quantity;
                    acc.amount += t.totalOrderAmount;
                    return acc;
                },
                { qty: 0, amount: 0 }
            ),
        [filteredTransactions]
    );

    if (editMode) return null;

    return (
        <div className="w-full max-w-4xl mt-5">
            <div className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Past Transactions</h3>

                {loading ? (
                    <p className="text-center text-gray-600 animate-pulse">Loading transactions...</p>
                ) : transactions.length === 0 ? (
                    <p className="text-gray-600">No past transactions found.</p>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border-gray-300 bg-gray-50 text-gray-800 shadow-sm"
                            >
                                <option value="sell">Sell</option>
                                <option value="procure">Procure</option>
                            </select>

                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="px-3 py-2 rounded-lg border-gray-300 bg-gray-50 text-gray-800 shadow-sm"
                            >
                                <option value="today">Today</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="last7">Last 7 Days</option>
                                <option value="thisMonth">This Month</option>
                                <option value="lastMonth">Last Month</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredTransactions.map((t, i) => (
                                <div
                                    key={i}
                                    className={`relative rounded-2xl p-3 shadow-sm backdrop-blur-md border transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                                                ${t.requestType === "sell"
                                                ? "bg-emerald-50/60 border-emerald-200 hover:border-emerald-300"
                                                : "bg-blue-50/60 border-blue-200 hover:border-blue-300"
                                                }
                                    `}
                                >
                                    {/* Button */}
                                    <button
                                        onClick={() => handleCancel(t.order_id)}
                                        className="absolute top-4 mb-2 right-4 flex items-center gap-1.5 text-red-500 hover:text-red-600
                                                   text-xs font-semibold transition-colors"
                                    >
                                        <Trash2 size={15} strokeWidth={2}/>
                                        <span>Cancel Order</span>
                                    </button>
                                    {/* Date & Time */}
                                    <div className="flex items-start justify-between text-gray-700 mt-6 mb-2 font-semibold">
                                        <div className="flex flex-col text-xs">
                                            <span className="text-gray-600">Order Date</span>
                                            <span className="text-gray-600">{t.orderDate}</span>
                                        </div>

                                        <div className="flex flex-col text-xs text-right">
                                            <span className="text-gray-600">Order Time</span>
                                            <span className="text-gray-600">{t.orderTime}</span>
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div className="grid grid-cols-3 gap-2 text-gray-700 text-sm font-semibold">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] text-gray-600">Unit Price</span>
                                            <span className="font-bold text-gray-600">₹{t.unitPrice}</span>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <span className="text-[11px] text-gray-600">Quantity</span>
                                            <span className="font-bold text-gray-600">{t.quantity}</span>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <span className="text-[11px] text-gray-600">Total</span>
                                            <span className="font-bold text-gray-600">₹{t.totalOrderAmount}</span>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>

                        <div className="sticky bottom-2 mt-6 p-4 bg-yellow-400 rounded-xl flex justify-between font-semibold shadow-sm">
                            <span>Total Quantity: {totals.qty}</span>
                            <span>Total Amount: ₹{totals.amount}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PastTransactions;
