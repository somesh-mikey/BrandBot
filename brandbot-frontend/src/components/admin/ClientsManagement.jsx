import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    UserX,
    UserCheck,
    Copy,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    Loader2
} from "lucide-react";
import ClientModal from "./ClientModal";
import apiService from "../../services/api";

const ClientsManagement = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPlan, setFilterPlan] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterActivity, setFilterActivity] = useState("all");
    const [selectedClients, setSelectedClients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load clients from API
    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        setLoading(true);
        setError(null);
        try {
            const clientsData = await apiService.getClients(searchQuery, filterPlan, filterStatus);
            // Transform API data to match component expectations
            const transformedClients = clientsData.map(client => ({
                id: client.id,
                companyName: client.company_name,
                contactPerson: client.contact_person,
                email: client.email,
                planType: client.plan_type,
                status: client.status === 'active' ? 'Active' : 'Inactive',
                dateJoined: new Date(client.date_joined).toLocaleDateString(),
                lastActivity: client.last_activity ? new Date(client.last_activity).toLocaleDateString() : 'Never',
                brandTone: client.brand_tone,
                audienceType: client.audience_type,
                marketingSuggestions: client.marketing_suggestions
            }));
            setClients(transformedClients);
            setFilteredClients(transformedClients);
        } catch (err) {
            setError('Failed to load clients. Please try again.');
            console.error('Error loading clients:', err);
        } finally {
            setLoading(false);
        }
    };

    // Reload clients when filters change
    useEffect(() => {
        loadClients();
    }, [searchQuery, filterPlan, filterStatus, filterActivity]);

    // Filter and search logic (now handled by API)
    useEffect(() => {
        setFilteredClients(clients);
        setCurrentPage(1); // Reset to first page when filtering
    }, [clients]);

    // Pagination
    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentClients = filteredClients.slice(startIndex, endIndex);

    const handleSelectClient = (clientId) => {
        setSelectedClients(prev =>
            prev.includes(clientId)
                ? prev.filter(id => id !== clientId)
                : [...prev, clientId]
        );
    };

    const handleSelectAll = () => {
        if (selectedClients.length === currentClients.length) {
            setSelectedClients([]);
        } else {
            setSelectedClients(currentClients.map(client => client.id));
        }
    };

    const handleEditClient = (client) => {
        setEditingClient(client);
        setShowModal(true);
    };

    const handleDeleteClient = (client) => {
        setClientToDelete(client);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (clientToDelete) {
            try {
                setLoading(true);
                await apiService.deleteClient(clientToDelete.id);
                await loadClients(); // Reload clients
                setClientToDelete(null);
            } catch (err) {
                setError('Failed to delete client. Please try again.');
                console.error('Error deleting client:', err);
            } finally {
                setLoading(false);
            }
        }
        setShowDeleteConfirm(false);
    };

    const handleBulkDelete = async () => {
        try {
            setLoading(true);
            // Delete all selected clients
            await Promise.all(selectedClients.map(id => apiService.deleteClient(id)));
            await loadClients(); // Reload clients
            setSelectedClients([]);
        } catch (err) {
            setError('Failed to delete clients. Please try again.');
            console.error('Error bulk deleting clients:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSuspendClient = async (client) => {
        try {
            setLoading(true);
            const newStatus = client.status === "Active" ? "inactive" : "active";
            await apiService.updateClient(client.id, { status: newStatus });
            await loadClients(); // Reload clients
        } catch (err) {
            setError('Failed to update client status. Please try again.');
            console.error('Error updating client status:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDuplicateClient = async (client) => {
        try {
            setLoading(true);
            const newClientData = {
                company_name: `${client.companyName} (Copy)`,
                contact_person: client.contactPerson,
                email: `copy_${client.email}`,
                plan_type: client.planType,
                brand_tone: client.brandTone,
                audience_type: client.audienceType,
                marketing_suggestions: client.marketingSuggestions
            };
            await apiService.createClient(newClientData);
            await loadClients(); // Reload clients
        } catch (err) {
            setError('Failed to duplicate client. Please try again.');
            console.error('Error duplicating client:', err);
        } finally {
            setLoading(false);
        }
    };

    const getPlanColor = (plan) => {
        switch (plan) {
            case "Starter": return "bg-gray-100 text-gray-800";
            case "Pro": return "bg-teal-100 text-teal-800";
            case "Enterprise": return "bg-yellow-100 text-yellow-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusColor = (status) => {
        return status === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800";
    };

    const handleModalSave = async (clientData) => {
        try {
            setLoading(true);
            if (editingClient) {
                // Update existing client
                const updateData = {
                    company_name: clientData.companyName,
                    contact_person: clientData.contactPerson,
                    email: clientData.email,
                    plan_type: clientData.planType,
                    brand_tone: clientData.brandTone,
                    audience_type: clientData.audienceType,
                    marketing_suggestions: clientData.marketingSuggestions
                };
                await apiService.updateClient(editingClient.id, updateData);
            } else {
                // Create new client
                const newClientData = {
                    company_name: clientData.companyName,
                    contact_person: clientData.contactPerson,
                    email: clientData.email,
                    plan_type: clientData.planType,
                    brand_tone: clientData.brandTone,
                    audience_type: clientData.audienceType,
                    marketing_suggestions: clientData.marketingSuggestions
                };
                await apiService.createClient(newClientData);
            }
            await loadClients(); // Reload clients
            setShowModal(false);
            setEditingClient(null);
        } catch (err) {
            setError(editingClient ? 'Failed to update client. Please try again.' : 'Failed to create client. Please try again.');
            console.error('Error saving client:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Clients</h1>
                    <p className="text-violet-300 mt-1">Manage your client accounts and settings</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-violet-100 text-violet-950 px-6 py-3 rounded-xl font-semibold hover:bg-violet-200 transition-colors flex items-center space-x-2"
                >
                    <Plus className="w-5 h-5" />
                    <span>Create New Client</span>
                </button>
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

            {/* Filters and Search */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-violet-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search clients..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-4">
                        <select
                            value={filterPlan}
                            onChange={(e) => setFilterPlan(e.target.value)}
                            className="px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                            <option value="all">All Plans</option>
                            <option value="Starter">Starter</option>
                            <option value="Pro">Pro</option>
                            <option value="Enterprise">Enterprise</option>
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        <select
                            value={filterActivity}
                            onChange={(e) => setFilterActivity(e.target.value)}
                            className="px-4 py-2 border border-violet-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                            <option value="all">All Activity</option>
                            <option value="active">Recently Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedClients.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-4 bg-violet-50 rounded-lg border border-violet-200"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-violet-700 font-medium">
                                {selectedClients.length} client(s) selected
                            </span>
                            <button
                                onClick={handleBulkDelete}
                                className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                            >
                                Delete Selected
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Clients Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
                        <span className="ml-2 text-gray-600">Loading clients...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedClients.length === currentClients.length && currentClients.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                                        />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Plan Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date Joined
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Activity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentClients.map((client) => (
                                    <motion.tr
                                        key={client.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedClients.includes(client.id)}
                                                onChange={() => handleSelectClient(client.id)}
                                                className="rounded border-violet-300 text-violet-600 focus:ring-violet-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{client.companyName}</div>
                                                <div className="text-sm text-gray-500">{client.contactPerson}</div>
                                                <div className="text-sm text-gray-500">{client.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(client.planType)}`}>
                                                {client.planType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(client.dateJoined).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(client.lastActivity).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEditClient(client)}
                                                    className="text-violet-600 hover:text-violet-900"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleSuspendClient(client)}
                                                    className={client.status === "Active" ? "text-orange-600 hover:text-orange-900" : "text-green-600 hover:text-green-900"}
                                                    title={client.status === "Active" ? "Suspend" : "Activate"}
                                                >
                                                    {client.status === "Active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => handleDuplicateClient(client)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Duplicate"
                                                >
                                                    <Copy className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClient(client)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                                    <span className="font-medium">{Math.min(endIndex, filteredClients.length)}</span> of{' '}
                                    <span className="font-medium">{filteredClients.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1
                                                ? 'z-10 bg-violet-50 border-violet-500 text-violet-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showModal && (
                    <ClientModal
                        client={editingClient}
                        onClose={() => {
                            setShowModal(false);
                            setEditingClient(null);
                        }}
                        onSave={handleModalSave}
                    />
                )}

                {showDeleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <strong>{clientToDelete?.companyName}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientsManagement;
