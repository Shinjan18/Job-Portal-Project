import axios from 'axios';

// Use proxy instead of direct API URL for Vite proxy to work
const API_BASE = '';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'Login failed. Please try again.';
    throw new Error(errorMessage);
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        'Registration failed. Please try again.';
    throw new Error(errorMessage);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data.user;
  } catch (error) {
    throw new Error('Failed to fetch user data');
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/api/profile', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

export const uploadResume = async (file) => {
  try {
    const formData = new FormData();
    formData.append('resume', file);
    
    const response = await api.post('/api/profile/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to upload resume');
  }
};

export default api;
