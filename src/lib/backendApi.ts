/**
 * Backend API Client
 * V1 Frontend (c4bd8a96) — Backend Integration Layer
 *
 * Provides typed wrappers around the production backend at
 * https://asifbhai-production.up.railway.app/api/v1
 *
 * Preserves V1 design 100% — all UI components continue to use the
 * existing data shapes; this layer normalizes backend responses into
 * V1-compatible formats.
 */

const API_BASE_URL =
  (typeof process !== 'undefined' && (process as any)?.env?.NEXT_PUBLIC_API_URL) ||
  'https://asifbhai-production.up.railway.app/api/v1';

interface ApiResponse<T = any> {
  success: boolean;
  status?: string;
  message?: string;
  data?: T;
  timestamp?: string;
  error?: { code: string; message: string };
}

const TOKEN_KEYS = ['asif_token', 'auth_token', 'asif_access_token'];

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  for (const k of TOKEN_KEYS) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

function setToken(token: string, refreshToken?: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('asif_token', token);
  localStorage.setItem('auth_token', token); // alias used elsewhere
  if (refreshToken) localStorage.setItem('asif_refresh_token', refreshToken);
}

function clearToken() {
  if (typeof window === 'undefined') return;
  for (const k of TOKEN_KEYS) localStorage.removeItem(k);
  localStorage.removeItem('asif_refresh_token');
}

async function fetchApi<T = any>(
  endpoint: string,
  options: { method?: string; body?: any; auth?: boolean; params?: Record<string, any> } = {},
): Promise<{ data: ApiResponse<T> | T; status: number }> {
  const url = new URL(API_BASE_URL + endpoint);
  if (options.params) {
    Object.entries(options.params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.append(k, String(v));
    });
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json: ApiResponse<T> = await res
    .json()
    .catch(() => ({ success: false, error: { code: 'PARSE_ERROR', message: 'Bad response' } }));
  return { data: json, status: res.status };
}

function unwrap<T = any>(result: { data: ApiResponse<T> | T; status: number }): T | null {
  const d: any = result.data;
  if (!d) return null;
  // ApiResponse wrapper: { success, data: <payload> }
  if (typeof d === 'object' && 'success' in d) {
    if (!d.success) {
      console.warn('[backendApi] call failed:', d.error?.message || d.message);
      return null;
    }
    return d.data ?? ({} as T);
  }
  // Bare payload
  return d as T;
}

// ─── Auth ──────────────────────────────────────────────────────────
export const authApi = {
  async register(payload: {
    firstName: string;
    lastName?: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    agreedToTerms?: boolean;
  }) {
    const result = await fetchApi<any>('/auth/register', { method: 'POST', body: payload });
    const data = unwrap(result);
    if (data && (data as any).tokens?.accessToken) {
      setToken((data as any).tokens.accessToken, (data as any).tokens.refreshToken);
    }
    return data;
  },

  async login(email: string, password: string) {
    const result = await fetchApi<any>('/auth/login', { method: 'POST', body: { email, password } });
    const data = unwrap(result);
    if (data && (data as any).tokens?.accessToken) {
      setToken((data as any).tokens.accessToken, (data as any).tokens.refreshToken);
    }
    return data;
  },

  async logout() {
    try {
      await fetchApi('/auth/logout', { method: 'POST', body: { allDevices: false }, auth: true });
    } catch (e) {
      // ignore
    } finally {
      clearToken();
    }
  },

  async me() {
    const result = await fetchApi<any>('/auth/me', { auth: true });
    return unwrap(result);
  },
};

// ─── Products ──────────────────────────────────────────────────────
export const productsApi = {
  async list(params: { page?: number; limit?: number; category?: string; search?: string; featured?: boolean } = {}) {
    const result = await fetchApi<any>('/products', { params });
    return unwrap(result);
  },
  async get(id: string) {
    const result = await fetchApi<any>(`/products/${id}`);
    return unwrap(result);
  },
};

// ─── Categories ────────────────────────────────────────────────────
export const categoriesApi = {
  async list() {
    const result = await fetchApi<any>('/categories');
    return unwrap(result);
  },
};

