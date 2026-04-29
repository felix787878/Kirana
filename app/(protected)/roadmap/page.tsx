"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { subscribeUserDocument, saveNarrativeSelf } from "@/lib/firestore";
import { RIASEC_LABELS_ID } from "@/lib/scoring";
import type { RiasecCode } from "@/lib/questions";
import { useAuth } from "@/components/AuthProvider";
import { RoadmapMarkdown } from "@/components/RoadmapMarkdown";
import { LoaderFive } from "@/components/ui/loader";
import type { UserDocument, NarrativeSelf } from "@/lib/user-document";

const CODES: RiasecCode[] = ["R", "I", "A", "S", "E", "C"];

const DEFAULT_MANUAL_PICKS: [RiasecCode, RiasecCode, RiasecCode] = [
  "R",
  "I",
  "A",
];

const AGE_MIN = 8;
const AGE_MAX = 28;
const NARRATIVE_MAX_CHARS = 500;

const EMPTY_NARRATIVE: NarrativeSelf = {
  hiddenTrait: "",
  flowActivity: "",
  helpTarget: "",
};

const NARRATIVE_FIELDS: {
  key: keyof NarrativeSelf;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "hiddenTrait",
    label: "Hal yang orang lain tidak tahu tentang kamu",
    placeholder:
      "Contoh: Saya kalau tugas udah selesai, selalu greget banget pengen bantu temen yang belom selesai. Bahkan kadang gak bisa tidur kalau tahu ada temen yang kesusahan.",
  },
  {
    key: "flowActivity",
    label: "Aktivitas yang bikin kamu lupa waktu",
    placeholder:
      "Contoh: Gambar-gambar karakter anime di buku tulis. Kadang bikin cerita pendek juga.",
  },
  {
    key: "helpTarget",
    label: "Siapa yang ingin kamu bantu",
    placeholder:
      "Contoh: Adik-adik yang baru masuk panti, supaya mereka gak ngerasa sendirian.",
  },
];

function distinctTriplet(p: [RiasecCode, RiasecCode, RiasecCode]): boolean {
  return new Set(p).size === 3;
}

