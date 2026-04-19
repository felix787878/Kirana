"use client";

import { AppHeader } from "@/components/AppHeader";
import { AuthGuard } from "@/components/AuthGuard";

export function AuthedShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="relative flex min-h-screen flex-col">
        <div
          className="pointer-events-none fixed inset-0 -z-10 bg-kirana-shell"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[min(45vh,420px)] bg-gradient-to-b from-teal-100/40 via-transparent to-transparent"
          aria-hidden
        />
        <AppHeader />
        <main className="relative z-0 mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-5 sm:py-10">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
