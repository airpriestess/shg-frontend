import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user] = useState(null);
  const [session] = useState(null);
  const [profile] = useState(null);

  const tier = "free";
  const isGoddessTier = false;
  const isAuthenticated = false;
  const loading = false;

  async function signUp() { throw new Error("Auth not yet configured."); }
  async function signIn() { throw new Error("Auth not yet configured."); }
  async function signOut() {}
  async function resetPassword() {}
  async function fetchProfile() {}

  return (
    <AuthContext.Provider value={{
      user, session, profile, tier, isGoddessTier, isAuthenticated, loading,
      signUp, signIn, signOut, resetPassword, fetchProfile,
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
