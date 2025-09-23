import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

const Toast = ({
    message,
    type = "success",
    isVisible,
    onClose,
    duration = 3000
}) => {
    useEffect(() => {
        if (isVisible && duration > 0) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case "error":
                return <XCircle className="w-5 h-5 text-red-600" />;
            case "warning":
                return <AlertCircle className="w-5 h-5 text-orange-600" />;
            default:
                return <CheckCircle className="w-5 h-5 text-green-600" />;
        }
    };

    const getBgColor = () => {
        switch (type) {
            case "success":
                return "bg-green-50 border-green-200";
            case "error":
                return "bg-red-50 border-red-200";
            case "warning":
                return "bg-orange-50 border-orange-200";
            default:
                return "bg-green-50 border-green-200";
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-4 right-4 z-50 max-w-sm w-full"
                >
                    <div className={`${getBgColor()} border rounded-lg shadow-lg p-4`}>
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {getIcon()}
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {message}
                                </p>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                                <button
                                    onClick={onClose}
                                    className="inline-flex text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
