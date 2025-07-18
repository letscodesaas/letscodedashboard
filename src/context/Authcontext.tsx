'use client';
import React, { useEffect, useState, createContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import jwt from 'jsonwebtoken';

interface UserInfo {
  id?: string;
  email?: string;
  role?: string;
  policy?: [];
}

export const AuthContexts = createContext<UserInfo | null>(null);

const decodeToken = (token: string): UserInfo | null => {
  try {
    const decoded = jwt.decode(token) as UserInfo;
    return decoded;
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
};

function AuthContext({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    const publicRoutes = ['/', '/register', '/forgot-password'];

    const isPublicRoute = publicRoutes.includes(pathname);

    if (!token) {
      if (!isPublicRoute) {
        router.push('/');
      }
      setIsAuthChecked(true);
      return;
    }

    const decoded = decodeToken(token);
    if (decoded) {
      setUserInfo(decoded);

      // Redirect logged-in users away from auth pages
      if (isPublicRoute && pathname !== '/') {
        router.push('/dashboard');
      }
    } else {
      console.warn('Invalid token');
      sessionStorage.removeItem('token');
      router.push('/');
    }

    setIsAuthChecked(true);
  }, [pathname, router]);

  if (!isAuthChecked) return null; // Optional: loading spinner here

  return (
    <AuthContexts.Provider value={userInfo}>{children}</AuthContexts.Provider>
  );
}

export default AuthContext;
