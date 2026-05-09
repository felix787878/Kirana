"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, MapPin, Phone, UserRound, BriefcaseBusiness, GraduationCap, Wrench, ScrollText, LayoutList } from "lucide-react";
import jemoPhoto from "@/app/Profil/jemo di TikTok.jpg";
import cat67Photo from "@/app/Profil/67 cat.jpg";
import animeArabPhoto from "@/app/Profil/cute anime Arab girl.jpg";
import flowerCatPhoto from "@/app/Profil/kucing_bunga.jpg";
import lulusPhoto from "@/app/Profil/lulus.jpg";
import { normalizeUserCv, sanitizeCvDocument, type UserCvData } from "@/lib/user-document";

const ACCENT_COLORS: Record<string, string> = {
  teal: "#0EA5A6",
  blue: "#2563EB",
  indigo: "#4F46E5",
  emerald: "#059669",
  orange: "#EA580C",
  rose: "#E11D48",
  slate: "#334155",
};

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

const CV_EXPERIMENT_HISTORY_KEY = "kirana_cv_experiment_history_v1";
const CV_EXPERIMENT_DRAFT_PREFIX = "kirana_cv_experiment_draft_v1";
const MAX_HISTORY = 5;
const PRESET_PHOTOS = [
  { id: "jemo", label: "Jemo di TikTok", src: jemoPhoto },
  { id: "cat67", label: "67 cat", src: cat67Photo },
  { id: "animeArab", label: "cute anime Arab girl", src: animeArabPhoto },
  { id: "kucingBunga", label: "kucing bunga", src: flowerCatPhoto },
  { id: "lulus", label: "lulus", src: lulusPhoto },
] as const;

const STEPS = [
  { id: "header", label: "Kontak", icon: UserRound },
  { id: "experience", label: "Pengalaman", icon: BriefcaseBusiness },
  { id: "education", label: "Pendidikan", icon: GraduationCap },
  { id: "skills", label: "Keterampilan", icon: Wrench },
  { id: "summary", label: "Profil", icon: ScrollText },
  { id: "other", label: "Bagian lainnya", icon: LayoutList },
] as const;

const EXPERIENCE_SUGGESTIONS = [
  "Bekerja sama dengan tim untuk mencapai target kerja.",
  "Menangani keluhan pelanggan dengan komunikasi yang tenang dan jelas.",
  "Menjaga area kerja tetap bersih dan aman untuk mengurangi risiko kecelakaan.",
];

const SKILLS_SUGGESTIONS = [
  "Komunikasi interpersonal",
  "Pelayanan pelanggan",
  "Manajemen waktu",
  "Microsoft Office",
];

const PROFILE_SUGGESTIONS = [
  "Saya memiliki semangat belajar tinggi, disiplin, dan siap bekerja dalam tim.",
  "Saya terbiasa bekerja dengan target serta mampu beradaptasi dengan cepat.",
];

const CERTIFICATION_SUGGESTIONS = [
  "Sertifikasi Microsoft Office Dasar",
  "Sertifikasi Digital Marketing Fundamental",
];

const HOBBY_SUGGESTIONS = [
  "Membaca buku nonfiksi",
  "Olahraga (lari / futsal / badminton)",
  "Desain / menggambar",
  "Memasak sederhana",
];

const EXTRA_SECTION_OPTIONS = [
  { id: "bahasa", label: "Bahasa" },
  { id: "sertifikasi", label: "Sertifikasi" },
  { id: "hobi", label: "Hobi" },
] as const;

const LANGUAGE_LEVELS = ["Pemula", "Menengah", "Mahir", "Native"] as const;
const LANGUAGE_LEVEL_SCORE: Record<string, number> = {
  Pemula: 1,
  Menengah: 2,
  Mahir: 3,
  Native: 4,
};

