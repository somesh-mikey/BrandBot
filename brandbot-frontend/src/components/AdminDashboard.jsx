import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminHeader from "./admin/AdminHeader";
import AdminSidebar from "./admin/AdminSidebar";
import DashboardHome from "./admin/DashboardHome";
import ClientsManagement from "./admin/ClientsManagement";
import ContentRules from "./admin/ContentRules";

const AdminDashboard = () => {
    const [activePage, setActivePage] = useState("dashboard");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [backendStatus, setBackendStatus] = useState("checking");
    const [searchQuery, setSearchQuery] = useState("");
    const [notifications] = useState([
        { id: 1, message: "New client registered", read: false, timestamp: new Date() },
        { id: 2, message: "API usage at 80%", read: false, timestamp: new Date() },
        { id: 3, message: "System backup completed", read: true, timestamp: new Date() }
    ]);

    // Mock user data - in real app this would come from auth context
    const user = {
        name: "Admin User",
        role: "super_admin", // super_admin, strategist, account_manager
        avatar: null
    };

    // Check backend connection
    useEffect(() => {
        const checkBackendConnection = async () => {
            try {
                const res = await fetch("http://localhost:8000/health");
                if (res.ok) {
                    setBackendStatus("connected");
                } else {
                    setBackendStatus("disconnected");
                }
            } catch (err) {
                setBackendStatus("disconnected");
            }
        };
        checkBackendConnection();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        // Implement search functionality
        console.log("Searching for:", query);
    };

    const handlePageChange = (page) => {
        setActivePage(page);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const renderPageContent = () => {
        switch (activePage) {
            case "dashboard":
                return <DashboardHome backendStatus={backendStatus} />;
            case "clients":
                return <ClientsManagement />;
            case "content_rules":
                return <ContentRules />;
            case "analytics":
                return <div className="p-6">Analytics - Coming Soon</div>;
            case "admin_management":
                return <div className="p-6">Admin Management - Coming Soon</div>;
            case "system_settings":
                return <div className="p-6">System Settings - Coming Soon</div>;
            default:
                return <DashboardHome backendStatus={backendStatus} />;
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-inter rounded-tl-2xl rounded-bl-2xl">
            {/* Sidebar */}
            <AdminSidebar
                activePage={activePage}
                onPageChange={handlePageChange}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={toggleSidebar}
                userRole={user.role}
            />

            {/* Main Content */}
            <main className="flex-1 bg-violet-950 rounded-tr-2xl rounded-br-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <AdminHeader
                    onSearch={handleSearch}
                    notifications={notifications}
                    user={user}
                />

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activePage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            {renderPageContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
