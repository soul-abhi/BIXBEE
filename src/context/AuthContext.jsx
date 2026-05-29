import { useEffect, useState } from 'react';
import { AuthContext, STORAGE_KEY, generateId } from './useAuth';

export const AuthProvider = ({ children }) => {
  const [identity, setIdentity] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [intent, setIntent] = useState(null);

  useEffect(() => {
    try {
      if (identity) localStorage.setItem(STORAGE_KEY, identity);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  }, [identity]);

  const login = (id) => {
    const clean = (id || '').trim().toUpperCase();
    if (!/^[0-9]{2}[A-Z]{2}[0-9]{2}$/.test(clean)) return 'ID must match format 00AA00 (digits, letters, digits).';
    setIdentity(clean);
    setIntent(null);
    return null;
  };


  const signup = () => {
    const id = generateId();
    setIdentity(id);
    setIntent(null);
    return id;
  };

  const logout = () => setIdentity(null);

  return (
    <AuthContext.Provider value={{ identity, intent, setIntent, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
