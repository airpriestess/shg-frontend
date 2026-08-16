import { createContext, useContext, useEffect, useState } from "react";

const AUTH_WORKER_URL = "https://shg-auth-worker.airpriestess.workers.dev";
const TOKEN_STORAGE_KEY = "shg_auth_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchMe(token) {
    try {
      const res = await fetch(`${AUTH_WORKER_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
        return;
      }
      const { user: u } = await res.json();
      setUser(u);
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      fetchMe(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function signUp(email, password, fullName) {
    const res = await fetch(`${AUTH_WORKER_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sign up failed");
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setUser(data.user);
    return data;
  }

  async function signIn(email, password) {
    const res = await fetch(`${AUTH_WORKER_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Sign in failed");
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setUser(data.user);
    return data;
  }

  async function signOut() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      try {
        await fetch(`${AUTH_WORKER_URL}/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        // ignore network errors on logout, clear local state regardless
      }
    }
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  }

  async function resetPassword(email) {
    // Password reset requires email sending, not yet wired up (pending Nitrosend integration).
    throw new Error("Password reset isn't available yet — please contact support to reset your password.");
  }

  const tier = user?.tier || "free"; // "free" | "audio" | "goddess" | "lifetime"
  const isGoddessTier = tier === "goddess" || tier === "lifetime";
  const isAuthenticated = !!user;
  const token = user ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;

  return (
    <AuthContext.Provider value={{
      user, token,
      session: user ? { user } : null, // shape-compatible shim for existing consumers expecting session.user
      profile: user, // shim: profile and user are the same object now
      tier, isGoddessTier, isAuthenticated, loading,
      signUp, signIn, signOut, resetPassword,
      fetchProfile: () => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) fetchMe(token);
      },
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
