"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { saveCvData, subscribeUserDocument } from "@/lib/firestore";
import { useAuth } from "@/components/AuthProvider";
import type { UserCvData } from "@/lib/user-document";
import { CVPdfDocument } from "@/components/CVPdfDocument";

const PDFDownloadLink = dynamic(
  () =>
    import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);

const emptyCv: UserCvData = {
  fullName: "",
  age: "",
  school: "",
  hobbies: "",
  organization: "",
  contact: "",
};

export default function CvMakerPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<UserCvData>(emptyCv);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready">("loading");

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

  const fileName = useMemo(() => {
    const base = form.fullName.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    return base ? `CV-${base}.pdf` : "CV-Kirana.pdf";
  }, [form.fullName]);

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
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-stone-900">Pembuat CV</h1>
        <p className="text-sm text-stone-600">
          Lengkapi kolom, simpan ke akun, lalu unduh PDF satu halaman.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
          {(
            [
              ["fullName", "Nama lengkap"],
              ["age", "Usia"],
              ["school", "Sekolah / pendidikan"],
              ["hobbies", "Hobi & minat"],
              ["organization", "Pengalaman organisasi"],
              ["contact", "Kontak (email atau WhatsApp)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1">
              <label
                htmlFor={key}
                className="text-xs font-medium text-stone-700"
              >
                {label}
              </label>
              {key === "organization" || key === "hobbies" ? (
                <textarea
                  id={key}
                  rows={3}
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-600 focus:ring-2"
                />
              ) : (
                <input
                  id={key}
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none ring-teal-600 focus:ring-2"
                />
              )}
            </div>
          ))}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-11 flex-1 rounded-xl border border-stone-200 bg-white text-sm font-semibold text-stone-800 hover:bg-stone-50 disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan ke akun"}
            </button>
          </div>
          {savedMsg && (
            <p className="text-xs text-stone-600" role="status">
              {savedMsg}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-stone-900">Pratinjau</h2>
          <div className="min-h-[420px] rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <p className="text-xl font-bold text-teal-800">
              {form.fullName || "Nama kamu"}
            </p>
            <p className="mt-1 text-sm text-stone-600">
              {[form.age && `Usia: ${form.age}`, form.contact]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <div className="mt-4 space-y-3 text-sm text-stone-800">
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">
                  Sekolah
                </p>
                <p className="whitespace-pre-wrap">{form.school || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">
                  Hobi
                </p>
                <p className="whitespace-pre-wrap">{form.hobbies || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-stone-500">
                  Organisasi
                </p>
                <p className="whitespace-pre-wrap">
                  {form.organization || "—"}
                </p>
              </div>
            </div>
          </div>

          <PDFDownloadLink
            document={<CVPdfDocument data={form} />}
            fileName={fileName}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-teal-700 text-sm font-semibold text-white hover:bg-teal-800"
          >
            {({ loading }) => (loading ? "Menyiapkan PDF..." : "Unduh PDF")}
          </PDFDownloadLink>
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
