"use client";

import React from "react";
import { Transaction } from "@/blueprint/customBlueprints";
import { Trash2 } from "lucide-react";

interface OrderCardProps {
    tx: Transaction & {productName: string};
    onCancel?: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ tx, onCancel }) => {
    const isSell = tx.requestType === "sell";

    return (
        <div
            className={`relative rounded-2xl p-4 shadow-sm border transition-all duration-300 
                hover:shadow-xl hover:-translate-y-1
                ${isSell
                ? "bg-emerald-50/60 border-emerald-200 hover:border-emerald-300"
                : "bg-blue-50/60 border-blue-200 hover:border-blue-300"
            }`}
        >

            {/* Request Type Badge */}
            <div className={`absolute -top-2 left-4 px-2 py-[2px] text-xs font-semibold rounded-md
                shadow-sm text-white
                ${isSell ? "bg-emerald-500" : "bg-blue-500"
            }`}
            >
                {tx.requestType.toUpperCase()}
            </div>

            {/* Cancel button */}
            {onCancel && (
                <button
                    onClick={() => onCancel(tx.order_id)}
                    className="absolute top-3 right-3 flex items-center gap-1.5
                               text-red-500 hover:text-red-600 text-xs font-semibold transition-colors"
                >
                    <Trash2 size={15} />
                    <span>Cancel</span>
                </button>
            )}

            {/* Product */}
            <p className="text-[11px] font-bold text-gray-800 mb-1 mt-2">
                Product
            </p>
            <p className="text-[11px] text-gray-700 mb-2">
                {tx.product_id} || {tx.productName}
            </p>

            {/* Date & Time */}
            <div className="flex items-center justify-between text-gray-700 mb-1 text-sm">
                <div className="flex flex-col">
                    <span className="text-gray-800 text-[11px] font-bold">Order Date</span>
                    <span className="text-[11px] text-gray-700">{tx.orderDate}</span>
                </div>

                <div className="flex flex-col text-right">
                    <span className="text-gray-800 text-[11px] font-bold">Order Time</span>
                    <span className="text-[11px] text-gray-700">{tx.orderTime}</span>
                </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-2 text-gray-700 text-sm font-semibold">
                <div className="flex flex-col">
                    <span className="text-[11px] text-gray-800 font-bold">Unit Price</span>
                    <span className="text-[11px] text-gray-700">₹{tx.unitPrice}</span>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-[11px] text-gray-800 font-bold ">Quantity</span>
                    <span className="text-[11px] text-gray-700">{tx.quantity}</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[11px] text-gray-800 font-bold">Total</span>
                    <span className="text-[11px] text-gray-700">₹{tx.totalOrderAmount}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
