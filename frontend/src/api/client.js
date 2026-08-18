import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export const api = axios.create({ baseURL: BASE_URL });

export const tokenStore = {
  getAccess: () => localStorage.getItem("sms_access"),
  getRefresh: () => localStorage.getItem("sms_refresh"),
  set: (access, refresh) => {
    localStorage.setItem("sms_access", access);
    if (refresh) localStorage.setItem("sms_refresh", refresh);
  },
  clear: () => {
    localStorage.removeItem("sms_access");
    localStorage.removeItem("sms_refresh");
  },
};

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});