"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";

export function AppHeader() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut(getFirebaseAuth());
      router.replace("/");
    } catch {
      router.replace("/");
    }
  }

  return (
    <header className="border-b border-stone-200 bg-white/90 backdrop-blur-sm sticky top-0 z-20">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-teal-800 hover:text-teal-900"
        >
          Kirana
        </Link>
        <div className="flex items-center gap-2 min-w-0">
          <span className="truncate text-xs text-stone-500 max-w-[140px] sm:max-w-[220px]">
            {user?.email ?? ""}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
