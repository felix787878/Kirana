"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { RIASEC_QUESTIONS } from "@/lib/questions";
import {
  scoreRiasecAnswers,
  topRiasecCategories,
  validateAllQuestionsAnswered,
} from "@/lib/scoring";
import { saveRiasecTestResult } from "@/lib/firestore";
import { useAuth } from "@/components/AuthProvider";

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
  const orderedQuestions = useMemo(() => shuffleQuestions(), []);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const q = orderedQuestions[index];
  const progress = useMemo(
    () => Math.round(((index + 1) / orderedQuestions.length) * 100),
    [index, orderedQuestions.length]
  );

  function selectOption(optionId: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));
    if (index < orderedQuestions.length - 1) {
      setIndex((i) => Math.min(i + 1, orderedQuestions.length - 1));
    }
  }

  function goPrev() {
    if (index > 0) setIndex((i) => i - 1);
  }

  async function submitAll() {
    setError(null);
    const check = validateAllQuestionsAnswered(answers);
    if (!check.ok) {
      setError("Jawab semua soal terlebih dahulu.");
      const firstMissing = check.missing[0];
      const idx = orderedQuestions.findIndex((x) => x.id === firstMissing);
      if (idx >= 0) setIndex(idx);
      return;
    }
    if (!user) return;
    setSaving(true);
    try {
      const scores = scoreRiasecAnswers(answers);
      const top = topRiasecCategories(scores, 3);
      await saveRiasecTestResult(user.uid, {
        scores,
        topCodes: top.map((t) => t.code),
        answers,
      });
      router.push("/hasil");
    } catch {
      setError("Gagal menyimpan hasil. Periksa koneksi dan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-teal-700 hover:text-teal-800"
        >
          ← Kembali
        </Link>
        <span className="text-xs text-stone-500">
          Soal {index + 1} / {orderedQuestions.length}
        </span>
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
        {index === orderedQuestions.length - 1 && (
          <button
            type="button"
            onClick={submitAll}
            disabled={saving || !answers[q.id]}
            className="h-11 rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Selesai & lihat hasil"}
          </button>
        )}
      </div>
    </div>
  );
}
