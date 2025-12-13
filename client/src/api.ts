import axios from 'axios';

// Base URL for API requests - should be set in environment variables
const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Remove any trailing slashes and ensure proper path joining
const normalizePath = (base: string, path: string = ''): string => {
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
};

// Shared axios client with auth + cookies support
export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Ensure baseURL is properly set for each request
  if (!config.baseURL) {
    config.baseURL = API_BASE;
  }
  
  // Ensure the URL is properly formatted
  if (config.url) {
    config.url = config.url.replace(/^\/+/, ''); // Remove leading slashes
    
    // Handle potential double /api in the URL
    if (config.url.startsWith('api/') && API_BASE.endsWith('/api')) {
      config.url = config.url.replace('api/', '');
    }
  }
  
  return config;
});

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      // Handle other status codes as needed
    }
    return Promise.reject(error);
  }
);

// Helper to build full URLs for fetch-based calls
export const endpoint = (path = '') => {
  return normalizePath(API_BASE, path);
};

// Export the configured axios instance as default
export default apiClient;
