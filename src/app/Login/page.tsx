"use client";

import React, { useEffect, useState } from "react";
import { verifyLogin } from "@/helpers/LoginHelper";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import LoadingScreen from "@/components/LoadingScreen";

const LoginPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLogin = async () => {
            const result = await verifyLogin();
            if (result?.loggedIn) router.push("/Dashboard");
            else setLoading(false);
        };
        checkLogin();
    }, [router]);

    if (loading) return <LoadingScreen />;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <LoginForm />
        </div>
    );
};

export default LoginPage;
