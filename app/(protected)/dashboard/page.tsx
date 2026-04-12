import Link from "next/link";

const cards = [
  {
    href: "/tes-minat",
    title: "Tes minat RIASEC",
    desc: "30 soal untuk melihat pola minatmu dan rekomendasi karier.",
    emoji: "🧭",
  },
  {
    href: "/roadmap",
    title: "Generator peta jalan",
    desc: "Rencana langkah belajar dan karier dengan bantuan AI.",
    emoji: "🗺️",
  },
  {
    href: "/cv-maker",
    title: "Pembuat CV",
    desc: "Isi data, lihat pratinjau, unduh PDF satu halaman.",
    emoji: "📄",
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-stone-900">Menu utama</h1>
        <p className="text-sm text-stone-600">
          Pilih fitur di bawah. Hasil tes tersimpan di akunmu dan bisa kamu
          pakai untuk peta jalan karier.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-1">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-2xl"
              aria-hidden
            >
              {c.emoji}
            </span>
            <div className="min-w-0 space-y-1">
              <h2 className="font-semibold text-stone-900">{c.title}</h2>
              <p className="text-sm text-stone-600 leading-snug">{c.desc}</p>
              <span className="text-xs font-medium text-teal-700">
                Buka →
              </span>
            </div>
          </Link>
        ))}
      </div>
      <Link
        href="/hasil"
        className="block text-center text-sm text-teal-700 underline"
      >
        Lihat hasil tes terakhir
      </Link>
    </div>
  );
}
