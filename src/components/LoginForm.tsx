"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import PasswordInput from "./PasswordInput";
import ApiHelper from "@/helpers/ApiHelper";
import {LoginResponse} from "@/blueprint/blueprint";

const LoginForm = () => {
    const router = useRouter();
    const [loginDetails, setLoginDetails] = useState({ phone: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = name === "phone" ? Number(value) : value;
        setLoginDetails({ ...loginDetails, [name]: newValue });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try{
            const res : LoginResponse = await ApiHelper.loginUser(loginDetails);
            if(res.data.success) {
                router.push("/Dashboard");
            }else{
                setLoading(false);
                router.push("/Login");
            }
        }catch(error){
            setLoading(false);
            router.push("/Login");
        }
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
                        value={loginDetails.phone}
                        onChange={handleChange}
                        pattern="[0-9]{10}"
                        maxLength={10}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                </div>

            <PasswordInput value={loginDetails.password} onChange={handleChange} />

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
