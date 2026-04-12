import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-amber-50">
      <div className="mx-auto flex max-w-lg flex-col gap-8 px-4 py-16 sm:py-24">
        <div className="space-y-3 text-center sm:text-left">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
            Platform minat karier
          </p>
          <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
            Kirana
          </h1>
          <p className="text-balance text-stone-600 leading-relaxed">
            Teman belajar untuk remaja usia 12–18 tahun di panti asuhan:
            tes minat RIASEC, rencana karier dengan bimbingan AI, dan
            pembuat CV sederhana — semuanya dalam bahasa Indonesia.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/auth"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-teal-700 px-6 text-sm font-semibold text-white shadow-sm hover:bg-teal-800"
          >
            Masuk atau daftar
          </Link>
          <p className="text-center text-xs text-stone-500 sm:text-left">
            Butuh akun email & kata sandi. Data kamu disimpan aman di akunmu.
          </p>
        </div>
        <ul className="grid gap-3 rounded-2xl border border-stone-200 bg-white/80 p-4 text-sm text-stone-700 shadow-sm">
          <li className="flex gap-2">
            <span className="text-teal-600">✓</span>
            Tes minat 30 soal berbasis RIASEC
          </li>
          <li className="flex gap-2">
            <span className="text-teal-600">✓</span>
            Peta jalan karier yang dipersonalisasi
          </li>
          <li className="flex gap-2">
            <span className="text-teal-600">✓</span>
            CV satu halaman siap unduh PDF
          </li>
        </ul>
      </div>
    </div>
  );
}
