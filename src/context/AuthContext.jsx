import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ims_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ims_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLogoutEvent = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('ims_auth_logout', handleLogoutEvent);
    return () => window.removeEventListener('ims_auth_logout', handleLogoutEvent);
  }, []);

  useEffect(() => {
    const verifyExistingAuth = async () => {
      const storedToken = localStorage.getItem('ims_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.data) {
            const updatedUser = {
              ...user,
              ...res.data.data,
            };
            setUser(updatedUser);
            localStorage.setItem('ims_user', JSON.stringify(updatedUser));
          }
        } catch (err) {
          console.warn('Session verification expired or unreachable:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyExistingAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success && res.data.data) {
      const authData = res.data.data;
      const loggedInUser = {
        id: authData.id,
        email: authData.email,
        fullName: authData.fullName,
        role: authData.role,
        active: authData.active,
        verified: authData.verified,
      };

      setToken(authData.token);
      setUser(loggedInUser);
      localStorage.setItem('ims_token', authData.token);
      localStorage.setItem('ims_user', JSON.stringify(loggedInUser));
      return loggedInUser;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const registerStudent = async (studentData) => {
    const res = await api.post('/auth/register/student', studentData);
    if (res.data.success && res.data.data) {
      const authData = res.data.data;
      const newUser = {
        id: authData.id,
        email: authData.email,
        fullName: authData.fullName,
        role: authData.role,
        active: authData.active,
        verified: true,
      };

      setToken(authData.token);
      setUser(newUser);
      localStorage.setItem('ims_token', authData.token);
      localStorage.setItem('ims_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const registerCompany = async (companyData) => {
    const res = await api.post('/auth/register/company', companyData);
    if (res.data.success && res.data.data) {
      const authData = res.data.data;
      const newUser = {
        id: authData.id,
        email: authData.email,
        fullName: authData.fullName,
        role: authData.role,
        active: authData.active,
        verified: authData.verified,
      };

      setToken(authData.token);
      setUser(newUser);
      localStorage.setItem('ims_token', authData.token);
      localStorage.setItem('ims_user', JSON.stringify(newUser));
      return newUser;
    }
    throw new Error(res.data.message || 'Company registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ims_token');
    localStorage.removeItem('ims_user');
  };

  const updateUser = (fields) => {
    const updated = { ...user, ...fields };
    setUser(updated);
    localStorage.setItem('ims_user', JSON.stringify(updated));
  };

  const value = {
    user,
    token,
    role: user ? user.role : null,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    registerStudent,
    registerCompany,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
