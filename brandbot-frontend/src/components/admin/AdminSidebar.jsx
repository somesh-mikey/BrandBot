import React from "react";
import {
    LayoutDashboard,
    Users,
    FileText,
    BarChart3,
    Shield,
    Settings,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

const AdminSidebar = ({
    activePage,
    onPageChange,
    isCollapsed,
    onToggleCollapse,
    userRole = "super_admin"
}) => {
    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: LayoutDashboard,
            roles: ["super_admin", "strategist", "account_manager"]
        },
        {
            id: "clients",
            label: "Clients",
            icon: Users,
            roles: ["super_admin", "strategist", "account_manager"]
        },
        {
            id: "content_rules",
            label: "Content Rules",
            icon: FileText,
            roles: ["super_admin", "strategist"]
        },
        {
            id: "analytics",
            label: "Usage & Analytics",
            icon: BarChart3,
            roles: ["super_admin", "strategist", "account_manager"]
        },
        {
            id: "admin_management",
            label: "Admin Management",
            icon: Shield,
            roles: ["super_admin"]
        },
        {
            id: "system_settings",
            label: "System Settings",
            icon: Settings,
            roles: ["super_admin"]
        }
    ];

    const filteredMenuItems = menuItems.filter(item =>
        item.roles.includes(userRole)
    );

    return (
        <div className={`bg-violet-950 text-white transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"
            }`}>
            {/* Toggle Button */}
            <div className="flex justify-end p-4">
                <button
                    onClick={onToggleCollapse}
                    className="p-2 rounded-lg hover:bg-violet-800 transition-colors"
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <ChevronLeft className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="px-4 pb-4">
                <ul className="space-y-2">
                    {filteredMenuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activePage === item.id;

                        return (
                            <li key={item.id}>
                                <button
                                    onClick={() => onPageChange(item.id)}
                                    className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${isActive
                                        ? "bg-violet-100 text-violet-950"
                                        : "text-violet-300 hover:bg-violet-800 hover:text-white"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isCollapsed ? "mx-auto" : "mr-3"}`} />
                                    {!isCollapsed && (
                                        <span className="font-medium">{item.label}</span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Role Badge */}
            {!isCollapsed && (
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-violet-800 rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-violet-300 capitalize">
                                {userRole.replace("_", " ")}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSidebar;
