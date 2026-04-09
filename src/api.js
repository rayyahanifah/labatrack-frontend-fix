import axios from "axios";

const api = axios.create({
  // Pakai URL dari .env, kalau ga ada baru localhost
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000", 
  withCredentials: true
});

export default api;