"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configError: string | null;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  configError: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    try {
      const auth = getFirebaseAuth();
      unsubscribe = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Gagal memuat konfigurasi Firebase.";
      setConfigError(msg);
      setUser(null);
      setLoading(false);
    }
    return () => unsubscribe?.();
  }, []);

  const value = useMemo(
    () => ({ user, loading, configError }),
    [user, loading, configError]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
