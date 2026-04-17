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
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-stone-800 font-medium">Konfigurasi belum siap</p>
        <p className="text-sm text-stone-600 max-w-md">{configError}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#d9edf4]">
        <LoaderFive text="Memuat akun..." />
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
