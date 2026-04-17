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
      <div className="min-h-screen flex flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="font-medium text-stone-800">Konfigurasi belum siap</p>
        <p className="text-sm text-stone-600 max-w-md">{configError}</p>
        <Link href="/" className="text-sm text-teal-700 underline">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#d9edf4]">
        <LoaderFive text="Menyiapkan halaman..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <Link
            href="/"
            className="text-sm font-semibold text-teal-700 hover:text-teal-800"
          >
            ← Kirana
          </Link>
          <h1 className="text-2xl font-bold text-stone-900 pt-2">
            {mode === "login" ? "Masuk" : "Daftar akun"}
          </h1>
          <p className="text-sm text-stone-600">
            Gunakan email dan kata sandi untuk melanjutkan.
          </p>
        </div>

        <div className="flex rounded-xl border border-stone-200 bg-white p-1 shadow-sm">
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
          className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"
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
