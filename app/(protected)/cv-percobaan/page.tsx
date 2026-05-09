"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, PencilLine, Download, Trash2 } from "lucide-react";
import { normalizeUserCv, sanitizeCvDocument, type UserCvData } from "@/lib/user-document";
import jemoPhoto from "@/app/Profil/jemo di TikTok.jpg";
import cat67Photo from "@/app/Profil/67 cat.jpg";
import animeArabPhoto from "@/app/Profil/cute anime Arab girl.jpg";
import flowerCatPhoto from "@/app/Profil/kucing_bunga.jpg";
import lulusPhoto from "@/app/Profil/lulus.jpg";
import {
  CvPercobaanPdfDocument,
  mapCvToPercobaanPdfProps,
} from "@/components/CvPercobaanPdfDocument";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);

type CvHistoryEntry = {
  id: string;
  title: string;
  updatedAtMs: number;
  accentId?: string;
  photoPresetId?: string;
  photoUploadDataUrl?: string;
  photoScale?: number;
  photoOffsetX?: number;
  photoOffsetY?: number;
  languageItems?: Array<{ name: string; level: string }>;
  certificationText?: string;
  hobbyText?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  summaryText?: string;
  experienceText?: string;
  educationText?: string;
  skillsText?: string;
  extraSections?: string[];
  cv: UserCvData;
};

type ColorOption = {
  id: string;
  name: string;
  hex: string;
};

const CV_EXPERIMENT_HISTORY_KEY = "kirana_cv_experiment_history_v1";
const MAX_HISTORY = 5;
const COLOR_OPTIONS: ColorOption[] = [
  { id: "teal", name: "Toska", hex: "#0EA5A6" },
  { id: "blue", name: "Biru", hex: "#2563EB" },
  { id: "indigo", name: "Indigo", hex: "#4F46E5" },
  { id: "emerald", name: "Hijau", hex: "#059669" },
  { id: "orange", name: "Oranye", hex: "#EA580C" },
  { id: "rose", name: "Merah muda", hex: "#E11D48" },
  { id: "slate", name: "Abu gelap", hex: "#334155" },
];
const PRESET_PHOTOS = [
  { id: "jemo", src: jemoPhoto },
  { id: "cat67", src: cat67Photo },
  { id: "animeArab", src: animeArabPhoto },
  { id: "kucingBunga", src: flowerCatPhoto },
  { id: "lulus", src: lulusPhoto },
] as const;

function formatDateID(epochMs: number) {
  return new Date(epochMs).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function readHistoryFromStorage() {
  try {
    const raw = localStorage.getItem(CV_EXPERIMENT_HISTORY_KEY);
    if (!raw) return [] as CvHistoryEntry[];
    const parsed = JSON.parse(raw) as CvHistoryEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item) => item && item.id && item.cv)
      .map((item) => ({
        ...item,
        cv: sanitizeCvDocument(item.cv),
      }))
      .slice(0, MAX_HISTORY);
  } catch {
    return [];
  }
}

