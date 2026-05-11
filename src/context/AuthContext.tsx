import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { fetchCurrentUser, loginUser as loginRequest } from "api/auth";
import type { User } from "types/conduit";

const STORAGE_TOKEN = "conduit_token";
const STORAGE_USER = "conduit_user";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredAuth(): { token: string | null; user: User | null } {
  const token = localStorage.getItem(STORAGE_TOKEN);
  const raw = localStorage.getItem(STORAGE_USER);
  if (!token || !raw) return { token: null, user: null };
  try {
    return { token, user: JSON.parse(raw) as User };
  } catch {
    return { token: null, user: null };
  }
}

function persistAuth(user: User): void {
  localStorage.setItem(STORAGE_TOKEN, user.token);
  localStorage.setItem(STORAGE_USER, JSON.stringify(user));
}

function clearAuth(): void {
  localStorage.removeItem(STORAGE_TOKEN);
  localStorage.removeItem(STORAGE_USER);
}

export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [{ token, user }, setAuth] = useState<{ token: string | null; user: User | null }>(() => ({
    token: null,
    user: null,
  }));
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = readStoredAuth();
      if (!stored.token) {
        if (!cancelled) setInitializing(false);
        return;
      }

      try {
        const fresh = await fetchCurrentUser(stored.token);
        if (!cancelled) {
          persistAuth(fresh);
          setAuth({ token: fresh.token, user: fresh });
        }
      } catch {
        if (!cancelled) {
          clearAuth();
          setAuth({ token: null, user: null });
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth({ token: null, user: null });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const nextUser = await loginRequest(email, password);
    persistAuth(nextUser);
    setAuth({ token: nextUser.token, user: nextUser });
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    const nextUser = await fetchCurrentUser(token);
    persistAuth(nextUser);
    setAuth({ token: nextUser.token, user: nextUser });
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      login,
      logout,
      refreshUser,
    }),
    [user, token, initializing, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
