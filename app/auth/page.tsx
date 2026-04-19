"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { LoaderFive } from "@/components/ui/loader";

type Mode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const { user, loading, configError } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      router.replace("/dashboard");
    } catch (err: unknown) {
      const code =
        err && typeof err === "object" && "code" in err
          ? String((err as { code?: string }).code)
          : "";
      const map: Record<string, string> = {
        "auth/email-already-in-use": "Email sudah terdaftar.",
        "auth/invalid-email": "Format email tidak valid.",
        "auth/weak-password": "Kata sandi minimal 6 karakter.",
        "auth/user-not-found": "Akun tidak ditemukan.",
        "auth/wrong-password": "Kata sandi salah.",
        "auth/invalid-credential": "Email atau kata sandi salah.",
      };
      setError(map[code] ?? "Terjadi kesalahan. Coba lagi.");
    } finally {
      setBusy(false);
    }
  }

  if (configError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-kirana-shell px-4 text-center">
        <p className="font-semibold text-stone-900">Konfigurasi belum siap</p>
        <p className="max-w-md text-sm text-stone-600">{configError}</p>
        <Link
          href="/"
          className="rounded-xl border border-teal-200 bg-white px-4 py-2 text-sm font-semibold text-teal-800 shadow-sm hover:bg-teal-50"
        >
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-kirana-shell px-4">
        <LoaderFive text="Menyiapkan halaman..." />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-kirana-shell px-4 py-10 sm:py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-teal-100/35 via-transparent to-transparent" />
      <div className="relative mx-auto w-full max-w-md space-y-6">
        <div className="space-y-1 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-800 transition hover:text-teal-950"
          >
            ← Beranda Kirana
          </Link>
          <h1 className="pt-3 text-2xl font-bold tracking-tight text-stone-900">
            {mode === "login" ? "Masuk" : "Daftar akun"}
          </h1>
          <p className="text-sm text-stone-600">
            Gunakan email dan kata sandi untuk melanjutkan.
          </p>
        </div>

        <div className="flex rounded-2xl border border-white/80 bg-white/90 p-1 shadow-md shadow-teal-900/[0.06] backdrop-blur-sm">
          <button
            type="button"
            className={`flex-1 rounded-lg py-2 text-sm font-medium ${
              mode === "login"
                ? "bg-teal-700 text-white"
                : "text-stone-600 hover:bg-stone-50"
            }`}
            onClick={() => {
              setMode("login");
              setError(null);
            }}
          >
            Masuk
          </button>
          <button
            type="button"
            className={`flex-1 rounded-lg py-2 text-sm font-medium ${
              mode === "register"
                ? "bg-teal-700 text-white"
                : "text-stone-600 hover:bg-stone-50"
            }`}
            onClick={() => {
              setMode("register");
              setError(null);
            }}
          >
            Daftar
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-white/80 bg-white/90 p-6 shadow-lg shadow-teal-900/[0.06] backdrop-blur-sm"
        >
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-medium text-stone-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-600 focus:ring-2"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="text-xs font-medium text-stone-700"
            >
              Kata sandi
            </label>
            <input
              id="password"
              type="password"
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-600 focus:ring-2"
            />
            <p className="text-xs text-stone-500">Minimal 6 karakter.</p>
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={busy}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
          >
            {busy ? "Memproses..." : mode === "login" ? "Masuk" : "Buat akun"}
          </button>
        </form>
      </div>
    </div>
  );
}
