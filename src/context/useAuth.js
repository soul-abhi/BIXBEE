import { createContext, useContext } from 'react';

export const STORAGE_KEY = 'bixbee.identity';
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export const AuthContext = createContext(null);

export const generateId = () => {
  const digits = '0123456789';
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


  const d = () => digits[Math.floor(Math.random() * 10)];
  const l = () => letters[Math.floor(Math.random() * 26)];

  return `${d()}${d()}${l()}${l()}${d()}${d()}`;
}


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
