"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { LoaderFive } from "@/components/ui/loader";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, configError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !configError && !user) {
      router.replace("/auth");
    }
  }, [loading, user, router, configError]);

  if (configError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-kirana-shell px-4 text-center">
        <p className="font-medium text-stone-800">Konfigurasi belum siap</p>
        <p className="max-w-md text-sm text-stone-600">{configError}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-kirana-shell px-4">
        <LoaderFive text="Memuat akun..." />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
