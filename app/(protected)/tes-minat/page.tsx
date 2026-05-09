"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { RIASEC_QUESTIONS, type Question } from "@/lib/questions";
import {
  scoreRiasecAnswers,
  topRiasecCategories,
  validateAllQuestionsAnswered,
} from "@/lib/scoring";
import { saveRiasecTestResult } from "@/lib/firestore";
import { useAuth } from "@/components/AuthProvider";

const PENDING_RIASEC_KEY = "kirana_pending_riasec_answers";
const DRAFT_RIASEC_KEY = "kirana_riasec_draft_v1";
const DRAFT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 hari

type RiasecDraft = {
  version: 1;
  updatedAtMs: number;
  index: number;
  answers: Record<number, string>;
  orderedQuestionIds: number[];
};

const ANSWER_IMAGE_BY_VALUE: Record<number, string> = {
  1: "/Sangat_Tidak_Suka.png",
  2: "/Tidak_Suka.png",
  3: "/Netral.png",
  4: "/Suka.png",
  5: "/Sangat_Suka.png",
};

function shuffleQuestions() {
  const arr = [...RIASEC_QUESTIONS];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function TesMinatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderedQuestions, setOrderedQuestions] = useState(() => shuffleQuestions());
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [autosaveHandled, setAutosaveHandled] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);

  const q = orderedQuestions[index];
  const progress = useMemo(
    () => Math.round(((index + 1) / orderedQuestions.length) * 100),
    [index, orderedQuestions.length]
  );

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_RIASEC_KEY);
    } catch {
      // ignore
    }
  }

  function resetFromStart() {
    clearDraft();
    setOrderedQuestions(shuffleQuestions());
    setAnswers({});
    setIndex(0);
    setDraftRestored(false);
    setError(null);
    setShowLoginPrompt(false);
  }

  function restoreFromDraft(draft: RiasecDraft) {
    const byId = new Map(RIASEC_QUESTIONS.map((qq) => [qq.id, qq]));
    const restored = draft.orderedQuestionIds
      .map((id) => byId.get(id))
      .filter((q): q is Question => Boolean(q));
    if (restored.length !== RIASEC_QUESTIONS.length) return false;
    setOrderedQuestions(restored);
    setAnswers(draft.answers ?? {});
    const safeIndex =
      typeof draft.index === "number" && Number.isFinite(draft.index)
        ? Math.max(0, Math.min(draft.index, restored.length - 1))
        : 0;
    setIndex(safeIndex);
    setDraftRestored(true);
    return true;
  }

  useEffect(() => {
    if (draftLoaded) return;
    setDraftLoaded(true);
    try {
      const raw = localStorage.getItem(DRAFT_RIASEC_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as RiasecDraft;
      if (!parsed || parsed.version !== 1) return;
      if (
        typeof parsed.updatedAtMs !== "number" ||
        Date.now() - parsed.updatedAtMs > DRAFT_MAX_AGE_MS
      ) {
        clearDraft();
        return;
      }
      restoreFromDraft(parsed);
    } catch {
      // ignore
    }
  }, [draftLoaded]);

  useEffect(() => {
    // autosave draft untuk user yang belum login juga (dan tetap oke untuk yang login)
    // tunggu draft initial load supaya gak langsung overwrite
    if (!draftLoaded) return;
    try {
      const draft: RiasecDraft = {
        version: 1,
        updatedAtMs: Date.now(),
        index,
        answers,
        orderedQuestionIds: orderedQuestions.map((qq) => qq.id),
      };
      localStorage.setItem(DRAFT_RIASEC_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [answers, index, orderedQuestions, draftLoaded]);

  function selectOption(optionId: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));
    if (index < orderedQuestions.length - 1) {
      setIndex((i) => Math.min(i + 1, orderedQuestions.length - 1));
    }
  }

  function goPrev() {
    if (index > 0) setIndex((i) => i - 1);
  }

  async function saveResult(nextAnswers: Record<number, string>) {
    if (!user) return;
    setSaving(true);
    try {
      const scores = scoreRiasecAnswers(nextAnswers);
      const top = topRiasecCategories(scores, 3);
      await saveRiasecTestResult(user.uid, {
        scores,
        topCodes: top.map((t) => t.code),
        answers: nextAnswers,
      });
      sessionStorage.removeItem(PENDING_RIASEC_KEY);
      clearDraft();
      router.push("/hasil");
    } catch {
      setError("Gagal menyimpan hasil. Periksa koneksi dan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function submitAll() {
    setError(null);
    setShowLoginPrompt(false);
    const check = validateAllQuestionsAnswered(answers);
    if (!check.ok) {
      setError("Jawab semua soal terlebih dahulu.");
      const firstMissing = check.missing[0];
      const idx = orderedQuestions.findIndex((x) => x.id === firstMissing);
      if (idx >= 0) setIndex(idx);
      return;
    }
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    await saveResult(answers);
  }

  function continueWithoutSaving() {
    setShowLoginPrompt(false);
    setError(null);
  }

  function saveWithLogin() {
    sessionStorage.setItem(PENDING_RIASEC_KEY, JSON.stringify(answers));
    // backup lebih tahan lama (kalau tab ke-close sebelum login)
    // draft juga memuat urutan soal + index
    // (kalau gagal set, biarin aja)
    try {
      const draft: RiasecDraft = {
        version: 1,
        updatedAtMs: Date.now(),
        index,
        answers,
        orderedQuestionIds: orderedQuestions.map((qq) => qq.id),
      };
      localStorage.setItem(DRAFT_RIASEC_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
    router.push("/auth?mode=register&next=/tes-minat?autosave=1");
  }

  useEffect(() => {
    if (autosaveHandled || !user) return;
    if (searchParams.get("autosave") !== "1") return;

    const pendingRaw = sessionStorage.getItem(PENDING_RIASEC_KEY);
    if (!pendingRaw) return;
    setAutosaveHandled(true);

    try {
      const pendingAnswers = JSON.parse(pendingRaw) as Record<number, string>;
      setAnswers(pendingAnswers);
      void saveResult(pendingAnswers);
    } catch {
      sessionStorage.removeItem(PENDING_RIASEC_KEY);
    }
  }, [autosaveHandled, searchParams, user, saveResult]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          ← Kembali
        </Link>
        <div className="flex items-center gap-3">
          {(draftRestored || index > 0 || Object.keys(answers).length > 0) && (
            <button
              type="button"
              onClick={resetFromStart}
              className="text-xs font-semibold text-stone-600 underline-offset-4 hover:underline"
            >
              Reset jawaban
            </button>
          )}
          <span className="text-xs text-stone-500">
            Soal {index + 1} / {orderedQuestions.length}
          </span>
        </div>
      </div>

      <div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
          <div
            className="h-full rounded-full bg-teal-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
        <h1 className="text-lg font-semibold text-stone-900 leading-snug">
          {q.prompt}
        </h1>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {q.options.map((opt) => {
            const selected = answers[q.id] === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => selectOption(opt.id)}
                className={`w-full rounded-xl border p-3 text-center transition ${
                  selected
                    ? "border-teal-600 bg-teal-50"
                    : "border-stone-200 bg-stone-50 hover:border-stone-300"
                }`}
              >
                <div className="mx-auto flex w-fit flex-col items-center">
                  <Image
                    src={ANSWER_IMAGE_BY_VALUE[opt.value] ?? "/Netral.png"}
                    alt={opt.text}
                    width={72}
                    height={72}
                    className="h-[72px] w-[72px] object-contain"
                  />
                  <span className="mt-2 text-xs font-medium text-stone-800">
                    {opt.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={index === 0}
          className="h-11 rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 disabled:opacity-40"
        >
          Sebelumnya
        </button>
        {index === orderedQuestions.length - 1 && Boolean(answers[q.id]) && (
          <button
            type="button"
            onClick={submitAll}
            disabled={saving}
            className="h-11 rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Selesai & lihat hasil"}
          </button>
        )}
      </div>

      {showLoginPrompt && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-stone-900/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/70 bg-white p-5 shadow-xl">
            <h2 className="text-lg font-semibold text-stone-900">
              Simpan progresmu?
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600">
              Login dulu supaya hasil tes RIASEC tersimpan dan bisa kamu lanjutkan
              ke roadmap karier kapan saja.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={continueWithoutSaving}
                className="h-10 rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Nanti saja
              </button>
              <button
                type="button"
                onClick={saveWithLogin}
                className="h-10 rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
              >
                Oke, login dulu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
