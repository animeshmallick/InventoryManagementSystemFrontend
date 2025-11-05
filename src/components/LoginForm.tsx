"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "./PasswordInput";
import apiHelper from "@/helpers/ApiHelper";

const LoginForm = () => {
    const router = useRouter();
    const [phone, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        switch(name) {
            case "phone":
                setPhoneNumber(value);
                break;
            case "password":
                setPassword(value);
                break;
            default:
                break;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        apiHelper.loginUser(Number(phone), password)
            .then((result) => {
                if (result.success)
                    router.push("/Dashboard");
                else{
                    setLoading(false);
                    router.push("/Login");
                }
            })
            .catch((err) => {
                setLoading(false);
                router.push("/Login");
            })
    };

    return (
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Phone Number */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Enter 10-digit phone number"
                        value={phone}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-950"
                    />
                </div>

            <PasswordInput value={password} onChange={handleChange} />

            <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
        </div>
    );
};

export default LoginForm;
