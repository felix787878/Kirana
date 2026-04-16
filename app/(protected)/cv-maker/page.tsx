"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { saveCvData, subscribeUserDocument } from "@/lib/firestore";
import { useAuth } from "@/components/AuthProvider";
import type { UserCvData } from "@/lib/user-document";
import { CVPdfDocument } from "@/components/CVPdfDocument";

const emptyCv: UserCvData = {
  fullName: "",
  age: "",
  school: "",
  hobbies: "",
  organization: "",
  contact: "",
};

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);

const requiredFields: Array<keyof UserCvData> = ["fullName", "school", "contact"];

export default function CvMakerPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<UserCvData>(emptyCv);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready">("loading");
  const [showOptional, setShowOptional] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserDocument(user.uid, (d) => {
      if (d?.cv) setForm({ ...emptyCv, ...d.cv });
      setLoadState("ready");
    });
    return () => unsub();
  }, [user]);

  function update<K extends keyof UserCvData>(key: K, value: UserCvData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setSavedMsg(null);
  }

  const pdfFileName = useMemo(() => {
    const base = form.fullName.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    return base ? `CV-${base}.pdf` : "CV-Kirana.pdf";
  }, [form.fullName]);
  const completion = useMemo(() => {
    const completeCount = requiredFields.filter((field) => form[field].trim()).length;
    return Math.round((completeCount / requiredFields.length) * 100);
  }, [form]);
  const isReadyToDownload = completion === 100;

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSavedMsg(null);
    try {
      await saveCvData(user.uid, form);
      setSavedMsg("Disimpan ke akun.");
    } catch {
      setSavedMsg("Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  if (loadState === "loading") {
    return (
      <div className="py-12 text-center text-stone-600">Memuat CV...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          CV Pelajar
        </p>
        <h1 className="mt-1 text-2xl font-bold">Buat CV profesional dalam beberapa menit</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Form dibuat singkat untuk siswa SMP/SMA. Isi data inti, simpan, lalu unduh CV
          PDF satu halaman.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Form CV</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                Kelengkapan {completion}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-teal-600 transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">
              Wajib diisi: nama lengkap, sekolah/kelas, dan kontak.
            </p>
          </div>

          <h3 className="pt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Data inti
          </h3>
          {(["fullName", "school", "contact"] as const).map((key) => (
            <div key={key} className="space-y-1">
              <label htmlFor={key} className="text-xs font-medium text-slate-700">
                {key === "fullName"
                  ? "Nama lengkap *"
                  : key === "school"
                    ? "Sekolah / kelas *"
                    : "Kontak (email / WhatsApp) *"}
              </label>
              <input
                id={key}
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                placeholder={
                  key === "fullName"
                    ? "Contoh: Rani Putri"
                    : key === "school"
                      ? "Contoh: SMPN 3 Bandung, Kelas 9"
                      : "Contoh: rani@email.com / 08xxxxxxxxxx"
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-black outline-none ring-teal-600 focus:ring-2"
              />
            </div>
          ))}

          <div className="space-y-1">
            <label htmlFor="age" className="text-xs font-medium text-slate-700">
              Usia (opsional)
            </label>
            <input
              id="age"
              value={form.age}
              onChange={(e) => update("age", e.target.value)}
              placeholder="Contoh: 15"
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-black outline-none ring-teal-600 focus:ring-2"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowOptional((v) => !v)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            {showOptional ? "Sembunyikan input tambahan" : "Tampilkan input tambahan (opsional)"}
          </button>

          {showOptional && (
            <>
              <div className="space-y-1">
                <label htmlFor="hobbies" className="text-xs font-medium text-slate-700">
                  Hobi & minat
                </label>
                <textarea
                  id="hobbies"
                  rows={3}
                  value={form.hobbies}
                  onChange={(e) => update("hobbies", e.target.value)}
                  placeholder="Contoh: desain poster, futsal, coding dasar, fotografi"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-black outline-none ring-teal-600 focus:ring-2"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="organization" className="text-xs font-medium text-slate-700">
                  Pengalaman organisasi / kegiatan
                </label>
                <textarea
                  id="organization"
                  rows={3}
                  value={form.organization}
                  onChange={(e) => update("organization", e.target.value)}
                  placeholder="Contoh: anggota OSIS, panitia class meeting, volunteer acara sekolah"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-black outline-none ring-teal-600 focus:ring-2"
                />
              </div>
            </>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan ke akun"}
            </button>
          </div>
          {savedMsg && (
            <p className="text-xs text-slate-600" role="status">
              {savedMsg}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-slate-900">Pratinjau CV</h2>
          <div className="min-h-[420px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-2xl font-bold tracking-tight text-slate-900">
              {form.fullName || "Nama Lengkap"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {[form.school, form.age && `Usia ${form.age}`, form.contact]
                .filter(Boolean)
                .join(" | ")}
            </p>
            <div className="my-4 h-px bg-slate-200" />
            <div className="mt-4 space-y-4 text-sm text-slate-800">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Profil singkat
                </p>
                <p>
                  Pelajar yang aktif belajar dan siap mengembangkan diri melalui kegiatan
                  sekolah, organisasi, dan proyek sederhana.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Minat
                </p>
                <p className="whitespace-pre-wrap">{form.hobbies || "Belum diisi"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pengalaman
                </p>
                <p className="whitespace-pre-wrap">{form.organization || "Belum diisi"}</p>
              </div>
            </div>
          </div>
          {isReadyToDownload ? (
            <PDFDownloadLink
              document={<CVPdfDocument data={form} />}
              fileName={pdfFileName}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
            >
              {({ loading }) => (loading ? "Menyiapkan PDF..." : "Unduh CV (PDF)")}
            </PDFDownloadLink>
          ) : (
            <div className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-slate-400 text-sm font-semibold text-white">
              Lengkapi data wajib untuk unduh PDF
            </div>
          )}
          <p className="text-xs text-slate-500">
            Tidak perlu buka web eksternal. Cukup isi form dan unduh PDF langsung.
          </p>
        </div>
      </div>

      <Link
        href="/dashboard"
        className="block text-center text-sm text-teal-700 underline"
      >
        Kembali ke menu
      </Link>
    </div>
  );
}



