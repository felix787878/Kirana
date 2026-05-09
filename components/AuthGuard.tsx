"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { LoaderFive } from "@/components/ui/loader";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, configError } = useAuth();
  const pathname = usePathname();
  const allowGuest =
    pathname === "/dashboard" ||
    pathname === "/tes-minat" ||
    pathname === "/roadmap" ||
    pathname === "/cv-maker" ||
    pathname === "/cv" ||
    pathname === "/cv/editor" ||
    pathname === "/cv/template" ||
    pathname === "/cv-percobaan" ||
    pathname === "/cv-percobaan/editor" ||
    pathname === "/cv-percobaan/template";

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

  if (!user && !allowGuest) {
    const next = pathname?.startsWith("/") ? pathname : "/dashboard";
    return (
      <div className="flex min-h-screen items-center justify-center bg-kirana-shell px-4">
        <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-stone-900">
            Login dulu untuk lanjut
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Fitur ini menyimpan progres dan histori, jadi kamu perlu login agar
            datamu aman dan bisa dibuka lagi kapan saja.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href={`/auth?mode=login&next=${encodeURIComponent(next)}`}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-700 hover:bg-stone-50"
            >
              Kembali
            </Link>
          </div>
          <div className="mt-4 text-xs text-stone-500">
            Belum punya akun? Kamu bisa daftar di halaman login.
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
