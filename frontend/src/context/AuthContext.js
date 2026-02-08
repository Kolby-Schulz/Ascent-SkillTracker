import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

// Demo bypass token - REMOVE BEFORE DEVPOST
const DEMO_BYPASS_TOKEN = 'demo-bypass-token';
const DEFAULT_DEMO_USER = {
  _id: 'demo-user-id',
  username: 'demouser',
  email: 'demo@example.com',
  role: 'user',
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        // If demo token, skip API call - restore from localStorage only (avoids CORS)
        if (token === DEMO_BYPASS_TOKEN) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
          } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          try {
            // Verify real token is still valid
            const response = await getMe();
            setUser(response.data.user);
            setIsAuthenticated(true);
          } catch (error) {
            // Token is invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Demo login - no API call, bypasses CORS - REMOVE BEFORE DEVPOST
  const loginAsDemoUser = () => {
    localStorage.setItem('token', DEMO_BYPASS_TOKEN);
    localStorage.setItem('user', JSON.stringify(DEFAULT_DEMO_USER));
    setUser(DEFAULT_DEMO_USER);
    setIsAuthenticated(true);
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    setUser,
    loading,
    isAuthenticated,
    login,
    loginAsDemoUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
