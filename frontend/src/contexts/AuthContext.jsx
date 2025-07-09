import React, { createContext, useContext, useState } from 'react';
import axiosInstance from "../../config/axiosInterceptorConfig";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password
      });
      
      const { session } = response.data;
    
      setUser(session.user);
      setIsAuthenticated(true);
      // Store the session token
      localStorage.setItem('session', JSON.stringify(session));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to login'
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return { success: true, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to register'
      };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/auth/log-out');
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('session');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      signup, 
      logout, 
      setIsAuthenticated, 
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);