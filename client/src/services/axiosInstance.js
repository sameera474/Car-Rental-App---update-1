// import axios from "axios";
// import { getToken, removeToken } from "../utils/token";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = getToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       removeToken();
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

// File: client/src/services/axiosInstance.js
import axios from "axios";
import { getToken, removeToken } from "../utils/token";

// Define the local API URL and production API URL.
// Make sure VITE_API_URL is set in your environment variables (e.g., in .env.production)
const localApiUrl = "http://localhost:5000/api";
const prodApiUrl = import.meta.env.VITE_API_URL; // e.g., "https://sam-car-rent-service-backend.vercel.app/api"

// Determine which API URL to use based on the hostname.
const API_URL =
  window.location.hostname === "localhost" ? localApiUrl : prodApiUrl;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    // Initialize the Authorization header if a token exists.
    Authorization: localStorage.getItem("token")
      ? `Bearer ${localStorage.getItem("token")}`
      : "",
  },
});

// Request interceptor to add the token to every request if available.
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

// Response interceptor to handle errors (e.g., auto logout on 401 errors).
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
