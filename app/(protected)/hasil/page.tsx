"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-sm font-semibold text-teal-800 transition hover:text-teal-950"
        >
          ← Kembali
        </button>
        <HasilLoadingSkeleton />
      </div>
    );
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
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-sm font-semibold text-teal-800 transition hover:text-teal-950"
        >
          ← Kembali
        </button>
        <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5 text-center shadow-sm">
          <h1 className="text-base font-semibold text-stone-900">
            Belum ada hasil
          </h1>
          <p className="text-sm text-stone-600">Kerjakan tes minat dulu.</p>
          <Link
            href="/tes-minat"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white"
          >
            Mulai tes
          </Link>
        </div>
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
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm font-semibold text-teal-800 transition hover:text-teal-950"
      >
        ← Kembali
      </button>
      <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <header className="space-y-2">
          <h1 className="text-lg font-semibold tracking-tight text-stone-900 sm:text-xl">
            Ringkasan hasil
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="inline-flex items-center rounded-lg bg-teal-50 px-2 py-0.5 font-mono text-sm font-semibold text-teal-900 ring-1 ring-teal-100">
              {topCodes.join("")}
            </span>
            <span className="text-sm text-stone-600">{topReadable}</span>
          </div>
        </header>

        {history.length > 1 && (
          <div className="mt-3 rounded-lg border border-stone-200 bg-stone-50/60 px-2.5 py-2 sm:px-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
              Tes lain
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

        <div id="ringkasan-riasec" className="scroll-mt-6 mt-5 border-t border-stone-100 pt-5">
          <RiasecAllCategoriesSection
            ranked={ranked}
            previewCount={3}
            embedded
            compact
          />
        </div>

        <div id="mindmap-roadmap" className="scroll-mt-6 mt-5 border-t border-stone-100 pt-5">
          <h2 className="text-sm font-semibold text-stone-900">Peta jalan</h2>
          <p className="mt-0.5 text-xs text-stone-500">
            {hasMindmapForCodes ? (
              <>
                Mindmap untuk <span className="font-mono font-medium text-stone-700">{topCodes.join("")}</span>
              </>
            ) : (
              <>Belum ada mindmap · buat di peta jalan</>
            )}
          </p>

        {matchingRoadmaps.length > 0 ? (
          <ul className="mt-2 divide-y divide-stone-100 rounded-lg border border-stone-100 bg-stone-50/50">
            {matchingRoadmaps.slice(0, 3).map((rm) => (
              <li key={rm.createdAtMs}>
                <Link
                  href={`/roadmap?viewAt=${rm.createdAtMs}`}
                  className="flex items-center justify-between gap-2 px-2.5 py-2 text-xs transition hover:bg-white sm:px-3 sm:text-sm"
                >
                  <span className="min-w-0 text-stone-800">
                    <span className="font-medium tabular-nums">
                      {formatHistoryChip(rm.createdAtMs)}
                    </span>
                    <span className="text-stone-500"> · usia {rm.age}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-teal-800">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        {matchingRoadmaps.length > 3 ? (
          <p className="mt-1.5 text-[11px] text-stone-500">
            +{matchingRoadmaps.length - 3} lainnya —{" "}
            <Link href={roadmapWithCodesHref} className="font-medium text-teal-800 underline underline-offset-2">
              peta jalan
            </Link>
          </p>
        ) : null}

        {!newestMatchingRoadmap ? (
          <div className="mt-3">
            <Link
              href={roadmapWithCodesHref}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
            >
              Buat mindmap
            </Link>
          </div>
        ) : null}

        <p className="mt-3 text-center text-xs text-stone-500 sm:text-left">
          <Link href="/tes-minat" className="font-medium text-teal-800 underline underline-offset-2">
            Tes ulang
          </Link>
        </p>
        </div>
      </section>
    </div>
  );
}