function persistHistory(entries: CvHistoryEntry[]) {
  try {
    localStorage.setItem(CV_EXPERIMENT_HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
  } catch {
    // ignore
  }
}

function getHistoryPhotoSrc(item: CvHistoryEntry) {
  if (item.photoUploadDataUrl) return item.photoUploadDataUrl;
  const preset = PRESET_PHOTOS.find((photo) => photo.id === item.photoPresetId);
  return preset?.src ?? jemoPhoto;
}

function getPercobaanPdfProps(item: CvHistoryEntry) {
  const mapped = mapCvToPercobaanPdfProps(sanitizeCvDocument(item.cv));
  const parsedSkills = (item.skillsText ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const summary = (item.summaryText ?? "").trim();
  const experience = (item.experienceText ?? "").trim();
  const education = (item.educationText ?? "").trim();
  const hobbyText = (item.hobbyText ?? "").trim();
  return {
    ...mapped,
    fullName: item.title || mapped.fullName,
    city: item.city ?? mapped.city ?? "",
    province: item.province ?? mapped.province ?? "",
    postalCode: item.postalCode ?? mapped.postalCode ?? "",
    phone: item.phone ?? mapped.phone ?? "",
    email: item.email ?? mapped.email ?? "",
    summary: summary || mapped.summary || "",
    experience: experience || mapped.experience || "",
    education: education || mapped.education || "",
    skills: parsedSkills.length > 0 ? parsedSkills : mapped.skills,
    hobbyText,
    photoScale: item.photoScale,
    photoOffsetX: item.photoOffsetX,
    photoOffsetY: item.photoOffsetY,
  };
}

export default function CvPercobaanPage() {
  const router = useRouter();
  const [history, setHistory] = useState<CvHistoryEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [showThemePickerCard, setShowThemePickerCard] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(COLOR_OPTIONS[0]);

  useEffect(() => {
    const localHistory = readHistoryFromStorage();
    setHistory(localHistory);
    setReady(true);
  }, []);

  useEffect(() => {
    function reloadHistory() {
      setHistory(readHistoryFromStorage());
    }
    window.addEventListener("focus", reloadHistory);
    window.addEventListener("pageshow", reloadHistory);
    document.addEventListener("visibilitychange", reloadHistory);
    return () => {
      window.removeEventListener("focus", reloadHistory);
      window.removeEventListener("pageshow", reloadHistory);
      document.removeEventListener("visibilitychange", reloadHistory);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    persistHistory(history);
  }, [history, ready]);

  const hasHistory = history.length > 0;
  const accent = selectedColor.hex;

  function handleContinueCreate() {
    const now = Date.now();
    const newEntry: CvHistoryEntry = {
      id: `exp-${now}`,
      title: "Siapa ya",
      updatedAtMs: now,
      accentId: selectedColor.id,
      cv: normalizeUserCv(null),
    };
    setHistory((prev) => [newEntry, ...prev].slice(0, MAX_HISTORY));
    setShowThemePickerCard(false);
    router.push(`/cv-percobaan/editor?id=${newEntry.id}&accent=${selectedColor.id}`);
  }

  function handleDeleteEntry(entryId: string) {
    setHistory((prev) => prev.filter((item) => item.id !== entryId));
  }

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm font-semibold text-teal-800 transition hover:text-teal-950"
      >
        ← Kembali
      </button>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">CV Kirana</h1>
          <p className="text-sm text-slate-600">
            Susun CV dengan bagian fleksibel, simpan, lalu unduh PDF.
          </p>
        </div>
      </div>
      {!hasHistory ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-800">Histori CV (maksimal 5)</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {!showThemePickerCard ? (
              <button
                type="button"
                onClick={() => setShowThemePickerCard(true)}
                className="group flex h-[304px] w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-400 transition hover:border-teal-300 hover:text-teal-700"
                aria-label="Buat CV baru"
              >
                <Plus className="h-12 w-12 stroke-[1.8]" aria-hidden />
              </button>
            ) : (
              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid h-[304px] grid-cols-[84px_minmax(0,1fr)]">
                  <aside className="px-2 py-3 text-white" style={{ backgroundColor: accent }}>
                    <div className="mx-auto h-12 w-12 overflow-hidden rounded-full border border-white/80">
                      <Image src={jemoPhoto} alt="Foto contoh CV" className="h-full w-full object-cover" priority />
                    </div>
                  </aside>
                  <div className="px-3 py-3">
                    <p className="text-xs font-semibold text-slate-800">Pilih warna dulu</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((option) => {
                        const isActive = selectedColor.id === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setSelectedColor(option)}
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${
                              isActive ? "border-slate-900" : "border-slate-200"
                            }`}
                            style={{ backgroundColor: option.hex }}
                            aria-label={`Pilih warna ${option.name}`}
                          >
                            {isActive ? <Check className="h-3 w-3 text-white" aria-hidden /> : null}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={handleContinueCreate}
                        className="inline-flex h-8 items-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white"
                      >
                        Lanjut
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowThemePickerCard(false)}
                        className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-slate-800">Histori CV (maksimal 5)</h2>
            <button
              type="button"
              onClick={() => setShowThemePickerCard((v) => !v)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-500 px-4 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <Plus className="h-4 w-4" aria-hidden />
              Create new CV
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {showThemePickerCard ? (
              <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="grid h-52 grid-cols-[84px_minmax(0,1fr)]">
                  <aside className="px-2 py-3 text-white" style={{ backgroundColor: accent }}>
                    <div className="mx-auto h-10 w-10 overflow-hidden rounded-full border border-white/80">
                      <Image src={jemoPhoto} alt="Foto contoh CV" className="h-full w-full object-cover" />
                    </div>
                  </aside>
                  <div className="px-3 py-3">
                    <p className="text-xs font-semibold text-slate-800">Pilih warna dulu</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((option) => {
                        const isActive = selectedColor.id === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setSelectedColor(option)}
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full border ${
                              isActive ? "border-slate-900" : "border-slate-200"
                            }`}
                            style={{ backgroundColor: option.hex }}
                            aria-label={`Pilih warna ${option.name}`}
                          >
                            {isActive ? <Check className="h-3 w-3 text-white" aria-hidden /> : null}
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={handleContinueCreate}
                        className="inline-flex h-8 items-center rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white"
                      >
                        Lanjut
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowThemePickerCard(false)}
                        className="inline-flex h-8 items-center rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ) : null}
            {history.slice(0, MAX_HISTORY).map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                  <div className="relative h-40 w-28 overflow-hidden rounded-md border border-slate-300 bg-white shadow-sm">
                    <Image
                      src={getHistoryPhotoSrc(item)}
                      alt={`Foto CV ${item.title}`}
                      fill
                      sizes="112px"
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent p-2">
                      <p className="line-clamp-1 text-[10px] font-semibold text-white">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500">Last edited: {formatDateID(item.updatedAtMs)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/cv-percobaan/editor?id=${item.id}&accent=${item.accentId ?? "teal"}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                    >
                      <PencilLine className="h-3.5 w-3.5" aria-hidden />
                      Edit
                    </Link>
                    <PDFDownloadLink
                      document={
                        <CvPercobaanPdfDocument
                          accentColor={COLOR_OPTIONS.find((opt) => opt.id === (item.accentId ?? "teal"))?.hex ?? "#0EA5A6"}
                          {...getPercobaanPdfProps(item)}
                          photoSrc={typeof getHistoryPhotoSrc(item) === "string" ? getHistoryPhotoSrc(item) : getHistoryPhotoSrc(item).src}
                          languageItems={item.languageItems ?? []}
                          certificationText={item.certificationText}
                          showLanguages={Boolean(item.extraSections?.includes("bahasa"))}
                          showCertification={Boolean(item.extraSections?.includes("sertifikasi"))}
                          showHobby={Boolean(item.extraSections?.includes("hobi"))}
                        />
                      }
                      fileName={`CV-${(item.title || "Kirana").replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}.pdf`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden />
                      Unduh PDF
                    </PDFDownloadLink>
                    <button
                      type="button"
                      onClick={() => handleDeleteEntry(item.id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
