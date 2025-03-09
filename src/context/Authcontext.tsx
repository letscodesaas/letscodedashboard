'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

function AuthContext({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    const publicRoutes = ['/', '/register', '/forgot-password'];
    const isPublicRoute = publicRoutes.includes(pathname);
    if (!token && !isPublicRoute) {
      router.push('/');
    } else if (token && isPublicRoute && pathname !== '/') {
      router.push('/dashboard');
    }
    setIsAuthChecked(true);
  }, [pathname, router]);
  if (!isAuthChecked) {
    return null;
  }

  return <>{children}</>;
}

export default AuthContext;
