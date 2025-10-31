"use client";

import React from "react";
import { useRouter } from "next/navigation";

const BackToDashboardButton: React.FC = () => {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push("/Dashboard")}
            className="w-full max-w-lg mt-4 px-2 py-2 rounded-lg font-semibold shadow-md text-white transition bg-red-500 hover:bg-red-700"
        >
            ← Back to Dashboard
        </button>
    );
};

export default BackToDashboardButton;
