import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-950 to-purple-900 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-12 max-w-2xl w-full mx-4 shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-violet-950 mb-4">
                        BrandBot Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Choose your interface to get started
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Client Interface */}
                    <div
                        className="p-8 border-2 border-violet-200 rounded-xl hover:border-violet-400 hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => navigate("/client")}
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-200 transition-colors">
                                <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-violet-950 mb-2">
                                Client Interface
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Generate content using your business DNA. Create social posts, emails, and more.
                            </p>
                        </div>
                    </div>

                    {/* Admin Interface */}
                    <div
                        className="p-8 border-2 border-violet-200 rounded-xl hover:border-violet-400 hover:shadow-lg transition-all cursor-pointer group"
                        onClick={() => navigate("/admin")}
                    >
                        <div className="text-center">
                            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-violet-200 transition-colors">
                                <svg className="w-8 h-8 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-violet-950 mb-2">
                                Admin Interface
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Manage business DNA, view analytics, and configure system settings.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
