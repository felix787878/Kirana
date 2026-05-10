"use client";

import Image, { type StaticImageData } from "next/image";
import locationIcon from "@/app/Profil/location.png";
import emailIcon from "@/app/Profil/email.png";
import telephoneIcon from "@/app/Profil/telephone.png";

export type CvHistoryMiniPreviewProps = {
  accentHex: string;
  title: string;
  photoSrc: string | StaticImageData;
  summaryText: string;
  skillsText: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  experienceText?: string;
  /** Tanpa border/radius — dipakai saat di-zoom dan dipotong di kartu riwayat. */
  variant?: "default" | "snapshot";
};

function normalizeParagraph(text?: string) {
  if (!text?.trim()) return "";
  return text
    .split("\n")
    .map((line) => line.replace(/^[•\-\s]+/, "").trim())
    .filter(Boolean)
    .join(" ");
}

/** Miniatur layout CV (sidebar + konten) untuk snapshot kartu riwayat — selaras dengan struktur PDF. */
export function CvHistoryMiniPreview({
  accentHex,
  title,
  photoSrc,
  summaryText,
  skillsText,
  city,
  province,
  postalCode,
  phone,
  email,
  experienceText,
  variant = "default",
}: CvHistoryMiniPreviewProps) {
  const skills = skillsText
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
  const fallbackSkills = ["Komunikasi", "Administrasi", "Kerja tim"];
  const list = skills.length ? skills : fallbackSkills;
  const summary = normalizeParagraph(summaryText).trim() || "Profil belum diisi.";
  const loc =
    [city, province, postalCode].filter(Boolean).join(", ").trim() || "-";
  const phoneLine = (phone ?? "").trim() || "-";
  const emailLine = (email ?? "").trim() || "-";
  const expNorm = normalizeParagraph(experienceText);
  const experiencePreview = expNorm || "Pengalaman belum diisi.";

  const iconClass = "mt-px h-2 w-2 shrink-0 object-contain opacity-90";

  return (
    <div
      className={`pointer-events-none h-[400px] w-[272px] overflow-hidden bg-white ${
        variant === "snapshot"
          ? "rounded-none border-0 shadow-none"
          : "rounded-lg border border-slate-200/90 shadow-xl shadow-slate-900/10"
      }`}
      aria-hidden
    >
      <div className="grid h-full grid-cols-[92px_minmax(0,1fr)]">
        <div className="flex flex-col px-2 py-2.5 text-white" style={{ backgroundColor: accentHex }}>
          <div className="relative mx-auto h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-white/30">
            <Image
              src={photoSrc}
              alt=""
              width={56}
              height={56}
              className="h-full w-full object-cover object-top"
              unoptimized={typeof photoSrc === "string"}
            />
          </div>
          <div className="mx-auto mt-1.5 h-px w-full bg-white/90" />
          <p className="mt-2 text-[7px] font-bold uppercase leading-tight tracking-wide text-white/95">
            KETERAMPILAN
          </p>
          <ul className="mt-1 space-y-0.5">
            {list.map((line, i) => (
              <li key={`${line}-${i}`} className="line-clamp-2 text-[6px] leading-snug text-white/95">
                - {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex min-h-0 flex-col bg-white px-2 py-2.5">
          <p className="text-[11px] font-extrabold uppercase leading-tight tracking-tight text-slate-900 line-clamp-2">
            {title || "Nama"}
          </p>
          <div className="mt-1 space-y-0.5 text-[6px] leading-relaxed text-slate-600">
            <p className="flex items-start gap-1">
              <Image src={locationIcon} alt="" width={8} height={8} className={iconClass} />
              <span className="min-w-0 flex-1 leading-snug">{loc}</span>
            </p>
            <p className="flex items-start gap-1">
              <Image src={telephoneIcon} alt="" width={8} height={8} className={iconClass} />
              <span className="min-w-0 flex-1 leading-snug">{phoneLine}</span>
            </p>
            <p className="flex items-start gap-1">
              <Image src={emailIcon} alt="" width={8} height={8} className={iconClass} />
              <span className="min-w-0 flex-1 break-all leading-snug">{emailLine}</span>
            </p>
          </div>
          <div className="my-1.5 h-[2px] shrink-0 bg-slate-900" />
          <p className="text-[6.5px] font-bold tracking-wide text-slate-800" style={{ color: accentHex }}>
            Profil
          </p>
          <p className="mt-0.5 line-clamp-3 text-[6px] leading-relaxed text-slate-600">{summary}</p>
          <div className="my-1.5 h-px shrink-0 bg-slate-700/90" />
          <p className="text-[6.5px] font-bold tracking-wide text-slate-800" style={{ color: accentHex }}>
            Pengalaman
          </p>
          <p className="mt-0.5 line-clamp-3 text-[6px] leading-relaxed text-slate-600">{experiencePreview}</p>
        </div>
      </div>
    </div>
  );
}
