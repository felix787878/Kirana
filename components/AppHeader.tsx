"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import iconImg from "@/app/icon.png";

export function AppHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  /** Di menu utama → ke beranda promosi; di halaman lain → kembali ke menu utama */
  const logoHref = pathname === "/dashboard" ? "/" : "/dashboard";
  const logoTitle =
    pathname === "/dashboard"
      ? "Halaman Tes. Rencanakan. Wujudkan."
      : "Menu utama";

  async function handleLogout() {
    try {
      await signOut(getFirebaseAuth());
      router.replace("/");
    } catch {
      router.replace("/");
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-white/75 shadow-sm shadow-teal-900/[0.04] backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <Link
          href={logoHref}
          className="flex items-center gap-2.5 rounded-xl py-1 pr-2 text-teal-900 transition hover:bg-teal-50/80"
          title={logoTitle}
        >
          <Image
            src={iconImg}
            alt={logoTitle}
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg shadow-sm"
            priority
          />
          <span className="text-base font-bold tracking-tight text-teal-900">
            Kirana
          </span>
        </Link>
        <div className="flex min-w-0 items-center gap-2">
          <span className="max-w-[120px] truncate text-xs text-stone-500 sm:max-w-[220px]">
            {user?.email ?? ""}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="shrink-0 rounded-xl border border-stone-200/90 bg-white px-3 py-2 text-xs font-semibold text-stone-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/80 hover:text-teal-900"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
