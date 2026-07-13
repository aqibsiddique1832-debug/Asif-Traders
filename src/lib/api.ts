/**
 * Stub for V1's missing @/lib/api
 * V1's AdminContext expects a default export with various methods.
 * Since the customer site doesn't use the admin context, this stub
 * just satisfies the imports.
 */

const api: any = {
  get: async () => ({ data: null }),
  post: async () => ({ data: null }),
  put: async () => ({ data: null }),
  delete: async () => ({ data: null }),
  getMe: async () => ({ data: null }),
  login: async () => ({ data: null }),
  logout: async () => ({ data: null }),
  getProducts: async () => ({ data: [] }),
  getCategories: async () => ({ data: [] }),
  getBrands: async () => ({ data: [] }),
  getQuotes: async () => ({ data: [] }),
  getContacts: async () => ({ data: [] }),
  getTestimonials: async () => ({ data: [] }),
  getSettings: async () => ({ data: null }),
  updateSettings: async () => ({ data: null }),
};

export default api;
