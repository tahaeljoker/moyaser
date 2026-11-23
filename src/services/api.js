const envUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = (import.meta.env.PROD && (!envUrl || envUrl.includes('localhost'))) ? '/api' : (envUrl || '/api');

export function getToken() {
  try {
    return localStorage.getItem('muyassar_token') || sessionStorage.getItem('muyassar_token');
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) {
      localStorage.setItem('muyassar_token', token);
      sessionStorage.setItem('muyassar_token', token);
    } else {
      localStorage.removeItem('muyassar_token');
      sessionStorage.removeItem('muyassar_token');
    }
  } catch {}
}

async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.replace(/^\//, '');
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${cleanEndpoint}`;
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(url, { ...options, headers });
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

// Projects Endpoints
export async function fetchProjects(includeInactive = false) {
  return request(`projects${includeInactive ? '?includeInactive=true' : ''}`, { method: 'GET' });
}

export async function fetchProject(slug) {
  return request(`projects/${slug}`, { method: 'GET' });
}

export async function createProject(payload) {
  return request('admin/projects', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateProject(id, updates) {
  return request(`admin/projects/${id}`, { method: 'PUT', body: JSON.stringify(updates) });
}

export async function toggleProjectActive(id) {
  return request(`admin/projects/${id}/toggle`, { method: 'PATCH' });
}

export async function deleteProject(id) {
  return request(`admin/projects/${id}`, { method: 'DELETE' });
}

// Units Endpoints
export async function fetchUnits(params = {}) {
  const q = new URLSearchParams();
  ['status', 'model', 'type', 'projectId', 'slug'].forEach((k) => params[k] && q.append(k, params[k]));
  return request(`units${q.toString() ? `?${q.toString()}` : ''}`, { method: 'GET' });
}

export async function updateUnit(c, u) {
  return request(`admin/units/${c}`, { method: 'PATCH', body: JSON.stringify(u) });
}

export async function createUnit(p) {
  return request('admin/units', { method: 'POST', body: JSON.stringify(p) });
}

export async function deleteUnit(c) {
  return request(`admin/units/${c}`, { method: 'DELETE' });
}

// Architectural Models Endpoints
export async function fetchModels(params = {}) {
  const q = new URLSearchParams();
  if (params.projectId) q.append('projectId', params.projectId);
  if (params.slug) q.append('slug', params.slug);
  return request(`models${q.toString() ? `?${q.toString()}` : ''}`, { method: 'GET' });
}

export async function fetchAdminModels() {
  return request('admin/models', { method: 'GET' });
}

export async function createModel(payload) {
  return request('admin/models', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateModel(id, updates) {
  return request(`admin/models/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export async function deleteModel(id) {
  return request(`admin/models/${id}`, { method: 'DELETE' });
}

// Leads Endpoints
export async function createLead(payload) {
  return request('leads', { method: 'POST', body: JSON.stringify(payload) });
}

export async function fetchAdminLeads() {
  return request('admin/leads', { method: 'GET' });
}

export async function createAdminLead(payload) {
  return request('admin/leads', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateLead(id, updates) {
  return request(`admin/leads/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export async function addLeadActivity(id, note, nextFollowUpDate) {
  return request(`admin/leads/${id}/activities`, {
    method: 'POST',
    body: JSON.stringify({ note, nextFollowUpDate }),
  });
}

// Auth Endpoints
export async function loginUser(email, password) {
  const data = await request('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data?.token) setToken(data.token);
  return data;
}

export async function getMe(options = {}) {
  return request('auth/me', { method: 'GET', ...options });
}

export function logoutUser() {
  setToken(null);
}

// Settings and Users Endpoints
export async function fetchSiteSettings() {
  return request('settings', { method: 'GET' });
}

export async function updateSiteSettings(payload) {
  return request('admin/settings', { method: 'PUT', body: JSON.stringify(payload) });
}

export async function fetchAdminUsers() {
  return request('admin/users', { method: 'GET' });
}

export async function createAdminUser(payload) {
  return request('admin/users', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateAdminUser(id, updates) {
  return request(`admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
}
