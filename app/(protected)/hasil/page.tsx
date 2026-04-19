"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { rankRiasecScores, RIASEC_LABELS_ID } from "@/lib/scoring";
import type { RiasecCode } from "@/lib/questions";
import { subscribeUserDocument } from "@/lib/firestore";
import { useAuth } from "@/components/AuthProvider";
import { RiasecAllCategoriesSection } from "@/components/RiasecAllCategoriesSection";
import { LoaderFive } from "@/components/ui/loader";
import type { UserDocument } from "@/lib/user-document";

function HasilLoadingSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <LoaderFive text="Memuat hasil..." className="py-2" />

      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-8 max-w-xs animate-pulse rounded-lg bg-stone-200" />
            <div className="h-4 max-w-lg animate-pulse rounded bg-stone-100" />
          </div>
          <ul className="grid gap-2 sm:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <li
                key={i}
                className="h-5 animate-pulse rounded bg-stone-100"
              />
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <div className="h-7 w-24 animate-pulse rounded-full bg-teal-100/80" />
            <div className="h-7 w-28 animate-pulse rounded-full bg-teal-100/80" />
            <div className="h-7 w-20 animate-pulse rounded-full bg-teal-100/80" />
          </div>
          <div className="h-3 max-w-md animate-pulse rounded bg-stone-100" />
        </div>

        <div className="mt-8 border-t border-stone-100 pt-6">
          <div className="h-4 w-40 animate-pulse rounded bg-stone-200" />
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-row gap-3 rounded-2xl border border-stone-100 bg-stone-50/80 p-3 sm:flex-col"
              >
                <div className="h-20 w-24 shrink-0 animate-pulse rounded-xl bg-stone-200/80 sm:h-28 sm:w-full" />
                <div className="min-w-0 flex-1 space-y-2 pt-1 sm:pt-0">
                  <div className="mx-auto h-4 max-w-[7rem] animate-pulse rounded bg-stone-200 sm:mx-auto" />
                  <div className="mx-auto h-3 w-16 animate-pulse rounded bg-stone-100 sm:mx-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="h-6 max-w-xs animate-pulse rounded-lg bg-stone-200" />
        <div className="mt-2 h-4 max-w-lg animate-pulse rounded bg-stone-100" />
        <ul className="mt-6 space-y-5">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <li
              key={i}
              className="border-b border-stone-100 pb-5 last:border-0 last:pb-0"
            >
              <div className="mx-auto flex max-w-xs justify-center gap-2">
                <div className="h-6 w-14 animate-pulse rounded bg-stone-200" />
                <div className="h-6 w-28 animate-pulse rounded bg-stone-200" />
              </div>
              <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-stone-100" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

const CAREERS_BY_CODE: Record<RiasecCode, string[]> = {
  C: ["Akuntansi", "Pekerjaan Kantoran"],
  R: ["Pertanian", "Atletik/Olahraga"],
  I: ["Ilmu Kedokteran", "Layanan Kesehatan"],
  A: ["Penulisan Kreatif", "Pemasaran"],
  S: ["Pengajaran/Pendidikan", "Ilmu Sosial"],
  E: ["Politik", "Penjualan"],
};

const IMAGE_BY_CODE: Record<RiasecCode, string> = {
  A: "/Artistic.svg",
  C: "/Conventional.svg",
  E: "/Enterprising.svg",
  I: "/Investigative.svg",
  R: "/Realistic.svg",
  S: "/Social.svg",
};

export default function HasilPage() {
  const { user } = useAuth();
  const [doc, setDoc] = useState<UserDocument | null | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserDocument(user.uid, setDoc);
    return () => unsub();
  }, [user]);

  if (doc === undefined) {
    return <HasilLoadingSkeleton />;
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
    3
  );

  const careerTexts = topCodes
    .flatMap((code) => CAREERS_BY_CODE[code] ?? [])
    .filter(Boolean);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-xl font-semibold text-stone-900 sm:text-2xl">
              Bidang yang mungkin cocok untuk kamu
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              Berdasarkan tiga kategori RIASEC tertinggi, ini contoh bidang yang
              sering selaras.
            </p>
          </div>

          <ul className="grid gap-2 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2">
            {careerTexts.map((text, i) => (
              <li
                key={`${text}-${i}`}
                className="flex gap-2 text-sm font-semibold leading-snug text-teal-900 sm:text-base"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500"
                  aria-hidden
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-2">
            {topCodes.map((code) => (
              <span
                key={code}
                className="inline-flex items-center rounded-full border border-teal-100 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900"
              >
                {RIASEC_LABELS_ID[code]}
              </span>
            ))}
          </div>

          <p className="text-xs text-stone-600">
            Cocokkan lagi dengan minat nyata, kemampuan, dan diskusi dengan
            pembimbing atau guru.
          </p>
        </div>

        <div className="mt-8 border-t border-stone-100 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
            Tiga kategori teratas
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {topCodes.map((code, index) => (
              <div
                key={code}
                className="flex flex-row items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50/80 p-3 sm:flex-col sm:items-stretch sm:text-center"
              >
                <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white sm:h-28 sm:w-full">
                  <Image
                    src={IMAGE_BY_CODE[code]}
                    alt=""
                    width={200}
                    height={160}
                    className="h-full w-full object-contain p-1.5"
                    priority={index === 0}
                  />
                </div>
                <div className="min-w-0 flex-1 sm:flex-none">
                  <p className="text-sm font-semibold text-stone-900">
                    {RIASEC_LABELS_ID[code]}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-600">
                    Skor:{" "}
                    <span className="tabular-nums font-medium text-stone-800">
                      {scores[code]}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-stone-500">
            Skor = berapa kali kamu memilih jawaban yang mengarah ke kategori
            tersebut (satu poin per soal).
          </p>
        </div>
      </section>

      <RiasecAllCategoriesSection ranked={ranked} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/tes-minat"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-teal-600 bg-white px-5 text-sm font-semibold text-teal-800 shadow-sm transition hover:bg-teal-50 sm:w-auto"
        >
          Ulangi tes
        </Link>
        <Link
          href="/roadmap"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 sm:w-auto"
        >
          Buat peta jalan karier
        </Link>
      </div>
    </div>
  );
}
