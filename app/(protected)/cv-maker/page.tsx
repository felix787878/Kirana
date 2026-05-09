"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveCvData, subscribeUserDocument } from "@/lib/firestore";
import { useAuth } from "@/components/AuthProvider";
import { normalizeUserCv, sanitizeCvDocument, type UserCvData } from "@/lib/user-document";
import { CVPdfDocument } from "@/components/CVPdfDocument";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);
const CvPaperPreview = dynamic(
  () => import("@/components/cv-maker/CvPaperPreview").then((m) => m.CvPaperPreview),
  {
    ssr: false,
    loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Menyiapkan pratinjau...</div>,
  }
);
const CvRichForm = dynamic(
  () => import("@/components/cv-maker/CvRichForm").then((m) => m.CvRichForm),
  {
    ssr: false,
    loading: () => <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Menyiapkan form CV...</div>,
  }
);

type MobileCvTab = "edit" | "preview";

const CV_DRAFT_KEY = "kirana_cv_draft_v1";
const CV_DRAFT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30; // 30 hari

type CvDraft = {
  version: 1;
  updatedAtMs: number;
  cv: UserCvData;
};

export default function CvMakerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<UserCvData | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready">("loading");
  const [mobileTab, setMobileTab] = useState<MobileCvTab>("edit");
  const loadedOnce = useRef(false);
  const autosaveTimer = useRef<number | null>(null);

  function clearCvDraft() {
    try {
      localStorage.removeItem(CV_DRAFT_KEY);
    } catch {
      // ignore
    }
  }

  function readCvDraft(): CvDraft | null {
    try {
      const raw = localStorage.getItem(CV_DRAFT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as CvDraft;
      if (!parsed || parsed.version !== 1) return null;
      if (
        typeof parsed.updatedAtMs !== "number" ||
        Date.now() - parsed.updatedAtMs > CV_DRAFT_MAX_AGE_MS
      ) {
        localStorage.removeItem(CV_DRAFT_KEY);
        return null;
      }
      if (!parsed.cv) return null;
      return { ...parsed, cv: sanitizeCvDocument(parsed.cv) };
    } catch {
      return null;
    }
  }

  useEffect(() => {
    if (loadedOnce.current) return;
    loadedOnce.current = true;

    const draft = readCvDraft();
    const immediate = draft?.cv ?? normalizeUserCv(null);
    setForm(immediate);
    setLoadState("ready");

    if (!user) {
      return;
    }

    const unsub = subscribeUserDocument(user.uid, (d) => {
      const remote = normalizeUserCv(d?.cv);
      const next = draft && draft.updatedAtMs > 0 ? draft.cv : remote;
      setForm(next);
      setLoadState("ready");
    });
    return () => unsub();
  }, [user]);

  const pdfFileName = useMemo(() => {
    const base = (form?.fullName ?? "").trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
    return base ? `CV-${base}.pdf` : "CV-Kirana.pdf";
  }, [form?.fullName]);

  const isReadyToDownload = Boolean(form?.fullName.trim() && form?.email.trim());

  // Autosave draft (untuk guest juga)
  useEffect(() => {
    if (!form || loadState !== "ready") return;
    try {
      const draft: CvDraft = {
        version: 1,
        updatedAtMs: Date.now(),
        cv: sanitizeCvDocument(form),
      };
      localStorage.setItem(CV_DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }, [form, loadState]);

  // Autosave ke akun (debounced) kalau user login
  useEffect(() => {
    if (!user || !form || loadState !== "ready") return;

    if (autosaveTimer.current) {
      window.clearTimeout(autosaveTimer.current);
      autosaveTimer.current = null;
    }
    autosaveTimer.current = window.setTimeout(() => {
      saveCvData(user.uid, sanitizeCvDocument(form)).catch(() => {});
    }, 900);

    return () => {
      if (autosaveTimer.current) {
        window.clearTimeout(autosaveTimer.current);
        autosaveTimer.current = null;
      }
    };
  }, [user, form, loadState]);

  function resetToDefault() {
    clearCvDraft();
    setForm(normalizeUserCv(null));
    if (user) {
      saveCvData(user.uid, sanitizeCvDocument(normalizeUserCv(null))).catch(() => {});
    }
  }

  if (loadState === "loading" || !form) {
    return <div className="py-12 text-center text-stone-600">Memuat CV...</div>;
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm font-semibold text-teal-800 transition hover:text-teal-950"
      >
        ← Kembali
      </button>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">CV Kirana</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetToDefault}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Reset template
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
    </div>
  );
}
