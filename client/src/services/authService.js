// File: client/src/services/authService.js
import axiosInstance from "./axiosInstance";
import { setToken } from "../utils/token";

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    setToken(response.data.token); // Store the JWT token
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
