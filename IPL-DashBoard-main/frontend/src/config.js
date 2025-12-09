// Centralized configuration for API endpoints
// This ensures consistent backend URL across all components

const getBackendUrl = () => {
  // Priority order:
  // 1. Environment variable from Vercel (REACT_APP_BACKEND_URL)
  // 2. Production backend URL (Render) - CORRECT URL
  // 3. Local development fallback
  
  if (process.env.REACT_APP_BACKEND_URL) {
    // Validate that it's the correct backend
    const url = process.env.REACT_APP_BACKEND_URL;
    if (url.includes('ipl-dashboard') || url.includes('localhost')) {
      return url;
    }
    // If env var is wrong, use fallback
    console.warn('Invalid backend URL in env var, using fallback:', url);
  }
  
  // Check if we're in production (deployed on Vercel)
  if (process.env.NODE_ENV === 'production') {
    return 'https://ipl-dashboard-1-ff0d.onrender.com';
  }
  
  // Local development - use proxy from package.json
  return '';
};

export const API_BASE_URL = getBackendUrl();

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
