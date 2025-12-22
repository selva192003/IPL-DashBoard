// Centralized configuration for API endpoints
// This ensures consistent backend URL across all components

const getBackendUrl = () => {
  // ALWAYS use the correct backend URL
  // The Render service is: ipl-dashboard-1-ff0d.onrender.com
  
  const CORRECT_BACKEND = 'https://ipl-dashboard-1-ff0d.onrender.com';
  
  // Only accept environment variable if it matches the correct backend
  if (process.env.REACT_APP_BACKEND_URL) {
    const url = process.env.REACT_APP_BACKEND_URL;
    // Only accept if it's the correct Render service or localhost
    if (url.includes('ipl-dashboard-1-ff0d.onrender.com') || url.includes('localhost')) {
      return url;
    }
    // Log warning about invalid env var
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️ Invalid REACT_APP_BACKEND_URL detected. Using correct backend.');
    }
  }
  
  // In production, always use the correct Render backend
  if (process.env.NODE_ENV === 'production') {
    return CORRECT_BACKEND;
  }
  
  // Local development - use proxy from package.json
  return '';
};

export const API_BASE_URL = getBackendUrl();

// Log the backend URL being used (helps with debugging)
if (process.env.NODE_ENV === 'production') {
  console.log('🎯 Backend URL:', API_BASE_URL);
}

// API Endpoints
export const API_ENDPOINTS = {
  TEAMS: `${API_BASE_URL}/api/v1/team`,
  PLAYERS: `${API_BASE_URL}/api/v1/players`,
  SEARCH: `${API_BASE_URL}/api/v1/search`,
  MATCH: `${API_BASE_URL}/match`,
  HEAD_TO_HEAD: `${API_BASE_URL}/api/v1/team/head-to-head`,
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
