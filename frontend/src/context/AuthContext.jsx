import { createContext, useContext, useEffect, useState } from "react";
import { fetchMe, login as loginRequest, logout as logoutRequest } from "../api/auth";
import { tokenStore } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tokenStore.getAccess()) { setLoading(false); return; }
    fetchMe().then(setUser).catch(() => tokenStore.clear()).finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    setError(null);
    try {
      await loginRequest(username, password);
      const me = await fetchMe();
      setUser(me);
      return me;
    } catch {
      setError("Incorrect username or password.");
      throw new Error("login failed");
    }
  }

  function logout() {
    logoutRequest();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAdmin: !!user?.is_staff }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}