import { useContext } from 'react';
import { AuthContexts } from '@/context/Authcontext';

export const useAuth = () => {
  const context = useContext(AuthContexts);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
