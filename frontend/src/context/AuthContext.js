import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMe, logout as logoutService } from '../services/authService';

const AuthContext = createContext();

/** DEMO BUTTON REMOVE BEFORE DEVPOST - Token used to skip API auth and avoid CORS */
const DEMO_BYPASS_TOKEN = 'demo-bypass-token';

const DEFAULT_DEMO_USER = {
  id: 'demo-user-id',
  username: 'demouser',
  email: 'demo@example.com',
  roles: ['user'],
  createdAt: new Date().toISOString(),
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
        // DEMO BUTTON REMOVE BEFORE DEVPOST - skip API call for demo user to avoid CORS
        if (token === DEMO_BYPASS_TOKEN) {
          try {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } catch {
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          try {
            const response = await getMe();
            setUser(response.data.user);
            setIsAuthenticated(true);
          } catch (error) {
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

  const logout = () => {
    logoutService();
    setUser(null);
    setIsAuthenticated(false);
  };

  /** DEMO BUTTON REMOVE BEFORE DEVPOST - Signs in as default user without calling API (bypasses CORS). */
  const loginAsDemoUser = () => {
    localStorage.setItem('token', DEMO_BYPASS_TOKEN);
    localStorage.setItem('user', JSON.stringify(DEFAULT_DEMO_USER));
    setUser(DEFAULT_DEMO_USER);
    setIsAuthenticated(true);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    loginAsDemoUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
