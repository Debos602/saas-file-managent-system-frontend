import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { login as apiLogin, getCurrentUser, logout as apiLogout } from "@/api/auth";

export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode; }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ App load হলে current user fetch করবে
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // ✅ Login (cookie backend সেট করবে)
  const login = useCallback(async (email: string, password: string) => {
    await apiLogin({ email, password });

    // after login try fetch current user (server may set cookie)
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      throw new Error("Failed to fetch user after login");
    }

    setUser(currentUser);
    return currentUser as User;
  }, []);

  // ✅ Logout (backend cookie clear করবে)
  const logout = useCallback(async () => {
    try {
      await apiLogout(); // backend এ cookie clear করবে

      // clear client state
      setUser(null);

      // ensure browser applies any Set-Cookie from the logout response and reset the app
      // navigate to login so protected routes re-evaluate with cleared cookies
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      // attempt best-effort client-side cleanup even if API call failed
      setUser(null);
      window.location.href = "/login";
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        role: user?.role ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}