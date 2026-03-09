const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erro inesperado' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (data) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  register: (data) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
};

// ─── Products ────────────────────────────────────────────────────────────────

export const productApi = {
  list: ({ page = 0, size = 12, sort = 'name', term } = {}) => {
    const params = new URLSearchParams({ page, size, sort });
    if (term) params.set('term', term);
    return request(`/api/products?${params}`);
  },

  getById: (id) => request(`/api/products/${id}`),

  getByCategory: (category) => request(`/api/products/category/${category}`),

  create: (data) =>
    request('/api/products', { method: 'POST', body: JSON.stringify(data) }),

  update: (id, data) =>
    request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deactivate: (id) =>
    request(`/api/products/${id}`, { method: 'DELETE' }),
};
