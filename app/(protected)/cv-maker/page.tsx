"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { saveCvData, subscribeUserDocument } from "@/lib/firestore";
import { useAuth } from "@/components/AuthProvider";
import { normalizeUserCv, sanitizeCvDocument, type UserCvData } from "@/lib/user-document";
import { CVPdfDocument } from "@/components/CVPdfDocument";
import { CvPaperPreview } from "@/components/cv-maker/CvPaperPreview";
import { CvRichForm } from "@/components/cv-maker/CvRichForm";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);

type MobileCvTab = "edit" | "preview";

export default function CvMakerPage() {
  const { user } = useAuth();
  const [form, setForm] = useState<UserCvData | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready">("loading");
  const [mobileTab, setMobileTab] = useState<MobileCvTab>("edit");

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeUserDocument(user.uid, (d) => {
      setForm(normalizeUserCv(d?.cv));
      setLoadState("ready");
    });
    return () => unsub();
  }, [user]);

  const pdfFileName = useMemo(() => {
    const base = (form?.fullName ?? "").trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    return base ? `CV-${base}.pdf` : "CV-Kirana.pdf";
  }, [form?.fullName]);

  const isReadyToDownload = Boolean(form?.fullName.trim() && form?.email.trim());

  async function handleSave() {
    if (!user || !form) return;
    setSaving(true);
    setSavedMsg(null);
    try {
      await saveCvData(user.uid, sanitizeCvDocument(form));
      setSavedMsg("Disimpan ke akun.");
    } catch {
      setSavedMsg("Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  if (loadState === "loading" || !form) {
    return <div className="py-12 text-center text-stone-600">Memuat CV...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">CV Kirana</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan ke akun"}
          </button>
          {isReadyToDownload ? (
            <PDFDownloadLink
              document={<CVPdfDocument data={sanitizeCvDocument(form)} />}
              fileName={pdfFileName}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
            >
              {({ loading }) => (loading ? "Menyiapkan PDF..." : "Unduh PDF")}
            </PDFDownloadLink>
          ) : (
            <span className="inline-flex h-10 items-center rounded-xl bg-slate-300 px-4 text-sm font-semibold text-white">
              Isi nama & email untuk unduh
            </span>
          )}
        </div>
      </div>
      {savedMsg ? (
        <p className="text-xs text-slate-600" role="status">
          {savedMsg}
        </p>
      ) : null}

      <div
        className="xl:hidden sticky top-14 z-[15] -mx-1 mb-2 flex rounded-xl border border-slate-200/90 bg-white/95 p-1 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80"
        role="tablist"
        aria-label="Mode CV"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "edit"}
          onClick={() => setMobileTab("edit")}
          className={
            mobileTab === "edit"
              ? "flex-1 rounded-lg bg-white py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200/80"
              : "flex-1 rounded-lg py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          }
        >
          Ubah
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "preview"}
          onClick={() => setMobileTab("preview")}
          className={
            mobileTab === "preview"
              ? "flex-1 rounded-lg bg-white py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200/80"
              : "flex-1 rounded-lg py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          }
        >
          Pratinjau
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.45fr)] xl:items-start">
        <div className={mobileTab === "preview" ? "hidden xl:block" : "block"}>
          <CvRichForm data={form} onChange={setForm} />
        </div>
        <div className={mobileTab === "edit" ? "hidden xl:block" : "block"}>
          <CvPaperPreview data={form} />
        </div>
      </div>

      <Link href="/dashboard" className="block text-center text-sm text-teal-700 underline">
        Kembali ke menu
      </Link>
    </div>
  );
}
