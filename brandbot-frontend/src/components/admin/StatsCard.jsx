import React from "react";
import { motion } from "framer-motion";

const StatsCard = ({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    color = "blue",
    progress = null
}) => {
    const colorClasses = {
        blue: "from-blue-500 to-blue-600",
        teal: "from-teal-500 to-teal-600",
        green: "from-green-500 to-green-600",
        orange: "from-orange-500 to-orange-600",
        purple: "from-purple-500 to-purple-600",
        violet: "from-violet-500 to-violet-600"
    };

    const iconBgClasses = {
        blue: "bg-blue-100",
        teal: "bg-teal-100",
        green: "bg-green-100",
        orange: "bg-orange-100",
        purple: "bg-purple-100",
        violet: "bg-violet-100"
    };

    const iconColorClasses = {
        blue: "text-blue-600",
        teal: "text-teal-600",
        green: "text-green-600",
        orange: "text-orange-600",
        purple: "text-purple-600",
        violet: "text-violet-600"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <div className="flex items-center mt-2">
                            <span className={`text-sm font-medium ${changeType === "positive" ? "text-green-600" : "text-red-600"
                                }`}>
                                {changeType === "positive" ? "+" : ""}{change}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-lg ${iconBgClasses[color]} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
                </div>
            </div>

            {progress !== null && (
                <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full bg-gradient-to-r ${colorClasses[color]}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default StatsCard;
