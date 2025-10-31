"use client";

import React from "react";

interface SuccessMessageProps {
    message: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
    if (!message) return null;

    return (
        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-6 w-full max-w-lg text-center shadow-sm">
            <span className="font-medium">✅ {message}</span>
        </div>
    );
};

export default SuccessMessage;
