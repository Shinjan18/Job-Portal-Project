// client/src/api.ts
// Single source of truth for API base URL used by the app.

export const API_BASE: string =
  (import.meta as any).env?.VITE_API_BASE_URL?.trim() ||
  'https://job-portal-backend-itvc.onrender.com/api';

// Helper to build endpoints without accidentally doubling /api
export function endpoint(path: string) {
  // remove any leading slash from path, and ensure API_BASE does not end with slash
  const base = API_BASE.replace(/\/$/, '');
  const trimmed = path.replace(/^\/+/, '');
  return ${base}/${trimmed};
}
