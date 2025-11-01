"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import LoadingScreen from "@/components/LoadingScreen";
import apiHelper from "@/helpers/ApiHelper";

const LoginPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiHelper.verifyLogin()
            .then(res => {
                if (res.loggedIn)
                    router.push("/Dashboard");
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) return <LoadingScreen />;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
            <LoginForm />
        </div>
    );
};

export default LoginPage;
