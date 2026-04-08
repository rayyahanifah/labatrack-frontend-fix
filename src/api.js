import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true // WAJIB: Supaya cookie JWT otomatis terkirim ke backend
});

export default api;