// src/api.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

if (!BASE_URL) {
  console.warn("⚠️ VITE_API_BASE_URL is missing");
}

export const apiClient = {
  async get(path: string) {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error(`GET ${path} failed`);
    return res.json();
  },

  async post(path: string, data: any) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`POST ${path} failed`);
    return res.json();
  },

  async postForm(path: string, formData: FormData) {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error(`POST form ${path} failed`);
    return res.json();
  }
};
