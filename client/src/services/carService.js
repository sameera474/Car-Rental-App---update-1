// File: client/src/services/carService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const fetchCars = async () => {
  try {
    const response = await axios.get(`${API_URL}/cars`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const fetchCarById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/cars/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
