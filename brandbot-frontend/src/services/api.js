// Use VITE_API_URL when provided; otherwise default to local backend for dev
const API_BASE_URL = (import.meta?.env?.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Client Management APIs
  async getClients(search = '', planType = '', status = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (planType) params.append('plan_type', planType);
    if (status) params.append('status', status);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/admin/clients?${queryString}` : '/admin/clients';
    
    return this.request(endpoint);
  }

  async getClient(clientId) {
    return this.request(`/admin/clients/${clientId}`);
  }

  async createClient(clientData) {
    return this.request('/admin/clients', {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(clientId, clientData) {
    return this.request(`/admin/clients/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  }

  async deleteClient(clientId) {
    return this.request(`/admin/clients/${clientId}`, {
      method: 'DELETE',
    });
  }

  // Content Rules APIs
  async getContentRules() {
    return this.request('/admin/content-rules');
  }

  async updateGlobalContentRules(globalRules) {
    return this.request('/admin/content-rules/global', {
      method: 'PUT',
      body: JSON.stringify(globalRules),
    });
  }

  async updateClientContentRules(clientId, clientRules) {
    return this.request(`/admin/content-rules/client/${clientId}`, {
      method: 'PUT',
      body: JSON.stringify(clientRules),
    });
  }

  async previewContent(previewRequest) {
    return this.request('/admin/content-preview', {
      method: 'POST',
      body: JSON.stringify(previewRequest),
    });
  }

  // Content Generation APIs
  async generateContent(prompt, businessId) {
    return this.request('/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        business_id: businessId,
      }),
    });
  }

  async getBusinesses() {
    return this.request('/business');
  }

  async getBusinessInfo(businessId) {
    return this.request(`/business/${businessId}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
