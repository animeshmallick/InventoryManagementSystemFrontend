"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info } from "lucide-react";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    visible: boolean;
    onClose: () => void;
}

const MessageToast: React.FC<ToastProps> = ({
                                                message,
                                                type = "info",
                                                visible,
                                                onClose,
                                            }) => {

    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => onClose(), 3000);
        return () => clearTimeout(timer);
    }, [visible, onClose]);

    const style = {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-blue-600",
    }[type];

    const Icon = {
        success: CheckCircle,
        error: XCircle,
        info: Info,
    }[type];

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.25 }}
                    className={`fixed bottom-6 left-1/2 -translate-x-1/2 text-white px-4 py-2 
                      rounded-lg shadow-lg flex items-center gap-2 ${style} z-50`}
                >
                    <Icon size={18} className="text-white" />
                    <span className="text-sm">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MessageToast;
