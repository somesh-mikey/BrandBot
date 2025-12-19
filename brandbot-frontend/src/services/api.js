// Use VITE_API_URL when provided; otherwise default to local backend for dev
const API_BASE_URL = (
  import.meta?.env?.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request("/health");
  }

  // Client Management APIs
  async getClients(
    search = "",
    planType = "",
    status = "",
    page = 1,
    pageSize = 10
  ) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (planType) params.append("plan_type", planType);
    if (status) params.append("status", status);
    if (page) params.append("page", page);
    if (pageSize) params.append("page_size", pageSize);

    const queryString = params.toString();
    const endpoint = queryString
      ? `/admin/clients?${queryString}`
      : "/admin/clients";

    // The server now returns { items: [...], total: N }
    return this.request(endpoint);
  }

  async getClient(clientId) {
    return this.request(`/admin/clients/${clientId}`);
  }

  async createClient(clientData) {
    return this.request("/admin/clients", {
      method: "POST",
      body: JSON.stringify(clientData),
    });
  }

  async updateClient(clientId, clientData) {
    return this.request(`/admin/clients/${clientId}`, {
      method: "PUT",
      body: JSON.stringify(clientData),
    });
  }

  async deleteClient(clientId) {
    return this.request(`/admin/clients/${clientId}`, {
      method: "DELETE",
    });
  }

  async uploadClientDocument(clientId, file) {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${this.baseURL}/admin/clients/${clientId}/upload-document`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will set it automatically with boundary
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.detail ||
          errorData.message ||
          `HTTP error! status: ${response.status}`;
        console.error("Upload error response:", errorData);
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error("Upload request failed:", error);
      throw error;
    }
  }

  async getClientDocument(clientId) {
    return this.request(`/admin/clients/${clientId}/document`);
  }

  async getAllClientsForSelection() {
    return this.request("/clients");
  }

  // Content Rules APIs
  async getContentRules() {
    return this.request("/admin/content-rules");
  }

  async updateGlobalContentRules(globalRules) {
    return this.request("/admin/content-rules/global", {
      method: "PUT",
      body: JSON.stringify(globalRules),
    });
  }

  async updateClientContentRules(clientId, clientRules) {
    return this.request(`/admin/content-rules/client/${clientId}`, {
      method: "PUT",
      body: JSON.stringify(clientRules),
    });
  }

  async previewContent(previewRequest) {
    return this.request("/admin/content-preview", {
      method: "POST",
      body: JSON.stringify(previewRequest),
    });
  }

  // Content Generation APIs
  async generateContent(prompt, businessId, clientId = null) {
    const body = {
      prompt,
    };

    if (clientId) {
      body.client_id = clientId;
    } else if (businessId) {
      body.business_id = businessId;
    }

    return this.request("/generate", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async getBusinesses() {
    return this.request("/business");
  }

  async getBusinessInfo(businessId) {
    return this.request(`/business/${businessId}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
