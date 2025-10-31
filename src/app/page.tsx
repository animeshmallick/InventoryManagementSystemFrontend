"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 font-sans">
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-10 max-w-md w-full"
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            Welcome to Inventory Management System
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Manage your products, stock, and pricing all in one place.
          </p>
          <button
              onClick={() => router.push("/Login")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-full shadow-md transition-all"
          >
            <LogIn className="w-5 h-5" />
            Login to Continue
          </button>
        </motion.main>
      </div>
  );
}
