import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [useMock, setUseMock] = useState(() => localStorage.getItem('useMock') === 'true');

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    localStorage.setItem('useMock', String(useMock));
  }, [useMock]);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    setToken(data.token);
  };

  const logout = () => setToken(null);

  const value = useMemo(
    () => ({ token, setToken, login, logout, useMock, setUseMock }),
    [token, useMock]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


