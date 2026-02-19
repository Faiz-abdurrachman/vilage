import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('sidesa_token');
    const savedUser = localStorage.getItem('sidesa_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));

      // Validate token with server
      api.get('/auth/me')
        .then((res) => {
          setUser(res.data.data);
          localStorage.setItem('sidesa_user', JSON.stringify(res.data.data));
        })
        .catch(() => {
          localStorage.removeItem('sidesa_token');
          localStorage.removeItem('sidesa_user');
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token: newToken, user: newUser } = res.data;

    localStorage.setItem('sidesa_token', newToken);
    localStorage.setItem('sidesa_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);

    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sidesa_token');
    localStorage.removeItem('sidesa_user');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('sidesa_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider');
  return context;
}

export default AuthContext;
