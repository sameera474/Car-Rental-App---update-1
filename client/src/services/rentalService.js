// File: client/src/services/rentalService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const createRental = async (rentalData) => {
  try {
    const response = await axios.post(`${API_URL}/rentals`, rentalData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const returnRental = async (rentalId) => {
  try {
    const response = await axios.post(`${API_URL}/rentals/${rentalId}/return`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
