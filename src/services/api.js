/**
 * Muyassar Real Estate — Frontend API Client
 * Clean fetch wrapper with JWT Bearer auth support from sessionStorage
 */

const envUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = (import.meta.env.PROD && (!envUrl || envUrl.includes('localhost'))) ? '/api' : (envUrl || '/api');

export function getToken() {
  try { return sessionStorage.getItem('muyassar_token'); } catch { return null; }
}

export function setToken(token) {
  try {
    if (token) sessionStorage.setItem('muyassar_token', token);
    else sessionStorage.removeItem('muyassar_token');
  } catch {}
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
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

// ── Public Endpoints ──
export async function fetchUnits(params = {}) {
  const query = new URLSearchParams();
  if (params.status && params.status !== 'all') query.append('status', params.status);
  if (params.model && params.model !== 'all') query.append('model', params.model);
  if (params.type && params.type !== 'all') query.append('type', params.type);
  const qs = query.toString();
  return request(`units${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

export async function createLead(payload) {
  return request('leads', { method: 'POST', body: JSON.stringify(payload) });
}

export async function fetchModels() {
  return request('models', { method: 'GET' });
}

// ── Auth Endpoints ──
export async function loginUser(email, password) {
  const data = await request('auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  if (data?.token) setToken(data.token);
  return data;
}

export async function getMe() {
  return request('auth/me', { method: 'GET' });
}

export function logoutUser() {
  setToken(null);
}

// ── Admin Leads Endpoints ──
export async function fetchAdminLeads(params = {}) {
  const query = new URLSearchParams();
  if (params.stage && params.stage !== 'all') query.append('stage', params.stage);
  if (params.unitCode) query.append('unitCode', params.unitCode);
  if (params.search) query.append('search', params.search);
  const qs = query.toString();
  return request(`admin/leads${qs ? `?${qs}` : ''}`, { method: 'GET' });
}

export async function createAdminLead(payload) {
  return request('admin/leads', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateLead(id, updates) {
  return request(`admin/leads/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export async function addLeadActivity(leadId, note, nextFollowUpDate) {
  return request(`admin/leads/${leadId}/activities`, { method: 'POST', body: JSON.stringify({ note, nextFollowUpDate }) });
}

// ── Admin Units Endpoints ──
export async function updateUnit(unitCode, updates) {
  return request(`admin/units/${unitCode}`, { method: 'PATCH', body: JSON.stringify(updates) });
}

export async function createUnit(payload) {
  return request('admin/units', { method: 'POST', body: JSON.stringify(payload) });
}

export async function deleteUnit(unitCode) {
  return request(`admin/units/${unitCode}`, { method: 'DELETE' });
}

// ── Admin Architectural Models Endpoints ──
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

// ── Site Settings Endpoints ──
export async function fetchSiteSettings() {
  return request('settings', { method: 'GET' });
}

export async function updateSiteSettings(payload) {
  return request('admin/settings', { method: 'PUT', body: JSON.stringify(payload) });
}

// ── Admin Team / User Management Endpoints ──
export async function fetchAdminUsers() {
  return request('admin/users', { method: 'GET' });
}

export async function createAdminUser(payload) {
  return request('admin/users', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateAdminUser(id, updates) {
  return request(`admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
}