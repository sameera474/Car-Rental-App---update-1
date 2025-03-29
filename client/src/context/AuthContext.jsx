// File: client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
// Import jwt-decode as a namespace and then use its "default" property
import * as jwtDecode from "jwt-decode";
import { getToken, removeToken } from "../utils/token";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, check for a token in local storage and decode it
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        // Use jwtDecode.default to decode the token
        const decodedUser = jwtDecode.default(token);
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token:", error);
        removeToken();
      }
    }
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
