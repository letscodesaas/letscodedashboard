'use client';
import React, { useEffect, useState, createContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import jwt from 'jsonwebtoken';

const decodeToken = (token: string) => {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (err) {
    console.error('Failed to decode token:', err);
    return null;
  }
};
export const AuthContexts = createContext({});

function AuthContext({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userInfo, setUserInfo] = useState({}); // use `any` or better, define an interface

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    const publicRoutes = ['/', '/register', '/forgot-password'];
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!token && !isPublicRoute) {
      router.push('/');
    } else if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setUserInfo(decoded);
        console.log('Decoded token:', decoded);
      } else {
        console.warn('Invalid token.');
      }

      // If user is on a public route and already logged in, redirect to dashboard
      if (isPublicRoute && pathname !== '/') {
        router.push('/dashboard');
      }
    }

    setIsAuthChecked(true);
  }, [pathname, router]);

  if (!isAuthChecked) return null;

  return (
    <>
      <AuthContexts.Provider value={userInfo}>{children}</AuthContexts.Provider>
    </>
  );
}

export default AuthContext;
