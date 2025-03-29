// File: client/src/services/axiosInstance.js
import axios from "axios";
import { getToken } from "../utils/token";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosInstance = axios.create({ baseURL: API_URL });

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Optionally redirect to login here
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
