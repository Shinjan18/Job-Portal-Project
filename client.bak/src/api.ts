import axios from 'axios'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://job-portal-backend-itvc.onrender.com/api'

// Shared axios client with auth + cookies support
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Helper to build full URLs for fetch-based calls
export const endpoint = (path = '') => {
  const sanitized = path.replace(/^\/+/, '')
  return sanitized ? `${API_BASE_URL}/${sanitized}` : API_BASE_URL
}

export default API_BASE_URL
