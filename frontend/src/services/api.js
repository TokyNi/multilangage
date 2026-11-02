/**
 * API client service for communicating with FastAPI backend.
 * Automatically attaches the active language ('fr', 'en', 'mg') to query params and Accept-Language header.
 */
import i18n from '../i18n';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Builds request headers including Accept-Language matching current i18n language.
 */
function getHeaders(customLang = null) {
  const lang = customLang || i18n.language || 'fr';
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': lang,
  };
}

/**
 * Fetch health status of backend service.
 */
export async function getHealthStatus(customLang = null) {
  const lang = customLang || i18n.language || 'fr';
  try {
    const res = await fetch(`${API_BASE_URL}/health?lang=${encodeURIComponent(lang)}`, {
      headers: getHeaders(lang),
    });
    if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
    return await res.json();
  } catch (err) {
    return { status: 'offline', error: err.message };
  }
}

/**
 * Fetch items list with optional category and search filters.
 */
export async function getItems({ search = '', category = 'all', customLang = null } = {}) {
  const lang = customLang || i18n.language || 'fr';
  const params = new URLSearchParams();
  params.append('lang', lang);
  if (search) params.append('search', search);
  if (category && category !== 'all') params.append('category', category);

  const res = await fetch(`${API_BASE_URL}/items?${params.toString()}`, {
    headers: getHeaders(lang),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch items (${res.status} ${res.statusText})`);
  }
  return await res.json();
}

/**
 * Fetch single item by ID.
 */
export async function getItemById(id, customLang = null) {
  const lang = customLang || i18n.language || 'fr';
  const res = await fetch(`${API_BASE_URL}/items/${id}?lang=${encodeURIComponent(lang)}`, {
    headers: getHeaders(lang),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch item ${id}`);
  }
  return await res.json();
}

/**
 * Create a new multilingual item.
 */
export async function createItem(itemData, customLang = null) {
  const lang = customLang || i18n.language || 'fr';
  const res = await fetch(`${API_BASE_URL}/items?lang=${encodeURIComponent(lang)}`, {
    method: 'POST',
    headers: getHeaders(lang),
    body: JSON.stringify(itemData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to create item');
  }
  return await res.json();
}

/**
 * Delete an item by ID.
 */
export async function deleteItem(id, customLang = null) {
  const lang = customLang || i18n.language || 'fr';
  const res = await fetch(`${API_BASE_URL}/items/${id}?lang=${encodeURIComponent(lang)}`, {
    method: 'DELETE',
    headers: getHeaders(lang),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || 'Failed to delete item');
  }
  return await res.json();
}

/**
 * Fetch stats summary.
 */
export async function getStats(customLang = null) {
  const lang = customLang || i18n.language || 'fr';
  const res = await fetch(`${API_BASE_URL}/items/stats?lang=${encodeURIComponent(lang)}`, {
    headers: getHeaders(lang),
  });
  if (!res.ok) {
    throw new Error('Failed to fetch stats');
  }
  return await res.json();
}
