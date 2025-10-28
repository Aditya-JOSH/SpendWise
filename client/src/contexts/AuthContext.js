import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api, { authAPI } from '../services/api';

const AuthContext = createContext();

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
  const [error, setError] = useState(null);

  const clearAuthData = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    setError(null);
  };

  const updateUser = (updatedUser) => {
    const newUserData = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const clearError = () => setError(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('authToken');

      if (savedUser && savedToken) {
        api.defaults.headers.common.Authorization = `Bearer ${savedToken}`;

        // verify token by calling a lightweight endpoint
        try {
          const res = await authAPI.memberInfo();
          const remoteUser = res.data || JSON.parse(savedUser);
          localStorage.setItem('user', JSON.stringify(remoteUser));
          setUser(remoteUser);
        } catch (err) {
          clearAuthData();
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      clearAuthData();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check for existing session on app load
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const res = await authAPI.login({ user: credentials });

      const authHeader = res.headers?.authorization;
      const token = authHeader ? authHeader.split(' ').pop() : null;

      const userData =
        res.data?.status?.data?.user ||
        null;

      if (token) {
        localStorage.setItem('authToken', token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }

      return { success: true, user: userData, token };
      
    } catch (err) {
      const errorMessage = err.response?.data || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await authAPI.register({ user: userData });

      const authHeader = res.headers?.authorization;
      const token = authHeader ? authHeader.split(' ').pop() : null;

      const returnedUser =
        res.data?.data ||
        null;

      if (token) {
        localStorage.setItem('authToken', token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      if (returnedUser) {
        localStorage.setItem('user', JSON.stringify(returnedUser));
        setUser(returnedUser);
      }

      return { success: true, user: returnedUser, token };
      
    } catch (err) {
      const errorMessage = err.response?.data?.status?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (token) {
        await authAPI.logout();
      }
      
      clearAuthData();
      return { success: true };
      
    } catch (err) {
      console.error('Logout error:', err);
      clearAuthData();
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
