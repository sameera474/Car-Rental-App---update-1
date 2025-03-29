// File: client/src/services/authService.js
import axiosInstance from "./axiosInstance";
import { setToken } from "../utils/token";

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    // Assume the token is returned in response.data.token
    setToken(response.data.token);
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
