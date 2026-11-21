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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      try { controller.abort(); } catch {}
    }, 7000);

    getMe({ signal: controller.signal })
      .then((res) => {
        if (isMounted && res?.user) {
          setUser(res.user);
        } else if (isMounted) {
          logoutUser();
          setUser(null);
        }
      })
      .catch(() => {
        logoutUser();
        if (isMounted) setUser(null);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      try { controller.abort(); } catch {}
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
