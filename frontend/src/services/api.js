const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for making authenticated requests
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('medops_token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// --- AUTHENTICATION ---
export const authService = {
  login: (credentials) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  register: (userData) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  getCurrentUser: () => fetchAPI('/auth/me'),
  getAllUsers: () => fetchAPI('/auth/users/all'),
  logout: () => {
    localStorage.removeItem('medops_token');
    localStorage.removeItem('medops_user');
  }
};

// --- MEDICINES ---
export const medicineService = {
  getAll: () => fetchAPI('/medicines'),
  getById: (id) => fetchAPI(`/medicines/${id}`),
  search: (query) => fetchAPI(`/medicines/search?query=${encodeURIComponent(query)}`),
  checkAvailability: (id) => fetchAPI(`/medicines/${id}/availability`),

  // Admin only
  create: (data) => fetchAPI('/medicines', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id, data) => fetchAPI(`/medicines/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id) => fetchAPI(`/medicines/${id}`, {
    method: 'DELETE'
  })
};

// --- ORDERS ---
export const orderService = {
  // Customer
  placeOrder: (data) => fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getMyOrders: () => fetchAPI('/orders/my'),
  cancelOrder: (id) => fetchAPI(`/orders/cancel/${id}`, {
    method: 'DELETE'
  }),

  // Admin & Generic
  getAll: () => fetchAPI('/orders/all'),
  getById: (id) => fetchAPI(`/orders/${id}`),
  updateStatus: (id, status) => fetchAPI(`/orders/status/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
};
