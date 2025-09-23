import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Eye, Save, XCircle } from "lucide-react";

const ClientModal = ({ client, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        companyName: "",
        contactPerson: "",
        email: "",
        planType: "Starter",
        brandTone: "Professional",
        audienceType: "B2B",
        marketingSuggestions: true
    });

    const [previewData, setPreviewData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (client) {
            setFormData({
                companyName: client.companyName || "",
                contactPerson: client.contactPerson || "",
                email: client.email || "",
                planType: client.planType || "Starter",
                brandTone: client.brandTone || "Professional",
                audienceType: client.audienceType || "B2B",
                marketingSuggestions: client.marketingSuggestions || true
            });
        }
    }, [client]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        }
        if (!formData.contactPerson.trim()) {
            newErrors.contactPerson = "Contact person is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            onSave(formData);
        }
    };

    const handlePreview = async () => {
        // Simulate API call to preview content
        setShowPreview(true);
        setPreviewData({
            companyName: formData.companyName,
            brandTone: formData.brandTone,
            audienceType: formData.audienceType,
            sampleContent: `Sample content for ${formData.companyName} with ${formData.brandTone} tone for ${formData.audienceType} audience...`
        });
    };

    const planOptions = [
        { value: "Starter", label: "Starter", color: "bg-gray-100 text-gray-800" },
        { value: "Pro", label: "Pro", color: "bg-teal-100 text-teal-800" },
        { value: "Enterprise", label: "Enterprise", color: "bg-yellow-100 text-yellow-800" }
    ];

    const brandToneOptions = [
        { value: "Professional", label: "Professional" },
        { value: "Casual", label: "Casual" },
        { value: "Witty", label: "Witty" },
        { value: "Authoritative", label: "Authoritative" }
    ];

    const audienceTypeOptions = [
        { value: "B2B", label: "B2B" },
        { value: "B2C", label: "B2C" },
        { value: "Mixed", label: "Mixed" }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-violet-950">
                        {client ? "Edit Client" : "Create New Client"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                    {/* Company Information */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.companyName}
                                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${errors.companyName ? "border-red-300" : "border-gray-300"
                                        }`}
                                    placeholder="Enter company name"
                                />
                                {errors.companyName && (
                                    <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contact Person *
                                </label>
                                <input
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${errors.contactPerson ? "border-red-300" : "border-gray-300"
                                        }`}
                                    placeholder="Enter contact person name"
                                />
                                {errors.contactPerson && (
                                    <p className="text-red-500 text-sm mt-1">{errors.contactPerson}</p>
                                )}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent ${errors.email ? "border-red-300" : "border-gray-300"
                                        }`}
                                    placeholder="Enter email address"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Plan and Settings */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Plan & Settings</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Plan Type
                                </label>
                                <select
                                    value={formData.planType}
                                    onChange={(e) => handleInputChange("planType", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                >
                                    {planOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Brand Tone
                                </label>
                                <select
                                    value={formData.brandTone}
                                    onChange={(e) => handleInputChange("brandTone", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                >
                                    {brandToneOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Audience Type
                                </label>
                                <select
                                    value={formData.audienceType}
                                    onChange={(e) => handleInputChange("audienceType", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                >
                                    {audienceTypeOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.marketingSuggestions}
                                        onChange={(e) => handleInputChange("marketingSuggestions", e.target.checked)}
                                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Enable Marketing Suggestions</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-violet-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-violet-900">Content Preview</h4>
                            <button
                                onClick={handlePreview}
                                className="flex items-center space-x-2 text-violet-600 hover:text-violet-700 text-sm font-medium"
                            >
                                <Eye className="w-4 h-4" />
                                <span>Preview Content</span>
                            </button>
                        </div>
                        <p className="text-sm text-violet-700">
                            Preview how content will be generated for this client with their selected settings.
                        </p>
                    </div>

                    {/* Preview Modal */}
                    {showPreview && previewData && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="bg-white rounded-xl max-w-lg w-full p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Content Preview</h3>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{previewData.companyName}</h4>
                                        <div className="flex space-x-4 mt-2">
                                            <span className="text-sm text-gray-600">Tone: {previewData.brandTone}</span>
                                            <span className="text-sm text-gray-600">Audience: {previewData.audienceType}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-700">{previewData.sampleContent}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center space-x-2"
                    >
                        <Save className="w-4 h-4" />
                        <span>{client ? "Update Client" : "Create Client"}</span>
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ClientModal;
