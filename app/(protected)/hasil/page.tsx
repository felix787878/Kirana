"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  careerSuggestionsForCodes,
  rankRiasecScores,
  RIASEC_LABELS_ID,
} from "@/lib/scoring";
import type { RiasecCode } from "@/lib/questions";
import { subscribeUserDocument } from "@/lib/firestore";
import { useAuth } from "@/components/AuthProvider";
import type { UserDocument } from "@/lib/user-document";

export default function HasilPage() {
  const { user } = useAuth();
  const [doc, setDoc] = useState<UserDocument | null | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserDocument(user.uid, setDoc);
    return () => unsub();
  }, [user]);

  if (doc === undefined) {
    return (
      <div className="py-12 text-center text-stone-600">Memuat hasil...</div>
    );
  }

  if (!doc?.riasecScores || !doc.topRiasecCodes?.length) {
    return (
      <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-stone-900">
          Belum ada hasil tes
        </h1>
        <p className="text-sm text-stone-600">
          Kerjakan tes minat dulu untuk melihat kategori RIASEC dan saran
          karier.
        </p>
        <Link
          href="/tes-minat"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white"
        >
          Mulai tes minat
        </Link>
      </div>
    );
  }

  const scores = doc.riasecScores;
  const ranked = rankRiasecScores(scores);
  const topCodes = (doc.topRiasecCodes.filter(Boolean) as RiasecCode[]).slice(
    0,
    2
  );
  const jobs = careerSuggestionsForCodes(topCodes);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-stone-900">Hasil tes minat</h1>
        <p className="text-sm text-stone-600">
          Dua kategori tertinggi dan ide karier yang selaras.
        </p>
      </div>

      <section className="rounded-2xl border border-teal-100 bg-teal-50/80 p-4 sm:p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-900">
          Kategori teratas
        </h2>
        <ul className="mt-3 space-y-2">
          {topCodes.map((code) => (
            <li
              key={code}
              className="flex items-center justify-between rounded-xl bg-white/90 px-3 py-2 text-sm"
            >
              <span className="font-medium text-stone-900">
                {RIASEC_LABELS_ID[code]}
              </span>
              <span className="text-stone-600">Skor: {scores[code]}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-teal-900/80">
          Skor = berapa kali kamu memilih jawaban yang mengarah ke kategori
          tersebut (satu poin per soal).
        </p>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="font-semibold text-stone-900">Ringkasan semua kategori</h2>
        <ul className="mt-3 space-y-2">
          {ranked.map((row) => (
            <li
              key={row.code}
              className="flex items-center justify-between text-sm border-b border-stone-100 pb-2 last:border-0"
            >
              <span>{row.label}</span>
              <span className="tabular-nums text-stone-600">{row.score}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="font-semibold text-stone-900">
          Rekomendasi karier (gagasan)
        </h2>
        <p className="mt-1 text-xs text-stone-500">
          Ini contoh jalur karier; diskusikan dengan pembimbing atau guru.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-stone-700">
          {jobs.map((j) => (
            <li key={j}>{j}</li>
          ))}
        </ul>
      </section>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Link
          href="/tes-minat"
          className="text-center text-sm font-medium text-teal-700 underline"
        >
          Ulangi tes
        </Link>
        <Link
          href="/roadmap"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white"
        >
          Buat peta jalan karier
        </Link>
      </div>
    </div>
  );
}
