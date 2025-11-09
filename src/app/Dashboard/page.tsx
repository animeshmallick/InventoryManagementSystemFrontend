"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import apiHelper from "@/helpers/ApiHelper";
import NavigationPanel from "@/components/NavigationPanel";

const DashboardPage = () => {
    const router = useRouter();
    const [checking, setChecking] = useState(true);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        apiHelper.verifyLogin()
            .then(res => {
                if (!res.loggedIn)
                    return router.push("/Login");
                if (res.user.userRole === "admin")
                    setAdmin(true);
                setChecking(false);
            })
            .catch(err => {
                console.error(err);
                setChecking(false);
            });
    }, [router]);

    const handleAction = async (action: string) => {
        router.push(`/${action}`);

    };

    if (checking) return <LoadingScreen />;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-6">
            <NavigationPanel admin={admin}/>

            <div className="flex flex-wrap justify-center gap-6 mt-10 mb-5">
                <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-4 md:p-8 my46 border border-gray-200">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
                        About Us
                    </h2>
                    <p className="text-gray-700 leading-relaxed mb-4 text-justify">
                        Welcome to <span className="font-semibold text-blue-700">Naseem Electrical</span>,
                        your trusted partner for all types of electrical products and services in
                        <span className="font-medium"> Jamtara</span>. With years of experience in the
                        electrical industry, we specialize in providing
                        <span className="font-medium"> quality electrical goods, wiring materials, lighting solutions,</span>
                        and <span className="font-medium">repair services</span> for both residential and commercial needs.
                    </p>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                        <h3 className="text-xl font-semibold text-blue-700 mb-2">
                            Our Product Range
                        </h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            <li>Domestic and industrial wiring cables</li>
                            <li>Switches, sockets, and circuit breakers</li>
                            <li>Fans, lights, and other home electrical appliances</li>
                            <li>Professional repair and installation services</li>
                        </ul>
                    </div>

                    <p className="text-gray-800 font-medium text-center mt-6">
                        ⚡ Visit Naseem Electrical today — where <span className="text-blue-700 font-semibold">quality</span>
                        meets <span className="text-blue-700 font-semibold">reliability</span>, and every connection matters.
                    </p>
                </div>


                <button
                    onClick={() => handleAction("AllProducts")}
                    className="w-full py-2 rounded-lg font-semibold shadow-md text-white transition bg-blue-600 hover:bg-blue-700"
                >
                    Show All Products
                </button>
            </div>

        </div>
    );
};

export default DashboardPage;
