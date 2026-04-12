"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { mergeUserDocument, subscribeUserDocument } from "@/lib/firestore";
import { RIASEC_LABELS_ID } from "@/lib/scoring";
import type { RiasecCode } from "@/lib/questions";
import { useAuth } from "@/components/AuthProvider";
import type { UserDocument } from "@/lib/user-document";

const CODES: RiasecCode[] = ["R", "I", "A", "S", "E", "C"];

export default function RoadmapPage() {
  const { user } = useAuth();
  const [doc, setDoc] = useState<UserDocument | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [topCategory, setTopCategory] = useState<RiasecCode>("S");
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserDocument(user.uid, setDoc);
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!doc) return;
    if (doc.name) setName(doc.name);
    if (doc.age != null && doc.age !== undefined) setAge(String(doc.age));
    const first = doc.topRiasecCodes?.[0];
    if (first && CODES.includes(first)) setTopCategory(first);
  }, [doc]);

  const canUseSavedTest = useMemo(
    () => Boolean(doc?.topRiasecCodes?.[0]),
    [doc]
  );

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOutput(null);
    const ageNum = Number(age);
    if (!name.trim()) {
      setError("Isi nama panggilanmu.");
      return;
    }
    if (!Number.isFinite(ageNum) || ageNum < 12 || ageNum > 18) {
      setError("Usia harus antara 12 dan 18 tahun.");
      return;
    }
    if (!user) return;

    setLoading(true);
    try {
      await mergeUserDocument(user.uid, {
        name: name.trim(),
        age: ageNum,
      });

      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          age: ageNum,
          topCategory,
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
      <div className="py-12 text-center text-stone-600">Memuat data...</div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-stone-900">Peta jalan karier</h1>
        <p className="text-sm text-stone-600">
          Isi data singkat, lalu minta saran langkah belajar dan karier. Hasil
          dibuat oleh AI dan wajib kamu diskusikan dengan pembimbing dewasa.
        </p>
      </div>

      {!canUseSavedTest && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          Kamu belum punya hasil tes. Kategori bisa dipilih manual; setelah tes,
          nilai teratas otomatis terisi di profil.
        </p>
      )}

      <form
        onSubmit={handleGenerate}
        className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="space-y-1">
          <label htmlFor="rm-name" className="text-xs font-medium text-stone-700">
            Nama panggilan
          </label>
          <input
            id="rm-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-black outline-none ring-teal-600 focus:ring-2"
            maxLength={80}
            autoComplete="name"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="rm-age" className="text-xs font-medium text-stone-700">
            Usia (12–18)
          </label>
          <input
            id="rm-age"
            type="number"
            min={12}
            max={18}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-black outline-none ring-teal-600 focus:ring-2"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="rm-code"
            className="text-xs font-medium text-stone-700"
          >
            Kategori RIASEC utama
          </label>
          <select
            id="rm-code"
            value={topCategory}
            onChange={(e) => setTopCategory(e.target.value as RiasecCode)}
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-black outline-none ring-teal-600 focus:ring-2"
          >
            {CODES.map((c) => (
              <option key={c} value={c}>
                {c} — {RIASEC_LABELS_ID[c]}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
        >
          {loading ? "Menghasilkan..." : "Buat peta jalan"}
        </button>
      </form>

      {output && (
        <section className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-sm font-semibold text-gray-900">
            Hasil untuk {name.trim()}
          </h2>
          <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-900">
            {output}
          </div>
        </section>
      )}

      <Link
        href="/dashboard"
        className="block text-center text-sm text-teal-700 underline"
      >
        Kembali ke menu
      </Link>
    </div>
  );
}

