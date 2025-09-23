import React from "react";
import { motion } from "framer-motion";
import {
    FileText,
    UserPlus,
    Settings,
    Zap,
    AlertCircle,
    CheckCircle,
    Clock
} from "lucide-react";

const ActivityFeed = ({ activities = [] }) => {
    const getActivityIcon = (type) => {
        switch (type) {
            case "content_generated":
                return FileText;
            case "client_created":
                return UserPlus;
            case "settings_changed":
                return Settings;
            case "api_usage":
                return Zap;
            case "alert":
                return AlertCircle;
            case "success":
                return CheckCircle;
            default:
                return Clock;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case "content_generated":
                return "text-violet-600 bg-violet-100";
            case "client_created":
                return "text-green-600 bg-green-100";
            case "settings_changed":
                return "text-orange-600 bg-orange-100";
            case "api_usage":
                return "text-purple-600 bg-purple-100";
            case "alert":
                return "text-red-600 bg-red-100";
            case "success":
                return "text-green-600 bg-green-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                    View All
                </button>
            </div>

            <div className="space-y-4">
                {activities.length === 0 ? (
                    <div className="text-center py-8">
                        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No recent activity</p>
                    </div>
                ) : (
                    activities.map((activity, index) => {
                        const Icon = getActivityIcon(activity.type);
                        const colorClass = getActivityColor(activity.type);

                        return (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-violet-50 transition-colors"
                            >
                                <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900">{activity.message}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <span className="text-xs text-gray-500">{activity.user}</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ActivityFeed;
