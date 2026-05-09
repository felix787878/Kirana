"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { rankRiasecScores, RIASEC_LABELS_ID } from "@/lib/scoring";
import type { RiasecCode } from "@/lib/questions";
import { subscribeUserDocument } from "@/lib/firestore";
import { useAuth } from "@/components/AuthProvider";
import { RiasecAllCategoriesSection } from "@/components/RiasecAllCategoriesSection";
import { LoaderFive } from "@/components/ui/loader";
import type { UserDocument } from "@/lib/user-document";

/** Sama dengan penyimpanan di Firestore (`saveRiasecTestResult`). */
const RIASEC_HISTORY_MAX = 5;

function HasilLoadingSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <LoaderFive text="Memuat hasil..." className="py-2" />

      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="space-y-3">
          <div className="h-8 max-w-lg animate-pulse rounded-lg bg-stone-200" />
          <div className="h-20 max-w-2xl animate-pulse rounded-lg bg-stone-100" />
          <div className="flex flex-wrap gap-2 pt-2">
            <div className="h-8 w-28 animate-pulse rounded-lg bg-teal-100/80" />
            <div className="h-6 w-20 animate-pulse rounded bg-stone-100" />
            <div className="h-6 w-24 animate-pulse rounded bg-stone-100" />
          </div>
        </div>
        <div className="mt-6 h-24 animate-pulse rounded-xl bg-stone-50" />

        <div className="mt-8 border-t border-stone-100 pt-6">
          <div className="h-6 max-w-xs animate-pulse rounded bg-stone-200" />
          <ul className="mt-4 space-y-4">
            {[0, 1, 2].map((i) => (
              <li key={i} className="space-y-2">
                <div className="h-10 w-full max-w-xs animate-pulse rounded bg-stone-100 mx-auto sm:mx-0" />
                <div className="h-3 w-full animate-pulse rounded-full bg-stone-100" />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-stone-100 pt-6 space-y-3">
          <div className="h-6 w-48 animate-pulse rounded bg-stone-200" />
          <div className="h-20 animate-pulse rounded-xl bg-stone-50" />
        </div>
      </section>
    </div>
  );
}

function formatHistoryLabel(createdAtMs: number) {
  try {
    return new Date(createdAtMs).toLocaleString("id-ID", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(createdAtMs);
  }
}

function formatHistoryChip(createdAtMs: number) {
  try {
    return new Date(createdAtMs).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default function HasilPage() {
  const { user } = useAuth();
  const [doc, setDoc] = useState<UserDocument | null | undefined>(undefined);
  const [selectedAt, setSelectedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserDocument(user.uid, setDoc);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const history = doc?.riasecHistory ?? null;
    if (!history?.length) return;
    if (selectedAt !== null) return;
    const first = history
      .filter(Boolean)
      .sort((a, b) => b.createdAtMs - a.createdAtMs)[0];
    if (first?.createdAtMs) setSelectedAt(first.createdAtMs);
  }, [doc, selectedAt]);

  if (doc === undefined) {
    return <HasilLoadingSkeleton />;
  }

  const history = (doc?.riasecHistory ?? [])
    .filter(Boolean)
    .sort((a, b) => b.createdAtMs - a.createdAtMs)
    .slice(0, RIASEC_HISTORY_MAX);

  const fallbackScores = doc?.riasecScores ?? null;
  const fallbackTopCodes = (doc?.topRiasecCodes ?? null)?.filter(Boolean) ?? null;

  const selected =
    (selectedAt !== null
      ? history.find((h) => h.createdAtMs === selectedAt)
      : null) ?? history[0];

  const scores = selected?.scores ?? fallbackScores;
  const topCodes = ((selected?.topCodes ?? fallbackTopCodes) as RiasecCode[] | null)
    ?.filter(Boolean)
    .slice(0, 3) ?? null;

  if (!scores || !topCodes?.length) {
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

  const ranked = rankRiasecScores(scores);
  const roadmapHistory = (doc?.roadmapHistory ?? []).filter(Boolean);
  const matchingRoadmaps = roadmapHistory
    .filter((r) => {
      const a = (r.topCodes ?? []).slice(0, 3).join(",");
      const b = topCodes.slice(0, 3).join(",");
      return a === b;
    })
    .sort((a, b) => b.createdAtMs - a.createdAtMs);

  const newestMatchingRoadmap = matchingRoadmaps[0];
  const roadmapWithCodesHref = `/roadmap?codes=${encodeURIComponent(topCodes.join(","))}`;
  const hasMindmapForCodes = !!newestMatchingRoadmap;

  const topReadable = topCodes
    .map((code) => RIASEC_LABELS_ID[code])
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <header className="space-y-2">
          <h1 className="text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl">
            Tes minat & roadmap
          </h1>
          <p className="max-w-prose text-sm leading-snug text-stone-600">
            Hasil RIASEC dan mindmap pakai <span className="font-medium text-stone-800">kode yang sama</span>. Mindmap
            kosong sampai kamu buat di peta jalan.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-0.5">
            <span className="inline-flex items-center rounded-lg bg-teal-50 px-2.5 py-1 font-mono text-sm font-semibold tracking-tight text-teal-900 ring-1 ring-teal-100">
              {topCodes.join("")}
            </span>
            <span className="text-sm text-stone-600">{topReadable}</span>
          </div>
        </header>

        {history.length > 1 && (
          <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50/60 px-3 py-3 sm:px-4">
            <p className="text-xs font-semibold text-stone-700">
              Riwayat tes · {RIASEC_HISTORY_MAX} terbaru
            </p>
            <div
              className="mt-2 flex flex-wrap gap-2"
              role="group"
              aria-label="Pilih hasil tes"
            >
              {history.map((h) => {
                const codes = (h.topCodes ?? [])
                  .filter(Boolean)
                  .slice(0, 3)
                  .join("");
                const isActive =
                  (selected?.createdAtMs ?? history[0]?.createdAtMs) === h.createdAtMs;
                return (
                  <button
                    key={h.createdAtMs}
                    type="button"
                    onClick={() => setSelectedAt(h.createdAtMs)}
                    className={`inline-flex min-h-[2.5rem] items-center gap-2 rounded-xl border px-3 py-1.5 text-left text-xs font-semibold transition sm:text-sm ${
                      isActive
                        ? "border-teal-600 bg-teal-50 text-teal-950 shadow-sm ring-1 ring-teal-600/20"
                        : "border-stone-200 bg-white text-stone-800 hover:border-teal-200 hover:bg-white"
                    }`}
                    title={formatHistoryLabel(h.createdAtMs)}
                  >
                    <span className="tabular-nums text-stone-600">
                      {formatHistoryChip(h.createdAtMs)}
                    </span>
                    <span className="rounded-md bg-stone-900/5 px-1.5 py-0.5 font-mono text-[11px] text-stone-900 sm:text-xs">
                      {codes}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <p
          className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-1 text-xs text-stone-600"
          role="navigation"
          aria-label="Alur singkat"
        >
          <span className="font-semibold text-stone-700">Alur:</span>
          <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[11px] font-medium text-stone-800">Tes</span>
          <span aria-hidden className="text-stone-400">
            →
          </span>
          <a
            href="#ringkasan-riasec"
            className="font-medium text-teal-800 underline decoration-teal-800/30 underline-offset-2"
          >
            Skor RIASEC
          </a>
          <span aria-hidden className="text-stone-400">
            →
          </span>
          <a
            href="#mindmap-roadmap"
            className="font-medium text-teal-800 underline decoration-teal-800/30 underline-offset-2"
          >
            Mindmap
          </a>
          {!hasMindmapForCodes ? (
            <span className="ml-0 sm:ml-1 text-amber-800/90">· belum ada untuk kode ini</span>
          ) : null}
        </p>

        <div id="ringkasan-riasec" className="scroll-mt-6 mt-6 border-t border-stone-100 pt-6">
          <RiasecAllCategoriesSection ranked={ranked} previewCount={3} embedded />
        </div>

        <div id="mindmap-roadmap" className="scroll-mt-6 mt-6 border-t border-stone-100 pt-6">
          <h2 className="text-base font-semibold text-stone-900 sm:text-lg">Mindmap & peta belajar</h2>
          <p className="mt-1 text-xs text-stone-600 sm:text-sm">
            Kombinasi{" "}
            <span className="font-mono font-semibold text-stone-800">{topCodes.join("")}</span> · buka / buat dari
            tombol di bawah.
          </p>

        {matchingRoadmaps.length > 0 ? (
          <ul className="mt-3 divide-y divide-stone-100 rounded-xl border border-stone-100 bg-stone-50/50">
            {matchingRoadmaps.slice(0, 3).map((rm) => (
              <li key={rm.createdAtMs}>
                <Link
                  href={`/roadmap?viewAt=${rm.createdAtMs}`}
                  className="flex items-center justify-between gap-3 px-3 py-2.5 text-xs transition hover:bg-white sm:px-4 sm:text-sm"
                >
                  <span className="min-w-0 font-medium text-stone-900">
                    <span className="block truncate">
                      {formatHistoryChip(rm.createdAtMs)}
                    </span>
                    <span className="mt-0.5 block text-xs font-normal text-stone-500">
                      Usia {rm.age} · kode{" "}
                      <span className="font-mono font-semibold text-stone-700">
                        {(rm.topCodes ?? []).slice(0, 3).join("")}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold text-teal-800">
                    Buka →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-xl border border-dashed border-stone-200 bg-stone-50/60 px-3 py-2.5 text-xs text-stone-600 sm:text-sm">
            Belum ada mindmap untuk kombinasi ini.
          </p>
        )}

        {matchingRoadmaps.length > 3 ? (
          <p className="mt-2 text-[11px] text-stone-500">
            +{matchingRoadmaps.length - 3} mindmap lain untuk kode ini — kelola lewat{" "}
            <Link href={roadmapWithCodesHref} className="font-semibold text-teal-800 underline underline-offset-2">
              peta jalan
            </Link>
            .
          </p>
        ) : null}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {newestMatchingRoadmap ? (
            <Link
              href={`/roadmap?viewAt=${newestMatchingRoadmap.createdAtMs}`}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 sm:min-w-[200px]"
            >
              Buka mindmap terbaru
            </Link>
          ) : (
            <Link
              href={roadmapWithCodesHref}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 sm:min-w-[200px]"
            >
              Buat mindmap pertama
            </Link>
          )}
          <Link
            href={roadmapWithCodesHref}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-stone-200 bg-white px-5 text-sm font-semibold text-stone-800 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/50 sm:min-w-[200px]"
          >
            Halaman peta jalan
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-stone-500 sm:text-left">
          <Link
            href="/tes-minat"
            className="font-medium text-teal-800 underline decoration-teal-800/30 underline-offset-2 hover:decoration-teal-800"
          >
            Ingin memperbarui hasil?
          </Link>{" "}
          Kamu bisa kerjakan tes minat lagi kapan saja.
        </p>
        </div>
      </section>
    </div>
  );
}
