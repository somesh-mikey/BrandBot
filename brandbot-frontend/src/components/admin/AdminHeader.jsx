import React, { useState } from "react";
import { Search, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";

const AdminHeader = ({ onSearch, notifications = [], user }) => {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;

    return (
        <header className="bg-violet-100 border-b border-violet-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Logo and Brand */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-violet-800 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">BB</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-violet-950">BrandBot</h1>
                            <p className="text-xs text-violet-600">by Dimensions</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex-1 max-w-md mx-8">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search clients, content, or settings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white text-violet-950"
                            />
                        </div>
                    </form>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <div className="relative">
                        <button className="p-2 text-violet-400 hover:text-violet-600 relative">
                            <Bell className="w-5 h-5" />
                            {unreadNotifications > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {unreadNotifications}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-violet-200"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-violet-800 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-violet-950">{user?.name || "Admin User"}</p>
                                <p className="text-xs text-violet-600">{user?.role || "Super Admin"}</p>
                            </div>
                            <ChevronDown className="w-4 h-4 text-violet-400" />
                        </button>

                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-violet-200 py-1 z-50">
                                <button className="flex items-center w-full px-4 py-2 text-sm text-violet-700 hover:bg-violet-50">
                                    <User className="w-4 h-4 mr-3" />
                                    Profile
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-sm text-violet-700 hover:bg-violet-50">
                                    <Settings className="w-4 h-4 mr-3" />
                                    Settings
                                </button>
                                <hr className="my-1" />
                                <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-violet-50">
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
