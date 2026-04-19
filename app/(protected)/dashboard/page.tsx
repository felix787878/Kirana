import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Compass, FileText, Map } from "lucide-react";
import bannerImg from "@/app/banner.png";

const cards = [
  {
    href: "/tes-minat",
    title: "Tes minat RIASEC",
    desc: "30 soal untuk melihat pola minatmu dan rekomendasi karier.",
    icon: Compass,
    gradient: "from-teal-500 to-teal-700",
    ring: "group-hover:ring-teal-200/80",
  },
  {
    href: "/roadmap",
    title: "Generator peta jalan",
    desc: "Rencana langkah belajar dan karier dengan bantuan AI.",
    icon: Map,
    gradient: "from-cyan-500 to-teal-600",
    ring: "group-hover:ring-cyan-200/80",
  },
  {
    href: "/cv-maker",
    title: "CV Builder",
    desc: "Susun CV dengan bagian fleksibel, simpan, lalu unduh PDF.",
    icon: FileText,
    gradient: "from-emerald-500 to-teal-700",
    ring: "group-hover:ring-emerald-200/80",
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Full-bleed banner: hanya gambar, lebar penuh viewport (keluar dari max-w-3xl + padding main) */}
      <section
        className="relative -mt-8 ml-[calc(50%-50vw)] w-screen max-w-[100vw] overflow-x-hidden sm:-mt-10"
        aria-label="Banner menu utama"
      >
        <div className="mx-auto w-full max-w-full md:max-w-3xl md:overflow-hidden md:rounded-2xl md:shadow-md md:shadow-teal-900/10">
          <Image
            src={bannerImg}
            alt="Menu utama Kirana"
            priority
            className="block h-auto w-full"
            sizes="(max-width: 767px) 100vw, 768px"
          />
        </div>
      </section>

      <div className="grid gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className={`group relative overflow-hidden rounded-2xl border border-white/80 bg-white/85 p-5 shadow-md shadow-teal-900/[0.04] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-200/90 hover:shadow-lg hover:shadow-teal-900/[0.08] sm:p-6 ${c.ring}`}
            >
              <div className="flex gap-4 sm:gap-5">
                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-md shadow-teal-900/20`}
                >
                  <Icon className="h-7 w-7" strokeWidth={2} aria-hidden />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <h2 className="text-lg font-semibold text-stone-900">
                    {c.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-stone-600">
                    {c.desc}
                  </p>
                  <span className="inline-flex items-center gap-1 pt-1 text-sm font-semibold text-teal-700 transition group-hover:gap-2">
                    Buka
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center pb-2">
        <Link
          href="/hasil"
          className="inline-flex items-center justify-center rounded-2xl border border-teal-200/90 bg-white/90 px-6 py-3 text-sm font-semibold text-teal-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:shadow-md"
        >
          Lihat hasil tes terakhir
        </Link>
      </div>
    </div>
  );
}
