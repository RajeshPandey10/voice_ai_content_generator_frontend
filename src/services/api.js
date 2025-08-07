import axios from "axios";
import Cookies from "js-cookie";

// Environment-aware API base URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "http://localhost:3000"
    : "https://your-backend-domain.com");

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CORS with credentials
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  googleLogin: () => `${API_BASE_URL}/auth/google`,
};

// Content API
export const contentAPI = {
  generateContent: (businessData) =>
    api.post("/generate-content", businessData), // Use the direct endpoint for now
  getHistory: (params) => api.get("/api/history", { params }),
  getContent: (id) => api.get(`/api/${id}`),
  bookmarkContent: (id) => api.patch(`/api/${id}/bookmark`),
  rateContent: (id, rating, feedback) =>
    api.patch(`/api/${id}/rate`, { rating, feedback }),
  deleteContent: (id) => api.delete(`/api/${id}`),
  getStats: () => api.get("/api/stats"),
  modifyContent: (data) => api.post("/api/modify", data),
};

export default api;

// Export the api instance as named export as well
export { api };
