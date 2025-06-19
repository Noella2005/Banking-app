import axios from 'axios';

// This is the base URL of your LIVE backend on Render.
// It should NOT include '/api' at the end.
const RENDER_BASE_URL = 'https://banking-api-n6z2.onrender.com';

// Determine the final base URL based on the environment.
// In production, we use the live Render URL.
// In development (npm run dev), we use a relative path so the Vite proxy can work.
const baseURL = process.env.NODE_ENV === 'production'
  ? RENDER_BASE_URL
  : ''; // In development, let it be relative

const api = axios.create({
    baseURL: baseURL,
});

// Interceptor to add the '/api' prefix and the auth token to every request
api.interceptors.request.use((config) => {
    // Prepend '/api' to all request URLs
    config.url = `/api${config.url}`;

    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;