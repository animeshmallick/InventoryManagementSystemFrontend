"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import LoadingScreen from "@/components/LoadingScreen";
import ApiHelper from "@/helpers/ApiHelper";

const LoginPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const result  = await ApiHelper.verifyLogin();
                if (!result.loggedIn)
                    setLoading(false);

                router.push("/Dashboard");

            }catch(err){
                console.error(err);
                    setLoading(false);
            }
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