function readHistoryFromStorage(): CvHistoryEntry[] {
  try {
    const raw = localStorage.getItem(CV_EXPERIMENT_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CvHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function CvPercobaanEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const entryId = searchParams.get("id");
  const accentKey = searchParams.get("accent") ?? "teal";
  const accent = ACCENT_COLORS[accentKey] ?? ACCENT_COLORS.teal;

  const [firstName, setFirstName] = useState("Siapa");
  const [surname, setSurname] = useState("ya");
  const [city, setCity] = useState("Bekasi");
  const [province, setProvince] = useState("Jawa Barat");
  const [postalCode, setPostalCode] = useState("17148");
  const [phone, setPhone] = useState("+62 812 3456 7890");
  const [email, setEmail] = useState("contoh@email.com");
  const [experienceText, setExperienceText] = useState("");
  const [educationText, setEducationText] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [certificationText, setCertificationText] = useState("");
  const [hobbyText, setHobbyText] = useState("");
  const [extraSections, setExtraSections] = useState<string[]>([]);
  const [languageOptions, setLanguageOptions] = useState<string[]>(["Indonesia", "Inggris"]);
  const [languageItems, setLanguageItems] = useState<Array<{ name: string; level: string }>>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("jemo");
  const [uploadedPhotoDataUrl, setUploadedPhotoDataUrl] = useState<string | null>(null);
  const [photoScale, setPhotoScale] = useState(1.15);
  const [photoOffsetX, setPhotoOffsetX] = useState(0);
  const [photoOffsetY, setPhotoOffsetY] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  const fullName = useMemo(() => `${firstName} ${surname}`.trim(), [firstName, surname]);
  const currentStep = STEPS[activeStep];
  const presetPhoto = PRESET_PHOTOS.find((item) => item.id === selectedPresetId) ?? PRESET_PHOTOS[0];
  const activePhotoSrc = uploadedPhotoDataUrl ?? presetPhoto.src;
  const draftStorageKey = `${CV_EXPERIMENT_DRAFT_PREFIX}:${entryId ?? "new"}`;

  function persistDraft() {
    try {
      const draft = {
        firstName,
        surname,
        city,
        province,
        postalCode,
        phone,
        email,
        experienceText,
        educationText,
        skillsText,
        summaryText,
        certificationText,
        hobbyText,
        extraSections,
        languageItems,
        activeStep,
        selectedPresetId,
        uploadedPhotoDataUrl,
        photoScale,
        photoOffsetX,
        photoOffsetY,
        updatedAtMs: Date.now(),
      };
      localStorage.setItem(draftStorageKey, JSON.stringify(draft));
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    setIsHydrated(false);
    try {
      if (entryId) {
        const raw = localStorage.getItem(CV_EXPERIMENT_HISTORY_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CvHistoryEntry[];
          if (Array.isArray(parsed)) {
            const target = parsed.find((item) => item?.id === entryId);
            if (target) {
              const cv = sanitizeCvDocument(target.cv);
              const [first = "", ...rest] = (target.title || cv.fullName || "").trim().split(/\s+/);
              setFirstName(first || "Siapa");
              setSurname(rest.join(" ") || "ya");
              setCity(target.city || "Bekasi");
              setProvince(target.province || "Jawa Barat");
              setPostalCode(target.postalCode || "17148");
              setPhone(target.phone || cv.phone || "+62 812 3456 7890");
              setEmail(target.email || cv.email || "contoh@email.com");
<<<<<<< HEAD
              setSummaryText(target.summaryText || "");
              setSkillsText(target.skillsText || "");
=======
              setSummaryText(target.summaryText || cv.summary || "");
              setSkillsText(target.skillsText || (Array.isArray(cv.skills) ? cv.skills.join(", ") : ""));
>>>>>>> 33d5b9109b780a4e0aaf2ff5f4312507abb4abc8
              setExperienceText(target.experienceText || "");
              setEducationText(target.educationText || "");
              if (target.languageItems?.length) setLanguageItems(target.languageItems);
              if (Array.isArray(target.extraSections)) setExtraSections(target.extraSections);
              if (target.certificationText) setCertificationText(target.certificationText);
              if (target.hobbyText) setHobbyText(target.hobbyText);
              if (target.photoPresetId) setSelectedPresetId(target.photoPresetId);
              if (target.photoUploadDataUrl) setUploadedPhotoDataUrl(target.photoUploadDataUrl);
              if (typeof target.photoScale === "number") setPhotoScale(target.photoScale);
              if (typeof target.photoOffsetX === "number") setPhotoOffsetX(target.photoOffsetX);
              if (typeof target.photoOffsetY === "number") setPhotoOffsetY(target.photoOffsetY);
            }
          }
        }
      }

      const draftRaw = localStorage.getItem(draftStorageKey);
      if (draftRaw) {
        const draft = JSON.parse(draftRaw) as Partial<{
          firstName: string;
          surname: string;
          city: string;
          province: string;
          postalCode: string;
          phone: string;
          email: string;
          experienceText: string;
          educationText: string;
          skillsText: string;
          summaryText: string;
          certificationText: string;
          hobbyText: string;
          extraSections: string[];
          languageItems: Array<{ name: string; level: string }>;
          activeStep: number;
          selectedPresetId: string;
          uploadedPhotoDataUrl: string | null;
          photoScale: number;
          photoOffsetX: number;
          photoOffsetY: number;
        }>;
        if (typeof draft.firstName === "string") setFirstName(draft.firstName);
        if (typeof draft.surname === "string") setSurname(draft.surname);
        if (typeof draft.city === "string") setCity(draft.city);
        if (typeof draft.province === "string") setProvince(draft.province);
        if (typeof draft.postalCode === "string") setPostalCode(draft.postalCode);
        if (typeof draft.phone === "string") setPhone(draft.phone);
        if (typeof draft.email === "string") setEmail(draft.email);
        if (typeof draft.experienceText === "string") setExperienceText(draft.experienceText);
        if (typeof draft.educationText === "string") setEducationText(draft.educationText);
        if (typeof draft.skillsText === "string") setSkillsText(draft.skillsText);
        if (typeof draft.summaryText === "string") setSummaryText(draft.summaryText);
        if (typeof draft.certificationText === "string") setCertificationText(draft.certificationText);
        if (typeof draft.hobbyText === "string") setHobbyText(draft.hobbyText);
        if (Array.isArray(draft.extraSections)) setExtraSections(draft.extraSections);
        if (Array.isArray(draft.languageItems) && draft.languageItems.length > 0) setLanguageItems(draft.languageItems);
        if (typeof draft.activeStep === "number" && draft.activeStep >= 0 && draft.activeStep < STEPS.length) {
          setActiveStep(draft.activeStep);
        }
        if (typeof draft.selectedPresetId === "string") setSelectedPresetId(draft.selectedPresetId);
        if (typeof draft.uploadedPhotoDataUrl === "string" || draft.uploadedPhotoDataUrl === null) {
          setUploadedPhotoDataUrl(draft.uploadedPhotoDataUrl);
        }
        if (typeof draft.photoScale === "number") setPhotoScale(draft.photoScale);
        if (typeof draft.photoOffsetX === "number") setPhotoOffsetX(draft.photoOffsetX);
        if (typeof draft.photoOffsetY === "number") setPhotoOffsetY(draft.photoOffsetY);
      }
    } catch {
      // ignore
    } finally {
      setIsHydrated(true);
    }
  }, [entryId, draftStorageKey]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/languages")
      .then((res) => res.json())
      .then((data: { languages?: string[] }) => {
        if (cancelled) return;
        const list = Array.isArray(data?.languages) ? data.languages.filter(Boolean) : [];
        if (list.length) setLanguageOptions(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  function onUploadPhoto(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (result) setUploadedPhotoDataUrl(result);
    };
    reader.readAsDataURL(file);
  }

  function handleContinue() {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1);
      return;
    }

    const now = Date.now();
    const nextEntry: CvHistoryEntry = buildHistoryEntry(now);
    try {
      const safe = readHistoryFromStorage();
      const next = [nextEntry, ...safe.filter((item) => item?.id !== nextEntry.id)].slice(0, MAX_HISTORY);
      localStorage.setItem(CV_EXPERIMENT_HISTORY_KEY, JSON.stringify(next));
      localStorage.removeItem(draftStorageKey);
    } catch {
      // ignore
    }
    router.push("/cv-percobaan");
  }

  function appendLine(current: string, text: string) {
    return current.trim() ? `${current}\n• ${text}` : `• ${text}`;
  }

  function appendPlainLine(current: string, text: string) {
    const next = text.trim();
    if (!next) return current;
    return current.trim() ? `${current}\n${next}` : next;
  }

  function toggleExtraSection(id: string) {
    setExtraSections((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (id === "bahasa" && languageItems.length === 0) {
        setLanguageItems([{ name: "Indonesia", level: "Native" }]);
      }
      return [...prev, id];
    });
  }

  function updateLanguage(index: number, key: "name" | "level", value: string) {
    setLanguageItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  function addLanguage() {
    setLanguageItems((prev) => [...prev, { name: "Inggris", level: "Pemula" }]);
  }

  function removeLanguage(index: number) {
    setLanguageItems((prev) => prev.filter((_, i) => i !== index));
  }

  function buildHistoryEntry(updatedAtMs: number): CvHistoryEntry {
    const cv = normalizeUserCv({
      fullName: fullName || "Siapa ya",
      city,
      province,
      postalCode,
      phone,
      email,
      summary: summaryText || PROFILE_SUGGESTIONS[0],
      skills: skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    });
    cv.sections = cv.sections.map((section) => {
      if (section.key === "experience") {
        const entries = [...section.entries];
        if (entries[0]) entries[0].contentText = experienceText;
        return { ...section, entries };
      }
      if (section.key === "education") {
        const entries = [...section.entries];
        if (entries[0]) entries[0].contentText = educationText;
        return { ...section, entries };
      }
      return section;
    });
    return {
      id: entryId || `exp-${updatedAtMs}`,
      title: fullName || "Siapa ya",
      updatedAtMs,
      accentId: accentKey,
      photoPresetId: selectedPresetId,
      photoUploadDataUrl: uploadedPhotoDataUrl ?? undefined,
      photoScale,
      photoOffsetX,
      photoOffsetY,
      languageItems,
      certificationText,
      hobbyText,
      city,
      province,
      postalCode,
      phone,
      email,
      summaryText,
      experienceText,
      educationText,
      skillsText,
      extraSections,
      cv: sanitizeCvDocument(cv),
    };
  }

  function persistHistorySnapshot() {
    if (!entryId) return;
    try {
      const safe = readHistoryFromStorage();
      const snapshot = buildHistoryEntry(Date.now());
      const next = [snapshot, ...safe.filter((item) => item?.id !== snapshot.id)].slice(0, MAX_HISTORY);
      localStorage.setItem(CV_EXPERIMENT_HISTORY_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isHydrated) return;
    persistDraft();
    persistHistorySnapshot();
  }, [
    firstName,
    surname,
    city,
    province,
    postalCode,
    phone,
    email,
    experienceText,
    educationText,
    skillsText,
    summaryText,
    certificationText,
    hobbyText,
    extraSections,
    languageItems,
    activeStep,
    selectedPresetId,
    uploadedPhotoDataUrl,
    photoScale,
    photoOffsetX,
    photoOffsetY,
    draftStorageKey,
    isHydrated,
  ]);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => router.push("/cv-percobaan")}
        className="inline-flex items-center gap-1 text-sm font-semibold text-teal-800 transition hover:text-teal-950"
      >
        ← Kembali ke histori
      </button>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
        <div className="flex min-w-max items-center gap-2">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === activeStep;
            const isDone = idx < activeStep;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-indigo-700 text-white"
                    : isDone
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {step.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <aside className="order-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:order-2 xl:sticky xl:top-20 xl:h-fit">
          <div className="grid min-h-[430px] grid-cols-[95px_minmax(0,1fr)]">
            <div className="px-2 py-3 text-white" style={{ backgroundColor: accent }}>
              <div className="mx-auto h-16 w-16 overflow-hidden rounded-full border-2 border-white/80">
                <Image
                  src={activePhotoSrc}
                  alt="Foto profil CV"
                  className="h-full w-full object-cover"
                  width={96}
                  height={96}
                  unoptimized
                  style={{
                    transform: `translate(${photoOffsetX}px, ${photoOffsetY}px) scale(${photoScale})`,
                    transformOrigin: "center",
                  }}
                />
              </div>
              <p className="mt-4 text-[10px] font-semibold tracking-[0.14em] text-white/90">KETERAMPILAN</p>
              <ul className="mt-1.5 space-y-1 text-[10px] leading-relaxed text-white/95">
                {(skillsText ? skillsText.split(",") : ["Komunikasi", "Administrasi", "Kerja tim"])
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .slice(0, 4)
                  .map((skill) => (
                    <li key={skill}>- {skill}</li>
                  ))}
              </ul>

              {extraSections.includes("bahasa") ? (
                <div className="mt-4 border-t border-white/35 pt-2.5">
                  <p className="text-[10px] font-semibold tracking-[0.14em] text-white/90">BAHASA</p>
                  <div className="mt-1.5 space-y-2">
                    {languageItems.slice(0, 3).map((item, idx) => {
                      const activeBars = LANGUAGE_LEVEL_SCORE[item.level] ?? 2;
                      return (
                        <div key={`${item.name}-${idx}`} className="space-y-1">
                          <p className="text-[10px] font-semibold text-white/95">{item.name}</p>
                          <div className="grid grid-cols-4 gap-1">
                            {Array.from({ length: 4 }).map((_, barIdx) => (
                              <span
                                key={`${item.name}-${barIdx}`}
                                className={`h-1 rounded-sm ${
                                  barIdx < activeBars ? "bg-white" : "bg-white/35"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-[9px] text-white/85">{item.level}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="bg-white px-3 py-4">
              <h2 className="text-xl font-extrabold uppercase leading-tight text-slate-900">{fullName || "Siapa ya"}</h2>
              <div className="mt-2.5 space-y-1 text-[10px] text-slate-600">
                <p className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" aria-hidden /> {city || "-"}, {province || "-"}
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="h-3 w-3" aria-hidden /> {phone || "-"}
                </p>
                <p className="flex items-center gap-1">
                  <Mail className="h-3 w-3" aria-hidden /> {email || "-"}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <section>
                  <h3 className="text-[11px] font-bold uppercase tracking-wide" style={{ color: accent }}>Profil</h3>
                  <p className="mt-1 line-clamp-2 text-[10px] text-slate-600">{summaryText || "Tulis profil singkat di langkah Profil."}</p>
                </section>
                <section>
                  <h3 className="text-[11px] font-bold uppercase tracking-wide" style={{ color: accent }}>Pengalaman</h3>
                  <p className="mt-1 line-clamp-2 text-[10px] text-slate-600">{experienceText || "Isi pengalaman kerja di langkah Pengalaman."}</p>
                </section>
                <section>
                  <h3 className="text-[11px] font-bold uppercase tracking-wide" style={{ color: accent }}>Pendidikan</h3>
                  <p className="mt-1 line-clamp-2 text-[10px] text-slate-600">{educationText || "Isi pendidikan di langkah Pendidikan."}</p>
                </section>
                {extraSections.includes("sertifikasi") ? (
                  <section>
                    <h3 className="text-[11px] font-bold uppercase tracking-wide" style={{ color: accent }}>Sertifikasi</h3>
                    <p className="mt-1 line-clamp-2 text-[10px] text-slate-600">{certificationText || "Tambahkan sertifikasi bila ada."}</p>
                  </section>
                ) : null}
                {extraSections.includes("hobi") ? (
                  <section>
                    <h3 className="text-[11px] font-bold uppercase tracking-wide" style={{ color: accent }}>Hobi</h3>
                    <p className="mt-1 line-clamp-2 text-[10px] text-slate-600">{hobbyText || "Tambahkan hobi bila ingin ditampilkan."}</p>
                  </section>
                ) : null}
              </div>
            </div>
          </div>
        </aside>

        <section className="order-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 xl:order-1">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">{currentStep.label}</h1>
          <p className="mt-1 text-xs text-slate-600">Langkah {activeStep + 1} dari {STEPS.length}</p>

          <div className="mt-4 space-y-3">
            {currentStep.id === "header" ? (
              <>
                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-xs font-semibold text-slate-700">Foto profil</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PRESET_PHOTOS.map((photo) => (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => {
                          setSelectedPresetId(photo.id);
                          setUploadedPhotoDataUrl(null);
                        }}
                        className={`overflow-hidden rounded-lg border-2 ${selectedPresetId === photo.id && !uploadedPhotoDataUrl ? "border-indigo-500" : "border-slate-200"}`}
                        title={photo.label}
                      >
                        <Image src={photo.src} alt={photo.label} width={48} height={48} className="h-12 w-12 object-cover" />
                      </button>
                    ))}
                  </div>
                  <label className="mt-3 inline-flex cursor-pointer items-center rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                    Upload dari galeri
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onUploadPhoto(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </div>

                <div className="rounded-xl border border-slate-200 p-3">
                  <p className="text-xs font-semibold text-slate-700">Atur posisi & ukuran foto</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                      <span className="text-xs font-semibold text-slate-600">Zoom</span>
                      <input
                        type="range"
                        min={1}
                        max={2}
                        step={0.05}
                        value={photoScale}
                        onChange={(e) => setPhotoScale(Number(e.target.value))}
                        className="w-full"
                      />
                    </label>
                    <div className="flex items-end justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoScale(1.15);
                          setPhotoOffsetX(0);
                          setPhotoOffsetY(0);
                        }}
                        className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Reset
                      </button>
                    </div>
                    <label className="space-y-1">
                      <span className="text-xs font-semibold text-slate-600">Geser kiri/kanan</span>
                      <input
                        type="range"
                        min={-24}
                        max={24}
                        step={1}
                        value={photoOffsetX}
                        onChange={(e) => setPhotoOffsetX(Number(e.target.value))}
                        className="w-full"
                      />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs font-semibold text-slate-600">Geser atas/bawah</span>
                      <input
                        type="range"
                        min={-24}
                        max={24}
                        step={1}
                        value={photoOffsetY}
                        onChange={(e) => setPhotoOffsetY(Number(e.target.value))}
                        className="w-full"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-slate-600">First name</span>
                    <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-9 w-full rounded-lg border border-slate-300 px-2.5 text-xs outline-none focus:border-teal-400" />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-slate-600">Surname</span>
                    <input value={surname} onChange={(e) => setSurname(e.target.value)} className="h-9 w-full rounded-lg border border-slate-300 px-2.5 text-xs outline-none focus:border-teal-400" />
                  </label>
                  <label className="space-y-1 sm:col-span-2">
                    <span className="text-xs font-semibold text-slate-600">Kota</span>
                    <input value={city} onChange={(e) => setCity(e.target.value)} className="h-9 w-full rounded-lg border border-slate-300 px-2.5 text-xs outline-none focus:border-teal-400" />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-slate-600">Provinsi</span>
                    <input value={province} onChange={(e) => setProvince(e.target.value)} className="h-9 w-full rounded-lg border border-slate-300 px-2.5 text-xs outline-none focus:border-teal-400" />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-slate-600">Kode pos</span>
                    <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="h-9 w-full rounded-lg border border-slate-300 px-2.5 text-xs outline-none focus:border-teal-400" />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-slate-600">Phone</span>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-9 w-full rounded-lg border border-slate-300 px-2.5 text-xs outline-none focus:border-teal-400" />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-semibold text-slate-600">Email</span>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 w-full rounded-lg border border-slate-300 px-2.5 text-xs outline-none focus:border-teal-400" />
                  </label>
                </div>
              </>
            ) : null}

            {currentStep.id === "experience" ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  {EXPERIENCE_SUGGESTIONS.map((item) => (
                    <button key={item} type="button" onClick={() => setExperienceText((prev) => appendLine(prev, item))} className="inline-flex w-full items-center rounded-full border border-slate-300 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50">
                      + {item}
                    </button>
                  ))}
                </div>
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Pengalaman kerja</span>
                  <textarea value={experienceText} onChange={(e) => setExperienceText(e.target.value)} rows={6} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs outline-none focus:border-teal-400" placeholder="Contoh: Staf Operasional - PT Maju Jaya (2023 - sekarang)..." />
                </label>
              </div>
            ) : null}
            {currentStep.id === "education" ? (
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-600">Pendidikan</span>
                <textarea value={educationText} onChange={(e) => setEducationText(e.target.value)} rows={6} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs outline-none focus:border-teal-400" placeholder="Contoh: S1 Manajemen, Universitas X..." />
              </label>
            ) : null}
            {currentStep.id === "skills" ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {SKILLS_SUGGESTIONS.map((item) => (
                    <button key={item} type="button" onClick={() => setSkillsText((prev) => {
                      const current = prev.split(",").map((s) => s.trim()).filter(Boolean);
                      if (current.includes(item)) return prev;
                      return current.length ? `${current.join(", ")}, ${item}` : item;
                    })} className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50">
                      + {item}
                    </button>
                  ))}
                </div>
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Keterampilan (pisahkan dengan koma)</span>
                  <textarea value={skillsText} onChange={(e) => setSkillsText(e.target.value)} rows={6} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs outline-none focus:border-teal-400" placeholder="Contoh: Komunikasi, Leadership, Microsoft Excel" />
                </label>
              </div>
            ) : null}
            {currentStep.id === "summary" ? (
              <div className="space-y-3">
                <div className="space-y-2">
                  {PROFILE_SUGGESTIONS.map((item) => (
                    <button key={item} type="button" onClick={() => setSummaryText((prev) => appendPlainLine(prev, item))} className="inline-flex w-full items-center rounded-full border border-slate-300 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50">
                      + {item}
                    </button>
                  ))}
                </div>
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-600">Profil</span>
                  <textarea value={summaryText} onChange={(e) => setSummaryText(e.target.value)} rows={6} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs outline-none focus:border-teal-400" placeholder="Ringkas profil profesional kamu..." />
                </label>
              </div>
            ) : null}
            {currentStep.id === "other" ? (
              <div className="space-y-3">
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs font-semibold text-slate-700">Pilih bagian tambahan</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {EXTRA_SECTION_OPTIONS.map((opt) => {
                      const active = extraSections.includes(opt.id);
                      return (
                        <button key={opt.id} type="button" onClick={() => toggleExtraSection(opt.id)} className={`rounded-full border px-3 py-1 text-xs ${active ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-slate-300 text-slate-600"}`}>
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {extraSections.includes("bahasa") ? (
                  <div className="space-y-2 rounded-lg border border-slate-200 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">Bahasa</span>
                      <button type="button" onClick={addLanguage} className="rounded-full border border-slate-300 px-2.5 py-1 text-[11px] text-slate-700">
                        + Tambah bahasa
                      </button>
                    </div>
                    <div className="space-y-2">
                      {languageItems.map((item, idx) => (
                        <div key={`${item.name}-${idx}`} className="grid grid-cols-[minmax(0,1fr)_120px_auto] gap-2">
                          <select
                            value={item.name}
                            onChange={(e) => updateLanguage(idx, "name", e.target.value)}
                            className="h-8 rounded-lg border border-slate-300 px-2 text-xs"
                          >
                            {languageOptions.map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                          <select
                            value={item.level}
                            onChange={(e) => updateLanguage(idx, "level", e.target.value)}
                            className="h-8 rounded-lg border border-slate-300 px-2 text-xs"
                          >
                            {LANGUAGE_LEVELS.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => removeLanguage(idx)}
                            className="h-8 rounded-lg border border-rose-200 px-2 text-xs text-rose-700"
                          >
                            Hapus
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {extraSections.includes("sertifikasi") ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {CERTIFICATION_SUGGESTIONS.map((item) => (
                        <button key={item} type="button" onClick={() => setCertificationText((prev) => appendLine(prev, item))} className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50">
                          + {item}
                        </button>
                      ))}
                    </div>
                    <label className="space-y-1">
                      <span className="text-xs font-semibold text-slate-600">Sertifikasi</span>
                      <textarea value={certificationText} onChange={(e) => setCertificationText(e.target.value)} rows={4} className="w-full rounded-lg border border-slate-300 p-2.5 text-xs outline-none focus:border-teal-400" />
                    </label>
                  </div>
                ) : null}

                {extraSections.includes("hobi") ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {HOBBY_SUGGESTIONS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setHobbyText((prev) => appendPlainLine(prev, item))}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-50"
                        >
                          + {item}
                        </button>
                      ))}
                    </div>
                    <label className="space-y-1">
                      <span className="text-xs font-semibold text-slate-600">Hobi</span>
                      <textarea
                        value={hobbyText}
                        onChange={(e) => setHobbyText(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-slate-300 p-2.5 text-xs outline-none focus:border-teal-400"
                        placeholder="Contoh: Membaca, futsal, menggambar..."
                      />
                    </label>
                  </div>
                ) : null}

              </div>
            ) : null}
          </div>

          <div className="mt-5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                if (activeStep === 0) router.back();
                else setActiveStep((prev) => Math.max(0, prev - 1));
              }}
              className="inline-flex h-9 items-center rounded-full border border-slate-600 px-5 text-xs font-semibold text-slate-800"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex h-9 items-center rounded-full bg-emerald-400 px-5 text-xs font-semibold text-slate-900 hover:bg-emerald-500"
            >
              {activeStep === STEPS.length - 1 ? "Simpan" : "Lanjut"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
