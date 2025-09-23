import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Save,
    Eye,
    ChevronDown,
    ChevronUp,
    Search,
    Settings,
    Users,
    AlertCircle,
    Loader2
} from "lucide-react";
import TagInput from "./TagInput";
import Toast from "./Toast";
import apiService from "../../services/api";

const ContentRules = () => {
    // Global rules state
    const [globalRules, setGlobalRules] = useState({
        enabled: true,
        defaultTone: "Professional",
        defaultAudience: "B2B",
        mandatoryKeywords: [],
        excludedKeywords: [],
        defaultContentLength: "medium"
    });

    // Per-client rules state
    const [clientRules, setClientRules] = useState({});
    const [selectedClient, setSelectedClient] = useState("");
    const [clientSearchQuery, setClientSearchQuery] = useState("");
    const [isClientRulesExpanded, setIsClientRulesExpanded] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [previewContent, setPreviewContent] = useState("");

    // Toast state
    const [toast, setToast] = useState({
        isVisible: false,
        message: "",
        type: "success"
    });

    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Clients data
    const [clients, setClients] = useState([]);

    const filteredClients = clients.filter(client =>
        client.companyName.toLowerCase().includes(clientSearchQuery.toLowerCase())
    );

    // Load initial data
    useEffect(() => {
        loadContentRules();
        loadClients();
    }, []);

    const loadContentRules = async () => {
        try {
            setLoading(true);
            const rules = await apiService.getContentRules();
            setGlobalRules({
                enabled: rules.global_rules.enabled,
                defaultTone: rules.global_rules.default_tone,
                defaultAudience: rules.global_rules.default_audience,
                mandatoryKeywords: rules.global_rules.mandatory_keywords || [],
                excludedKeywords: rules.global_rules.excluded_keywords || [],
                defaultContentLength: rules.global_rules.default_content_length
            });
            
            // Convert client rules to our format
            const clientRulesMap = {};
            rules.client_rules.forEach(rule => {
                clientRulesMap[rule.client_id] = {
                    tone: rule.tone,
                    audience: rule.audience,
                    mandatoryKeywords: rule.mandatory_keywords || [],
                    excludedKeywords: rule.excluded_keywords || [],
                    contentLength: rule.content_length,
                    marketingSuggestions: rule.marketing_suggestions
                };
            });
            setClientRules(clientRulesMap);
        } catch (err) {
            setError('Failed to load content rules. Please try again.');
            console.error('Error loading content rules:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadClients = async () => {
        try {
            const clientsData = await apiService.getClients();
            const transformedClients = clientsData.map(client => ({
                id: client.id,
                name: client.company_name,
                plan: client.plan_type
            }));
            setClients(transformedClients);
        } catch (err) {
            console.error('Error loading clients:', err);
        }
    };

    const toneOptions = [
        { value: "Professional", label: "Professional" },
        { value: "Casual", label: "Casual" },
        { value: "Witty", label: "Witty" },
        { value: "Authoritative", label: "Authoritative" },
        { value: "Friendly", label: "Friendly" },
        { value: "Formal", label: "Formal" }
    ];

    const audienceOptions = [
        { value: "B2B", label: "B2B" },
        { value: "B2C", label: "B2C" },
        { value: "Mixed", label: "Mixed" },
        { value: "Technical", label: "Technical" },
        { value: "General", label: "General" }
    ];

    const contentLengthOptions = [
        { value: "short", label: "Short (50-100 words)" },
        { value: "medium", label: "Medium (100-300 words)" },
        { value: "long", label: "Long (300+ words)" }
    ];

    const handleGlobalRuleChange = (field, value) => {
        setGlobalRules(prev => ({ ...prev, [field]: value }));
    };

    const handleClientRuleChange = (field, value) => {
        if (!selectedClient) return;

        setClientRules(prev => ({
            ...prev,
            [selectedClient]: {
                ...prev[selectedClient],
                [field]: value
            }
        }));
    };

    const getClientRules = (clientId) => {
        return clientRules[clientId] || {
            tone: globalRules.defaultTone,
            audience: globalRules.defaultAudience,
            mandatoryKeywords: [...globalRules.mandatoryKeywords],
            excludedKeywords: [...globalRules.excludedKeywords],
            contentLength: globalRules.defaultContentLength,
            marketingSuggestions: true
        };
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);
            
            // Save global rules
            await apiService.updateGlobalContentRules({
                enabled: globalRules.enabled,
                default_tone: globalRules.defaultTone,
                default_audience: globalRules.defaultAudience,
                mandatory_keywords: globalRules.mandatoryKeywords,
                excluded_keywords: globalRules.excludedKeywords,
                default_content_length: globalRules.defaultContentLength
            });
            
            // Save client rules
            for (const [clientId, rules] of Object.entries(clientRules)) {
                if (rules.tone || rules.audience || rules.contentLength) {
                    await apiService.updateClientContentRules(parseInt(clientId), {
                        client_id: parseInt(clientId),
                        tone: rules.tone,
                        audience: rules.audience,
                        mandatory_keywords: rules.mandatoryKeywords,
                        excluded_keywords: rules.excludedKeywords,
                        content_length: rules.contentLength,
                        marketing_suggestions: rules.marketingSuggestions
                    });
                }
            }
            
            setToast({
                isVisible: true,
                message: "Content rules saved successfully!",
                type: "success"
            });
        } catch (error) {
            setToast({
                isVisible: true,
                message: "Failed to save content rules. Please try again.",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePreviewContent = async () => {
        try {
            setLoading(true);
            setShowPreview(true);
            
            const rules = selectedClient ? getClientRules(selectedClient) : globalRules;
            
            const previewRequest = {
                tone: rules.tone,
                audience: rules.audience,
                mandatory_keywords: rules.mandatoryKeywords,
                excluded_keywords: rules.excludedKeywords,
                content_length: rules.contentLength,
                marketing_suggestions: rules.marketingSuggestions,
                sample_prompt: "Write a product description"
            };
            
            const response = await apiService.previewContent(previewRequest);
            setPreviewContent(response.generated_content);
        } catch (error) {
            setToast({
                isVisible: true,
                message: "Failed to generate preview. Please try again.",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const validateForm = () => {
        const errors = [];

        if (globalRules.mandatoryKeywords.length === 0) {
            errors.push("At least one mandatory keyword is required");
        }

        if (selectedClient && !clientRules[selectedClient]) {
            errors.push("Please configure client-specific rules");
        }

        return errors;
    };

    const currentRules = selectedClient ? getClientRules(selectedClient) : globalRules;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Content Rules</h1>
                    <p className="text-violet-300 mt-1">Configure global and client-specific content generation rules</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handlePreviewContent}
                        disabled={loading}
                        className="bg-violet-100 text-violet-950 px-4 py-2 rounded-lg font-semibold hover:bg-violet-200 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                        <span>Preview & Test</span>
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        disabled={loading}
                        className="bg-violet-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-violet-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                        <span className="text-red-700">{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-600 hover:text-red-800"
                        >
                            ×
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Global Toggle */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Settings className="w-5 h-5 text-violet-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Enable Default Global Rules</h3>
                            <p className="text-sm text-gray-600">Apply these rules to all clients by default</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={globalRules.enabled}
                            onChange={(e) => handleGlobalRuleChange("enabled", e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
                    </label>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Global Rules */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center space-x-3 mb-6">
                            <Settings className="w-5 h-5 text-violet-600" />
                            <h3 className="text-lg font-semibold text-gray-900">Global Rules</h3>
                        </div>

                        <div className="space-y-6">
                            {/* Default Tone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Default Tone of Voice
                                </label>
                                <select
                                    value={globalRules.defaultTone}
                                    onChange={(e) => handleGlobalRuleChange("defaultTone", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                >
                                    {toneOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Default Audience */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Default Audience Type
                                </label>
                                <select
                                    value={globalRules.defaultAudience}
                                    onChange={(e) => handleGlobalRuleChange("defaultAudience", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                >
                                    {audienceOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Mandatory Keywords */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mandatory Keywords
                                </label>
                                <TagInput
                                    tags={globalRules.mandatoryKeywords}
                                    onTagsChange={(tags) => handleGlobalRuleChange("mandatoryKeywords", tags)}
                                    placeholder="Add mandatory keywords..."
                                    maxTags={20}
                                />
                            </div>

                            {/* Excluded Keywords */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Excluded Keywords
                                </label>
                                <TagInput
                                    tags={globalRules.excludedKeywords}
                                    onTagsChange={(tags) => handleGlobalRuleChange("excludedKeywords", tags)}
                                    placeholder="Add excluded keywords..."
                                    maxTags={20}
                                />
                            </div>

                            {/* Content Length */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Default Content Length
                                </label>
                                <select
                                    value={globalRules.defaultContentLength}
                                    onChange={(e) => handleGlobalRuleChange("defaultContentLength", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                >
                                    {contentLengthOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Per-Client Rules */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <Users className="w-5 h-5 text-violet-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Per-Client Rules</h3>
                            </div>
                            <button
                                onClick={() => setIsClientRulesExpanded(!isClientRulesExpanded)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {isClientRulesExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                )}
                            </button>
                        </div>

                        {/* Client Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Client
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search clients..."
                                    value={clientSearchQuery}
                                    onChange={(e) => setClientSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                            </div>

                            {clientSearchQuery && (
                                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                                    {filteredClients.map(client => (
                                        <button
                                            key={client.id}
                                            onClick={() => {
                                                setSelectedClient(client.id);
                                                setClientSearchQuery(client.name);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="font-medium text-gray-900">{client.name}</div>
                                            <div className="text-sm text-gray-500">{client.plan} Plan</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Client Rules Form */}
                        <AnimatePresence>
                            {isClientRulesExpanded && selectedClient && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-6"
                                >
                                    {(() => {
                                        const client = clients.find(c => c.id === selectedClient);
                                        const rules = getClientRules(selectedClient);

                                        return (
                                            <>
                                                <div className="bg-violet-50 rounded-lg p-4">
                                                    <h4 className="font-medium text-violet-900 mb-1">
                                                        {client?.name} - Custom Rules
                                                    </h4>
                                                    <p className="text-sm text-violet-700">
                                                        Override global rules for this specific client
                                                    </p>
                                                </div>

                                                {/* Client-specific fields */}
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Tone of Voice
                                                        </label>
                                                        <select
                                                            value={rules.tone}
                                                            onChange={(e) => handleClientRuleChange("tone", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                                        >
                                                            {toneOptions.map(option => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Audience Type
                                                        </label>
                                                        <select
                                                            value={rules.audience}
                                                            onChange={(e) => handleClientRuleChange("audience", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                                        >
                                                            {audienceOptions.map(option => (
                                                                <option key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Mandatory Keywords
                                                        </label>
                                                        <TagInput
                                                            tags={rules.mandatoryKeywords}
                                                            onTagsChange={(tags) => handleClientRuleChange("mandatoryKeywords", tags)}
                                                            placeholder="Add client-specific keywords..."
                                                            maxTags={15}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Excluded Keywords
                                                        </label>
                                                        <TagInput
                                                            tags={rules.excludedKeywords}
                                                            onTagsChange={(tags) => handleClientRuleChange("excludedKeywords", tags)}
                                                            placeholder="Add client-specific exclusions..."
                                                            maxTags={15}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Content Length
                                                        </label>
                                                        <select
                                                            value={rules.contentLength}
                                                            onChange={(e) => handleClientRuleChange("contentLength", e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                                        >
                                                            {contentLengthOptions.map(option => (
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
                                                                checked={rules.marketingSuggestions}
                                                                onChange={(e) => handleClientRuleChange("marketingSuggestions", e.target.checked)}
                                                                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                                                            />
                                                            <span className="ml-2 text-sm text-gray-700">Enable Marketing Suggestions</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {showPreview && (
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
                            className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900">Content Preview</h3>
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-2">Generated Content:</h4>
                                        <p className="text-gray-700 whitespace-pre-wrap">{previewContent}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">Tone:</span>
                                            <span className="ml-2 text-gray-900">{currentRules.tone}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Audience:</span>
                                            <span className="ml-2 text-gray-900">{currentRules.audience}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Length:</span>
                                            <span className="ml-2 text-gray-900 capitalize">{currentRules.contentLength}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Marketing Suggestions:</span>
                                            <span className="ml-2 text-gray-900">{currentRules.marketingSuggestions ? "Enabled" : "Disabled"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toast */}
            <Toast
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
};

export default ContentRules;