// ─── Cart (server-side via /quotes/cart) ───────────────────────────
export const cartApi = {
  async get() {
    const result = await fetchApi<any>('/quotes/cart', { auth: true });
    return unwrap(result);
  },
  async addItem(productId: string, quantity: number) {
    const result = await fetchApi<any>('/quotes/cart/items', {
      method: 'POST',
      body: { productId, quantity },
      auth: true,
    });
    return unwrap(result);
  },
  async updateItem(itemId: string, quantity: number) {
    const result = await fetchApi<any>(`/quotes/cart/items/${itemId}`, {
      method: 'PATCH',
      body: { quantity },
      auth: true,
    });
    return unwrap(result);
  },
  async removeItem(itemId: string) {
    const result = await fetchApi<any>(`/quotes/cart/items/${itemId}`, {
      method: 'DELETE',
      auth: true,
    });
    return unwrap(result);
  },
  async clear() {
    const result = await fetchApi<any>('/quotes/cart/clear', { method: 'POST', auth: true });
    return unwrap(result);
  },
};

// ─── Addresses ─────────────────────────────────────────────────────
export const addressesApi = {
  async list() {
    const result = await fetchApi<any>('/addresses', { auth: true });
    return unwrap(result);
  },
  async create(payload: any) {
    const result = await fetchApi<any>('/addresses', { method: 'POST', body: payload, auth: true });
    return unwrap(result);
  },
  async update(id: string, payload: any) {
    const result = await fetchApi<any>(`/addresses/${id}`, { method: 'PUT', body: payload, auth: true });
    return unwrap(result);
  },
  async remove(id: string) {
    const result = await fetchApi<any>(`/addresses/${id}`, { method: 'DELETE', auth: true });
    return unwrap(result);
  },
};

// ─── Orders ────────────────────────────────────────────────────────
export const ordersApi = {
  async create(payload: {
    items: Array<{ productId: string; quantity: number; variantId?: string }>;
    addressId: string;
    paymentMethod: 'COD' | 'ONLINE' | 'UPI' | 'BANK_TRANSFER';
    notes?: string;
    couponCode?: string;
  }) {
    const result = await fetchApi<any>('/orders', { method: 'POST', body: payload, auth: true });
    return unwrap(result);
  },
  async list(params: { status?: string; page?: number; limit?: number } = {}) {
    const result = await fetchApi<any>('/orders', { params, auth: true });
    return unwrap(result);
  },
  async get(id: string) {
    const result = await fetchApi<any>(`/orders/${id}`, { auth: true });
    return unwrap(result);
  },
};

// ─── Quotes ────────────────────────────────────────────────────────
export const quotesApi = {
  async submit(payload: {
    items: Array<{ productId: string; quantity: number; notes?: string }>;
    notes?: string;
    deliveryAddress?: any;
    contactPhone?: string;
    contactEmail?: string;
  }) {
    const result = await fetchApi<any>('/quotes', { method: 'POST', body: payload, auth: true });
    return unwrap(result);
  },
  async list(params: { status?: string; page?: number; limit?: number } = {}) {
    const result = await fetchApi<any>('/quotes', { params, auth: true });
    return unwrap(result);
  },
};

// ─── Notifications ─────────────────────────────────────────────────
export const notificationsApi = {
  async list(params: { unreadOnly?: boolean; page?: number; limit?: number } = {}) {
    const result = await fetchApi<any>('/notifications', { params, auth: true });
    return unwrap(result);
  },
  async markRead(id: string) {
    const result = await fetchApi<any>(`/notifications/${id}/read`, { method: 'PATCH', auth: true });
    return unwrap(result);
  },
  async markAllRead() {
    const result = await fetchApi<any>('/notifications/read-all', { method: 'POST', auth: true });
    return unwrap(result);
  },
};

// ─── Reviews ───────────────────────────────────────────────────────
export const reviewsApi = {
  async listForProduct(productId: string) {
    const result = await fetchApi<any>(`/products/${productId}/reviews`);
    return unwrap(result);
  },
  async create(productId: string, payload: { rating: number; title?: string; comment: string }) {
    const result = await fetchApi<any>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: payload,
      auth: true,
    });
    return unwrap(result);
  },
};

// ─── Wishlist ──────────────────────────────────────────────────────
export const wishlistApi = {
  async list() {
    const result = await fetchApi<any>('/wishlist', { auth: true });
    return unwrap(result);
  },
  async add(productId: string) {
    const result = await fetchApi<any>('/wishlist', { method: 'POST', body: { productId }, auth: true });
    return unwrap(result);
  },
  async remove(productId: string) {
    const result = await fetchApi<any>(`/wishlist/${productId}`, { method: 'DELETE', auth: true });
    return unwrap(result);
  },
};

// ─── Token access (for advanced use) ───────────────────────────────
export const tokenStore = { getToken, setToken, clearToken };

export { API_BASE_URL };
