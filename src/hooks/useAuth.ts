import { useContext } from 'react';
import { AuthContexts } from '@/context/Authcontext';

export const useAuth = () => {
  const context = useContext(AuthContexts);
  if (!context) {
    window.location.href = '/';
    return;
    // throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
