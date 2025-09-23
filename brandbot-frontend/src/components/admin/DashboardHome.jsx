import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Users,
    FileText,
    Zap,
    AlertTriangle,
    TrendingUp,
    Activity,
    DollarSign
} from "lucide-react";
import StatsCard from "./StatsCard";
import ActivityFeed from "./ActivityFeed";

const DashboardHome = ({ backendStatus }) => {
    const [stats, setStats] = useState({
        totalClients: 0,
        contentGenerated: 0,
        apiUsage: 0,
        alerts: 0
    });

    const [activities, setActivities] = useState([]);

    useEffect(() => {
        // Simulate loading stats from API
        const loadStats = async () => {
            try {
                // In a real app, these would come from your backend API
                setStats({
                    totalClients: 24,
                    contentGenerated: 1847,
                    apiUsage: 68,
                    alerts: 3
                });

                // Mock activity data
                setActivities([
                    {
                        id: 1,
                        type: "content_generated",
                        message: "New social media post generated for Acme Corp",
                        user: "Sarah Johnson",
                        timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
                    },
                    {
                        id: 2,
                        type: "client_created",
                        message: "New client 'TechStart Inc' added to the platform",
                        user: "Mike Chen",
                        timestamp: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
                    },
                    {
                        id: 3,
                        type: "settings_changed",
                        message: "Brand voice updated for Global Solutions",
                        user: "Emily Davis",
                        timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
                    },
                    {
                        id: 4,
                        type: "api_usage",
                        message: "API usage exceeded 80% of monthly limit",
                        user: "System",
                        timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
                    },
                    {
                        id: 5,
                        type: "success",
                        message: "Backup completed successfully",
                        user: "System",
                        timestamp: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
                    }
                ]);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            }
        };

        loadStats();
    }, []);

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-xl p-6 text-white"
            >
                <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
                <p className="text-violet-100">
                    Here's what's happening with your BrandBot platform today.
                </p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Clients"
                    value={stats.totalClients}
                    change="+12%"
                    changeType="positive"
                    icon={Users}
                    color="violet"
                />
                <StatsCard
                    title="Content Generated"
                    value={stats.contentGenerated.toLocaleString()}
                    change="+23%"
                    changeType="positive"
                    icon={FileText}
                    color="purple"
                />
                <StatsCard
                    title="API Usage"
                    value={`${stats.apiUsage}%`}
                    progress={stats.apiUsage}
                    icon={Zap}
                    color="blue"
                />
                <StatsCard
                    title="Active Alerts"
                    value={stats.alerts}
                    change={stats.alerts > 0 ? "Needs attention" : "All clear"}
                    changeType={stats.alerts > 0 ? "negative" : "positive"}
                    icon={AlertTriangle}
                    color={stats.alerts > 0 ? "orange" : "green"}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2">
                    <ActivityFeed activities={activities} />
                </div>

                {/* Quick Actions & System Status */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-violet-50 transition-colors">
                                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-violet-600" />
                                </div>
                                <span className="text-sm font-medium text-violet-950">Add New Client</span>
                            </button>
                            <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-violet-50 transition-colors">
                                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-violet-600" />
                                </div>
                                <span className="text-sm font-medium text-violet-950">Create Content Rule</span>
                            </button>
                            <button className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-violet-50 transition-colors">
                                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-violet-600" />
                                </div>
                                <span className="text-sm font-medium text-violet-950">View Analytics</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* System Status */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                    >
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Backend API</span>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${backendStatus === "connected" ? "bg-green-400" : "bg-red-400"
                                        }`}></div>
                                    <span className={`text-sm font-medium ${backendStatus === "connected" ? "text-green-600" : "text-red-600"
                                        }`}>
                                        {backendStatus === "connected" ? "Online" : "Offline"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Database</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    <span className="text-sm font-medium text-green-600">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">AI Services</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                    <span className="text-sm font-medium text-green-600">Online</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
