"use client";

import React, { useState } from "react";

const PasswordInput = ({ value, onChange }: { value: string; onChange: any }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full">
            <label className="block text-gray-700 font-medium mb-2">
                Password
            </label>
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={value}
                onChange={onChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
            <button
                type="button"
                className="absolute right-3 top-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? "🙈" : "👁️"}
            </button>
        </div>
    );
};

export default PasswordInput;
