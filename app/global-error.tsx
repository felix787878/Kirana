"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="bg-kirana-shell">
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            Aplikasi mengalami gangguan.
          </h2>
          <p className="max-w-md text-sm text-slate-600">
            {error.message || "Terjadi error tak terduga."}
          </p>
          <button
            type="button"
            onClick={reset}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-800"
          >
            Muat ulang
          </button>
        </div>
      </body>
    </html>
  );
}
