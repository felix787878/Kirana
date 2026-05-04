"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-kirana-shell px-4 text-center">
      <h2 className="text-xl font-semibold text-slate-900">Terjadi kesalahan.</h2>
      <p className="max-w-md text-sm text-slate-600">
        Coba muat ulang halaman. Jika masih sama, klik tombol di bawah untuk mencoba lagi.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
      >
        Coba lagi
      </button>
    </div>
  );
}
