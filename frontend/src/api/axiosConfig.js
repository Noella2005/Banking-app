import axios from 'axios';

// Determine the base URL based on the environment
const baseURL = process.env.NODE_ENV === 'production'
  ? 'https://banking-api-n6z2.onrender.com' // <-- PASTE YOUR RENDER URL HERE
  : '/api'; // Uses the Vite proxy in development

const api = axios.create({
    baseURL: baseURL,
});

// Interceptor to add the token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;