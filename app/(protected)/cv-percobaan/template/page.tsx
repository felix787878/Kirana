"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import jemoPhoto from "@/app/Profil/jemo di TikTok.jpg";

type ColorOption = {
  id: string;
  name: string;
  hex: string;
};

const COLOR_OPTIONS: ColorOption[] = [
  { id: "teal", name: "Toska", hex: "#0EA5A6" },
  { id: "blue", name: "Biru", hex: "#2563EB" },
  { id: "indigo", name: "Indigo", hex: "#4F46E5" },
  { id: "emerald", name: "Hijau", hex: "#059669" },
  { id: "orange", name: "Oranye", hex: "#EA580C" },
  { id: "rose", name: "Merah muda", hex: "#E11D48" },
  { id: "slate", name: "Abu gelap", hex: "#334155" },
];

export default function CvPercobaanTemplatePage() {
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);

  const accent = useMemo(() => selectedColor?.hex ?? "#CBD5E1", [selectedColor]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">CV (percobaan) - Template</h1>
          <p className="text-sm text-slate-600">
            Pilih warna tema dulu, lalu lanjut ke tahap pengisian data.
          </p>
        </div>
        <Link
          href="/cv-percobaan"
          className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Kembali
        </Link>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="grid min-h-[680px] grid-cols-[120px_minmax(0,1fr)] sm:grid-cols-[180px_minmax(0,1fr)]">
            <aside className="px-4 py-6 text-white sm:px-6" style={{ backgroundColor: accent }}>
              <div className="flex justify-center">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white/80 sm:h-28 sm:w-28">
                  <Image
                    src={jemoPhoto}
                    alt="Foto profil CV percobaan"
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/90">KEAHLIAN</p>
                <ul className="space-y-1 text-[11px] leading-relaxed text-white/95 sm:text-xs">
                  <li>Komunikasi dan pelayanan pelanggan</li>
                  <li>Pengolahan data dan administrasi</li>
                  <li>Kerja tim dan kepemimpinan dasar</li>
                  <li>Manajemen waktu dan prioritas</li>
                  <li>Bahasa Indonesia aktif</li>
                </ul>
              </div>
            </aside>

            <div className="bg-white px-5 py-6 sm:px-8">
              <header>
                <h2 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
                  JEMA
                  <br />
                  NURDIANSYAH
                </h2>
                <p className="mt-2 text-sm text-slate-600">Jakarta Selatan - +62 812-3456-7890 - jema@email.com</p>
              </header>

              <div className="mt-6 space-y-5 text-slate-700">
                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: accent }}>
                    Ringkasan
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed">
                    Lulusan yang antusias membangun karier di bidang operasional dan layanan. Terbiasa
                    bekerja teliti, cepat belajar, serta mampu beradaptasi dengan target dan ritme kerja
                    tim.
                  </p>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: accent }}>
                    Pengalaman
                  </h3>
                  <div className="mt-1.5 space-y-2 text-sm">
                    <p>
                      <span className="font-semibold text-slate-900">Staf Operasional</span> - PT Maju Terus
                      (2023 - Sekarang)
                    </p>
                    <ul className="list-disc space-y-1 pl-5 leading-relaxed">
                      <li>Menyusun laporan harian dan memastikan data sesuai standar.</li>
                      <li>Mendukung koordinasi tim agar proses layanan lebih efisien.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-sm font-bold uppercase tracking-wide" style={{ color: accent }}>
                    Pendidikan
                  </h3>
                  <p className="mt-1.5 text-sm">
                    S1 Manajemen - Universitas Negeri Jakarta (2019 - 2023)
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <p className="text-sm font-semibold text-slate-800">Pilih warna tema</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {COLOR_OPTIONS.map((option) => {
              const isActive = selectedColor?.id === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedColor(option)}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                    isActive ? "border-slate-900" : "border-slate-200 hover:border-slate-300"
                  }`}
                  style={{ backgroundColor: option.hex }}
                  title={option.name}
                  aria-label={`Pilih warna ${option.name}`}
                >
                  {isActive ? <Check className="h-4 w-4 text-white" aria-hidden /> : null}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex justify-end">
            {selectedColor ? (
              <Link
                href={`/cv-percobaan/editor?accent=${selectedColor.id}`}
                className="inline-flex h-11 items-center rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Lanjut
              </Link>
            ) : (
              <span className="inline-flex h-11 cursor-not-allowed items-center rounded-xl bg-slate-200 px-5 text-sm font-semibold text-slate-400">
                Lanjut
              </span>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
