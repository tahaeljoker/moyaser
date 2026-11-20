import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, getMe, logoutUser, getToken } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    getMe()
      .then((res) => {
        if (isMounted && res?.user) {
          setUser(res.user);
        }
      })
      .catch(() => {
        logoutUser();
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    if (res?.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