export default function RoadmapPage() {
  const { user } = useAuth();
  const [doc, setDoc] = useState<UserDocument | null | undefined>(undefined);
  const modeInitialized = useRef(false);
  const [sourceMode, setSourceMode] = useState<"test" | "manual">("manual");
  const [manualPicks, setManualPicks] =
    useState<[RiasecCode, RiasecCode, RiasecCode]>(DEFAULT_MANUAL_PICKS);
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ageYears, setAgeYears] = useState("");
  const agePrefilledFromDoc = useRef(false);
  const [narrative, setNarrative] = useState<NarrativeSelf>(EMPTY_NARRATIVE);
  const narrativePrefilledFromDoc = useRef(false);
  const [narrativeOpen, setNarrativeOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserDocument(user.uid, setDoc);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (doc === undefined) return;
    if (modeInitialized.current) return;
    modeInitialized.current = true;
    if (doc?.topRiasecCodes?.length) setSourceMode("test");
    else setSourceMode("manual");
  }, [doc]);

  useEffect(() => {
    if (doc === undefined || agePrefilledFromDoc.current) return;
    const a = doc?.age;
    if (typeof a === "number" && Number.isFinite(a)) {
      const r = Math.round(a);
      if (r >= AGE_MIN && r <= AGE_MAX) {
        setAgeYears(String(r));
        agePrefilledFromDoc.current = true;
      }
    }
  }, [doc]);

  // Prefill narasi dari Firestore
  useEffect(() => {
    if (doc === undefined || narrativePrefilledFromDoc.current) return;
    const n = doc?.narrativeSelf;
    if (n && typeof n === "object") {
      const filled = {
        hiddenTrait: n.hiddenTrait ?? "",
        flowActivity: n.flowActivity ?? "",
        helpTarget: n.helpTarget ?? "",
      };
      const hasContent = Object.values(filled).some((v) => v.trim());
      if (hasContent) {
        setNarrative(filled);
        setNarrativeOpen(true);
      }
      narrativePrefilledFromDoc.current = true;
    }
  }, [doc]);

  const updateNarrativeField = useCallback(
    (key: keyof NarrativeSelf, value: string) => {
      setNarrative((prev) => ({
        ...prev,
        [key]: value.slice(0, NARRATIVE_MAX_CHARS),
      }));
    },
    []
  );

  const hasTestResult = useMemo(
    () => Boolean(doc?.topRiasecCodes?.length),
    [doc]
  );

  const savedTopThree = useMemo(() => {
    if (!doc?.topRiasecCodes?.length) return null;
    const list = (doc.topRiasecCodes.filter(Boolean) as RiasecCode[]).slice(
      0,
      3
    );
    return list.length ? list : null;
  }, [doc]);

  function setManualPick(index: 0 | 1 | 2, code: RiasecCode) {
    setManualPicks((prev) => {
      const next = [...prev] as [RiasecCode, RiasecCode, RiasecCode];
      next[index] = code;
      return next;
    });
  }

  function switchToManual() {
    setSourceMode("manual");
    if (savedTopThree?.length) {
      const a = savedTopThree[0] ?? "R";
      const b = savedTopThree[1] ?? "I";
      const c = savedTopThree[2] ?? "A";
      setManualPicks([a, b, c]);
    }
  }

  function switchToTest() {
    if (hasTestResult && savedTopThree?.length) setSourceMode("test");
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOutput(null);

    const useTest =
      sourceMode === "test" && hasTestResult && Boolean(savedTopThree?.length);

    if (!useTest && !distinctTriplet(manualPicks)) {
      setError("Pilih tiga kategori yang berbeda (tidak boleh ada duplikat).");
      return;
    }

    const ageNum = Number.parseInt(ageYears.trim(), 10);
    if (
      !Number.isFinite(ageNum) ||
      ageNum < AGE_MIN ||
      ageNum > AGE_MAX
    ) {
      setError(
        `Isi usia dalam tahun (${AGE_MIN}–${AGE_MAX}) agar saran disesuaikan dengan jenjang sekolahmu.`
      );
      return;
    }

    if (!user) return;

    const topCategories = useTest
      ? (savedTopThree as RiasecCode[])
      : ([...manualPicks] as RiasecCode[]);

    // Simpan narasi ke Firestore (fire-and-forget)
    const hasNarrative = Object.values(narrative).some((v) => v.trim());
    if (hasNarrative) {
      saveNarrativeSelf(user.uid, narrative).catch(() => {});
    }

    setLoading(true);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: ageNum,
          topCategories,
          ...(hasNarrative ? { narrativeSelf: narrative } : {}),
        }),
      });
      const data = (await res.json()) as {
        text?: string;
        error?: string;
        debug?: string;
      };
      if (!res.ok) {
        const hint =
          process.env.NODE_ENV === "development" && data.debug
            ? ` ${data.debug}`
            : "";
        setError((data.error ?? "Permintaan gagal.") + hint);
        return;
      }
      setOutput(data.text ?? "");
    } catch {
      setError("Tidak dapat menghubungi server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (doc === undefined) {
    return (
      <div className="space-y-6 py-4">
        <LoaderFive text="Memuat data..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Peta jalan karier
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-stone-600">
          Isi usia dan pilih sumber kategori RIASEC, lalu minta saran langkah
          belajar. Hasil dibuat oleh AI dan wajib kamu diskusikan dengan pihak
          yang berwenang.
        </p>
      </div>

      <form
        onSubmit={handleGenerate}
        className="space-y-5 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="space-y-2">
          <label
            htmlFor="roadmap-age"
            className="text-sm font-medium text-stone-800"
          >
            Berapa usiamu? (tahun)
          </label>
          <input
            id="roadmap-age"
            name="age"
            type="number"
            inputMode="numeric"
            min={AGE_MIN}
            max={AGE_MAX}
            required
            placeholder={`Contoh: 16 (${AGE_MIN}–${AGE_MAX})`}
            value={ageYears}
            onChange={(e) => setAgeYears(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-600/25"
          />
          <p className="text-xs leading-relaxed text-stone-600">
            Usia dipakai agar diagram jenjang sekolah dan contoh langkah sesuai
            situasimu. Kalau sudah pernah diisi di profil dan tersimpan, angka
            ini bisa terisi otomatis — silakan ubah bila perlu.
          </p>
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-stone-800">
            Sumber kategori RIASEC
          </legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              disabled={!hasTestResult || !savedTopThree?.length}
              onClick={switchToTest}
              className={[
                "rounded-xl border px-4 py-3 text-left text-sm transition",
                sourceMode === "test" && hasTestResult && savedTopThree?.length
                  ? "border-teal-600 bg-teal-50 font-semibold text-teal-950 ring-2 ring-teal-600/20"
                  : "border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300",
                (!hasTestResult || !savedTopThree?.length) &&
                  "cursor-not-allowed opacity-50",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="block font-semibold">Hasil tes minat</span>
              <span className="mt-0.5 block text-xs font-normal text-stone-600">
                Pakai tiga tipe tertinggi dari tes terakhir
              </span>
            </button>
            <button
              type="button"
              onClick={switchToManual}
              className={[
                "rounded-xl border px-4 py-3 text-left text-sm transition",
                sourceMode === "manual"
                  ? "border-teal-600 bg-teal-50 font-semibold text-teal-950 ring-2 ring-teal-600/20"
                  : "border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300",
              ].join(" ")}
            >
              <span className="block font-semibold">Pilih manual</span>
              <span className="mt-0.5 block text-xs font-normal text-stone-600">
                Atur sendiri tiga kategori untuk dicoba
              </span>
            </button>
          </div>
          {!hasTestResult && (
            <p className="text-xs text-amber-800">
              Belum ada hasil tes — opsi &quot;Hasil tes minat&quot; aktif setelah
              kamu menyelesaikan tes di menu Tes minat.
            </p>
          )}
        </fieldset>

        {sourceMode === "test" && hasTestResult && savedTopThree?.length ? (
          <div className="space-y-3 rounded-xl border border-teal-100 bg-teal-50/60 p-4">
            <p className="text-sm font-semibold text-teal-950">
              Kategori dari tes minat
            </p>
            <ul className="flex flex-wrap gap-2">
              {savedTopThree.map((code, i) => (
                <li
                  key={`${code}-${i}`}
                  className="inline-flex items-center rounded-full border border-teal-200/80 bg-white px-3 py-1 text-xs font-semibold text-teal-900"
                >
                  {i + 1}. {code} — {RIASEC_LABELS_ID[code]}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-stone-800">
                Tiga kategori (manual)
              </p>
              <p className="mt-1 text-xs text-stone-600">
                Pilih tiga tipe yang berbeda — cocok untuk mencoba kombinasi lain.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {([0, 1, 2] as const).map((i) => (
                <div key={i} className="space-y-1.5">
                  <label
                    htmlFor={`rm-pick-${i}`}
                    className="text-xs font-medium text-stone-600"
                  >
                    Pilihan {i + 1}
                  </label>
                  <select
                    id={`rm-pick-${i}`}
                    value={manualPicks[i]}
                    onChange={(e) =>
                      setManualPick(i, e.target.value as RiasecCode)
                    }
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-600/25"
                  >
                    {CODES.map((c) => (
                      <option key={c} value={c}>
                        {c} — {RIASEC_LABELS_ID[c]}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- Narasi Diri (opsional) --- */}
        <div className="rounded-xl border border-dashed border-amber-300/80 bg-amber-50/40 transition-all">
          <button
            type="button"
            onClick={() => setNarrativeOpen((o) => !o)}
            className="flex w-full items-center justify-between gap-2 px-4 py-3.5 text-left"
            aria-expanded={narrativeOpen}
          >
            <span className="flex items-center gap-2">
              <span className="text-base" aria-hidden>✍️</span>
              <span className="text-sm font-semibold text-amber-900">
                Ceritakan tentang dirimu
              </span>
              <span className="rounded-full bg-amber-200/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
                Opsional
              </span>
            </span>
            <svg
              className={[
                "h-4 w-4 shrink-0 text-amber-600 transition-transform duration-200",
                narrativeOpen ? "rotate-180" : "",
              ].join(" ")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {narrativeOpen && (
            <div className="space-y-4 px-4 pb-4">
              <p className="text-xs leading-relaxed text-amber-800/80">
                Narasi ini membantu AI memahami sisi personalmu yang tidak
                tertangkap dari skor tes. Isi sebisa mungkin — tidak wajib semua.
              </p>
              {NARRATIVE_FIELDS.map(({ key, label, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label
                    htmlFor={`narr-${key}`}
                    className="text-xs font-semibold text-amber-900"
                  >
                    {label}
                  </label>
                  <textarea
                    id={`narr-${key}`}
                    value={narrative[key] ?? ""}
                    onChange={(e) => updateNarrativeField(key, e.target.value)}
                    maxLength={NARRATIVE_MAX_CHARS}
                    rows={3}
                    placeholder={placeholder}
                    className="w-full resize-none rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20"
                  />
                  <p className="text-right text-[10px] tabular-nums text-stone-400">
                    {(narrative[key] ?? "").length}/{NARRATIVE_MAX_CHARS}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-teal-700 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:opacity-60"
        >
          {loading ? "Menghasilkan..." : "Minta saran langkah belajar"}
        </button>
      </form>

      {output && (
        <section className="rounded-2xl border border-teal-100/80 bg-gradient-to-b from-white to-stone-50/90 p-5 shadow-sm ring-1 ring-stone-100 sm:p-6">
          <h2 className="text-lg font-semibold tracking-tight text-stone-900">
            Saran langkah belajar
          </h2>
          <p className="mt-1.5 text-xs leading-relaxed text-stone-500">
            Ini hanya usulan dari AI. Bahas dulu dengan pembina, guru, atau
            pihak yang berwenang sebelum memutuskan langkah penting.
          </p>
          <div className="mt-5 rounded-xl border border-stone-100 bg-white/80 px-4 py-5 shadow-inner sm:px-5">
            <RoadmapMarkdown content={output} />
          </div>
        </section>
      )}

      <Link
        href="/dashboard"
        className="block text-center text-sm font-medium text-teal-800 underline-offset-4 hover:underline"
      >
        Kembali ke menu
      </Link>
    </div>
  );
}
