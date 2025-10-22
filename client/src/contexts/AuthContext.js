import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, baseAuthApi } from '../services/api'

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

  const checkAuthStatus = useCallback(async () => {
    try {
      const savedUser = localStorage.getItem('user');
      const savedToken = localStorage.getItem('authToken');
      
      if (savedUser && savedToken) {
        // Verify token is still valid
        try {
          // In a real app, you'd verify the token with the server
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (err) {
          // Token is invalid, clear storage
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
      // Call Rails Devise sessions endpoint
      const res = await baseAuthApi.post('/login', { user: credentials });

      // Extract token from Authorization header if present
      const authHeader = res.headers?.authorization || res.headers?.Authorization;
      const token = authHeader ? authHeader.split(' ').pop() : null;

      // Extract user from response body (matches Users::SessionsController response)
      const userData =
        res.data?.status?.data?.user ||
        res.data?.data?.attributes ||
        null;

      if (token) {
        localStorage.setItem('authToken', token);
      }
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }

      return { success: true, user: userData, token };
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please try again.';
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
      // For now, we'll use mock registration
      // In production, this would be: const response = await authAPI.register(userData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful registration
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        role: 'user',
        created_at: new Date().toISOString()
      };
      
      const token = 'mock-jwt-token-' + Date.now();
      
      // Store auth data
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('authToken', token);
      
      setUser(newUser);
      return { success: true, user: newUser };
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      // In production, you might want to call the logout API
      // await authAPI.logout();
      
      clearAuthData();
      setUser(null);
      return { success: true };
      
    } catch (err) {
      console.error('Logout error:', err);
      // Even if API call fails, clear local data
      clearAuthData();
      setUser(null);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const clearAuthData = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    setError(null);
  };

  const updateUser = (updatedUser) => {
    const newUserData = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const clearError = () => {
    setError(null);
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
