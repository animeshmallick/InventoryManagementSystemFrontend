"use client";
import { motion } from "framer-motion";
import React from "react";

export default function LoadingScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">


            {/* Pulse Text */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-lg font-medium tracking-wide text-gray-200"
            >
                Loading, please wait...
            </motion.p>

            {/* Floating shimmer bar */}
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: [40, 0, 40], opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mt-10 w-48 h-1.5 bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-400 rounded-full"
            />
        </div>
    );
}
