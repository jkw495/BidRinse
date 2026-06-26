import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      if (data.business) setBusiness(data.business);
    } catch {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = (token, userData, businessData) => {
    localStorage.setItem('token', token);
    setUser(userData);
    if (businessData) setBusiness(businessData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setBusiness(null);
  };

  return (
    <AuthContext.Provider value={{ user, business, loading, login, logout, reload: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
