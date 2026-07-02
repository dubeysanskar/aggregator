'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { authAPI } from '@/lib/api';

const AuthContext = createContext(null);

const PUBLIC_PATHS = ['/login', '/register', '/verify', '/forgot-password'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublic = PUBLIC_PATHS.some(p => pathname?.startsWith(p));
    const token = Cookies.get('access_token');

    if (!token) {
      setLoading(false);
      if (!isPublic) {
        router.push('/login');
      }
      return;
    }

    authAPI.profile()
      .then(res => {
        setUser(res.data);
      })
      .catch(() => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        if (!isPublic) {
          router.push('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pathname, router]);

  const login = useCallback(async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { access, refresh, user: userData } = res.data;
    Cookies.set('access_token', access, { expires: 1 });
    Cookies.set('refresh_token', refresh, { expires: 7 });
    setUser(userData);
    router.push('/dashboard');
    return res.data;
  }, [router]);

  const register = useCallback(async (data) => {
    const res = await authAPI.register(data);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    setUser(null);
    router.push('/login');
  }, [router]);

  const verifyEmail = useCallback(async (email, code) => {
    const res = await authAPI.verifyEmail({ email, code });
    return res.data;
  }, []);

  const verifyPhone = useCallback(async (email, code) => {
    const res = await authAPI.verifyPhone({ email, code });
    return res.data;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white font-bold shadow-lg shadow-brand/25">PU</div>
          <div className="w-6 h-6 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, verifyEmail, verifyPhone, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
