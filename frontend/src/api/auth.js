import axios from "axios";
import { tokenStore, api } from "./client";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export async function login(username, password) {
  const { data } = await axios.post(`${BASE_URL}/auth/token/`, { username, password });
  tokenStore.set(data.access, data.refresh);
  return data;
}

export function logout() {
  tokenStore.clear();
}

export async function fetchMe() {
  const { data } = await api.get("/auth/me/");
  return data;
}