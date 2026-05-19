import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { checkSession, login as apiLogin, logout as apiLogout } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  const refreshSession = useCallback(async () => {
    setChecking(true);
    const admin = await checkSession();
    setIsAdmin(admin);
    setChecking(false);
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const login = useCallback(async (password) => {
    const result = await apiLogin(password);
    if (result.ok) {
      setIsAdmin(true);
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    await apiLogout();
    setIsAdmin(false);
  }, []);

  const value = useMemo(
    () => ({ isAdmin, checking, login, logout, refreshSession }),
    [isAdmin, checking, login, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
