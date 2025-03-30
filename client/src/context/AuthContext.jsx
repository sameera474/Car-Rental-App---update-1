import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getToken, removeToken, setToken } from "../utils/token";
import axiosInstance from "../services/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);

        // Verify token expiration
        if (Date.now() >= decoded.exp * 1000) {
          throw new Error("Token expired");
        }

        // Fetch fresh user data
        const response = await axiosInstance.get(`/users/${decoded.id}`);
        setUser({
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        });
      } catch (error) {
        console.error("Auth initialization error:", error);
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (userData, token) => {
    setToken(token);
    const decoded = jwtDecode(token);

    // Set user data from decoded token and API response
    setUser({
      id: decoded.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
