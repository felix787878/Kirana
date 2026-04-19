"use client";

import Image from "next/image";
import { useState } from "react";
import type { RiasecCode } from "@/lib/questions";
import { RIASEC_LABELS_ID, type RankedCategory } from "@/lib/scoring";

const IMAGE_BY_CODE: Record<RiasecCode, string> = {
  A: "/Artistic.svg",
  C: "/Conventional.svg",
  E: "/Enterprising.svg",
  I: "/Investigative.svg",
  R: "/Realistic.svg",
  S: "/Social.svg",
};

/** Skor per dimensi: 5 soal × bobot 1–5 → rentang 5–25 */
export function riasecScoreToPercent(score: number): number {
  const clamped = Math.max(5, Math.min(25, score));
  return Math.round(((clamped - 5) / 20) * 100);
}

const BAR_STYLE: Record<
  RiasecCode,
  { fill: string; percentText: string; track: string }
> = {
  R: {
    fill: "bg-teal-500",
    percentText: "text-teal-600",
    track: "bg-teal-100",
  },
  I: {
    fill: "bg-amber-500",
    percentText: "text-amber-600",
    track: "bg-amber-100",
  },
  A: {
    fill: "bg-rose-500",
    percentText: "text-rose-600",
    track: "bg-rose-100",
  },
  S: {
    fill: "bg-emerald-500",
    percentText: "text-emerald-600",
    track: "bg-emerald-100",
  },
  E: {
    fill: "bg-violet-500",
    percentText: "text-violet-600",
    track: "bg-violet-100",
  },
  C: {
    fill: "bg-orange-500",
    percentText: "text-orange-600",
    track: "bg-orange-100",
  },
};

const RIASEC_LONG_DESCRIPTION: Record<RiasecCode, string> = {
  C: "Kamu menyukai pekerjaan yang berkaitan dengan: mengikuti prosedur dan aturan untuk mengelola informasi atau data, biasanya dalam lingkungan perkantoran.",
  R: "Kamu menyukai pekerjaan yang berkaitan dengan: merancang, membangun, atau memperbaiki peralatan, melakukan aktivitas fisik, atau bekerja di luar ruangan.",
  I: "Kamu menyukai pekerjaan yang berkaitan dengan: mempelajari dan meneliti benda mati, makhluk hidup, penyakit, atau perilaku manusia.",
  A: "Kamu menyukai pekerjaan yang berkaitan dengan: menciptakan karya seni visual, pertunjukan, tulisan, makanan, atau musik.",
  S: "Kamu menyukai pekerjaan yang berkaitan dengan: membantu, mengajar, memberi nasihat, atau memberikan pelayanan kepada orang lain.",
  E: "Kamu menyukai pekerjaan yang berkaitan dengan mengelola, bernegosiasi, pemasaran, atau penjualan, serta memimpin atau memberi masukan dalam situasi politik dan hukum.",
};

type Props = {
  ranked: RankedCategory[];
};

export function RiasecAllCategoriesSection({ ranked }: Props) {
  const [openCode, setOpenCode] = useState<RiasecCode | null>(null);

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-stone-900">
        Ringkasan semua kategori
      </h2>
      <p className="mt-1 text-sm text-stone-600">
        Persentase menunjukkan seberapa kuat minatmu pada tiap tipe (dari skor
        tes).
      </p>

      <ul className="mt-6 space-y-5">
        {ranked.map((row) => {
          const code = row.code;
          const pct = riasecScoreToPercent(row.score);
          const style = BAR_STYLE[code];
          const isOpen = openCode === code;
          const label = RIASEC_LABELS_ID[code];

          return (
            <li key={code} className="border-b border-stone-100 pb-5 last:border-0 last:pb-0">
              <button
                type="button"
                onClick={() => setOpenCode(isOpen ? null : code)}
                className="w-full rounded-xl text-left outline-none ring-teal-600/0 transition hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-teal-600"
                aria-expanded={isOpen}
                aria-label={
                  isOpen
                    ? `Tutup penjelasan ${label}`
                    : `Buka penjelasan ${label}`
                }
              >
                <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-0.5">
                  <span
                    className={`text-lg font-bold tabular-nums ${style.percentText}`}
                  >
                    {pct}%
                  </span>
                  <span className="text-lg font-bold text-stone-900">
                    {label}
                  </span>
                </div>

                <div className="px-0.5 sm:px-1">
                  <div
                    className={`relative h-3 w-full rounded-full ${style.track}`}
                  >
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${style.fill} transition-[width] duration-300 ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                    <span
                      className="pointer-events-none absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-md ring-1 ring-stone-200/80"
                      style={{ left: `${pct}%` }}
                    />
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/90 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="mx-auto flex h-36 w-full max-w-[200px] shrink-0 items-center justify-center rounded-xl bg-white p-3 shadow-sm sm:mx-0 sm:h-40 sm:max-w-[180px]">
                      <Image
                        src={IMAGE_BY_CODE[code]}
                        alt={label}
                        width={200}
                        height={160}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-stone-900">
                        {label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-stone-700">
                        {RIASEC_LONG_DESCRIPTION[code]}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
