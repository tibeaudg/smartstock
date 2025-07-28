// API client to replace Supabase client calls
import type { Profile, Product, Order, StockTransaction, Branch, Supplier, Invoice } from "@shared/schema";

const API_BASE = "";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}/api${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // Use default error message if JSON parsing fails
    }
    throw new ApiError(response.status, errorMessage);
  }

  return response.json();
}

// Profile/User API
export const profilesApi = {
  getAll: () => apiRequest<Profile[]>("/profiles"),
  getById: (id: string) => apiRequest<Profile>(`/profiles/${id}`),
  create: (data: any) => apiRequest<Profile>("/profiles", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<Profile>(`/profiles/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/profiles/${id}`, {
    method: "DELETE",
  }),
};

// Product API
export const productsApi = {
  getAll: (branchId?: string) => {
    const params = branchId ? `?branchId=${branchId}` : "";
    return apiRequest<Product[]>(`/products${params}`);
  },
  getById: (id: string) => apiRequest<Product>(`/products/${id}`),
  create: (data: any) => apiRequest<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/products/${id}`, {
    method: "DELETE",
  }),
};

// Order API
export const ordersApi = {
  getAll: (branchId?: string) => {
    const params = branchId ? `?branchId=${branchId}` : "";
    return apiRequest<Order[]>(`/orders${params}`);
  },
  getById: (id: string) => apiRequest<Order>(`/orders/${id}`),
  create: (data: any) => apiRequest<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => apiRequest<Order>(`/orders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  }),
  delete: (id: string) => apiRequest<void>(`/orders/${id}`, {
    method: "DELETE",
  }),
};

// Stock Transaction API
export const stockTransactionsApi = {
  getAll: (branchId?: string) => {
    const params = branchId ? `?branchId=${branchId}` : "";
    return apiRequest<StockTransaction[]>(`/stock-transactions${params}`);
  },
  create: (data: any) => apiRequest<StockTransaction>("/stock-transactions", {
    method: "POST",
    body: JSON.stringify(data),
  }),
};

// Branch API
export const branchesApi = {
  getAll: (userId?: string) => {
    const params = userId ? `?userId=${userId}` : "";
    return apiRequest<Branch[]>(`/branches${params}`);
  },
  getById: (id: string) => apiRequest<Branch>(`/branches/${id}`),
};

// Supplier API
export const suppliersApi = {
  getAll: () => apiRequest<Supplier[]>("/suppliers"),
  getById: (id: string) => apiRequest<Supplier>(`/suppliers/${id}`),
};

// Invoice API
export const invoicesApi = {
  getAll: (userId?: string) => {
    const params = userId ? `?userId=${userId}` : "";
    return apiRequest<Invoice[]>(`/invoices${params}`);
  },
  getById: (id: string) => apiRequest<Invoice>(`/invoices/${id}`),
};

// License Usage API
export const licenseUsageApi = {
  getUsage: (userId: string) => apiRequest<any>(`/license-usage/${userId}`),
};

// Legacy users API for backward compatibility
export const usersApi = {
  getAll: () => apiRequest<Profile[]>("/users"),
  getById: (id: string) => apiRequest<Profile>(`/users/${id}`),
};

// Export the main api object that can be used as a drop-in replacement for supabase
export const api = {
  profiles: profilesApi,
  products: productsApi,
  orders: ordersApi,
  stockTransactions: stockTransactionsApi,
  branches: branchesApi,
  suppliers: suppliersApi,
  invoices: invoicesApi,
  licenseUsage: licenseUsageApi,
  users: usersApi,
};

export default api;