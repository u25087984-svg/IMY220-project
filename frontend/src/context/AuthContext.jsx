import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const KEY = 'momentum_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch {
      return null;
    }
  });

  function login(u) {
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  }

  function logout() {
    localStorage.removeItem(KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}