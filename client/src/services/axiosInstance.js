import axios from "axios";
import { getToken, removeToken } from "../utils/token";

// Determine environment and set API URL accordingly
const localApiUrl = "http://localhost:5000/api";
const prodApiUrl =
  import.meta.env.VITE_API_URL ||
  "https://sam-car-rent-service-backend.vercel.app/api";

const API_URL =
  window.location.hostname === "localhost" ? localApiUrl : prodApiUrl;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Attach token before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response and auto-redirect on auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
