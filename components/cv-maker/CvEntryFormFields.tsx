"use client";

import type { CvEntryKind, CvSectionEntry } from "@/lib/user-document";

const inp =
  "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-900 outline-none ring-teal-600 focus:ring-2";
const lab = "text-xs font-medium text-slate-700";
const btnGhost =
  "rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100";

type Props = {
  entry: CvSectionEntry;
  onChange: (e: CvSectionEntry) => void;
  onRemove: () => void;
};

export function CvEntryFormFields({ entry, onChange, onRemove }: Props) {
  return (
    <div className="border-b border-slate-200/90 bg-white px-3 py-3 space-y-2 last:border-b-0">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {kindLabel(entry.kind)}
        </span>
        <button type="button" onClick={onRemove} className="text-xs font-semibold text-red-700 hover:underline">
          Hapus entri
        </button>
      </div>
      {renderFields(entry, onChange)}
    </div>
  );
}

function kindLabel(k: CvEntryKind): string {
  const m: Record<CvEntryKind, string> = {
    text: "Teks",
    education: "Pendidikan",
    experience: "Pengalaman",
    publication: "Publikasi",
    project: "Proyek",
    one_line: "Satu baris",
    bullet_block: "Daftar bullet",
    numbered_block: "Daftar bernomor",
    reversed_numbered: "Daftar nomor terbalik",
  };
  return m[k] ?? k;
}

function renderFields(entry: CvSectionEntry, onChange: (e: CvSectionEntry) => void) {
  switch (entry.kind) {
    case "text":
      return (
        <div className="space-y-1">
          <label className={lab}>Isi</label>
          <textarea
            rows={5}
            className={inp}
            value={entry.body}
            onChange={(e) => onChange({ ...entry, body: e.target.value })}
          />
        </div>
      );
    case "one_line":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <label className={lab}>Label</label>
            <input
              className={inp}
              value={entry.label}
              onChange={(e) => onChange({ ...entry, label: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Detail</label>
            <input
              className={inp}
              value={entry.details}
              onChange={(e) => onChange({ ...entry, details: e.target.value })}
            />
          </div>
        </div>
      );
    case "bullet_block":
    case "numbered_block":
    case "reversed_numbered":
      return (
        <div className="space-y-2">
          {entry.items.map((line, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={inp}
                value={line}
                onChange={(e) => {
                  const items = [...entry.items];
                  items[i] = e.target.value;
                  onChange({ ...entry, items });
                }}
              />
              <button
                type="button"
                className={btnGhost}
                onClick={() => {
                  const items = entry.items.filter((_, j) => j !== i);
                  onChange({ ...entry, items: items.length ? items : [""] });
                }}
              >
                −
              </button>
            </div>
          ))}
          <button
            type="button"
            className={btnGhost}
            onClick={() => onChange({ ...entry, items: [...entry.items, ""] })}
          >
            + Baris
          </button>
        </div>
      );
    case "education":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <label className={lab}>Institusi</label>
            <input
              className={inp}
              value={entry.institution}
              onChange={(e) => onChange({ ...entry, institution: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Bidang / jurusan</label>
            <input
              className={inp}
              value={entry.area}
              onChange={(e) => onChange({ ...entry, area: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Gelar</label>
            <input
              className={inp}
              value={entry.degree}
              onChange={(e) => onChange({ ...entry, degree: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Mulai (YYYY-MM)</label>
            <input
              className={inp}
              value={entry.startDate}
              onChange={(e) => onChange({ ...entry, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Selesai</label>
            <input
              className={inp}
              value={entry.endDate}
              onChange={(e) => onChange({ ...entry, endDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Lokasi</label>
            <input
              className={inp}
              value={entry.location}
              onChange={(e) => onChange({ ...entry, location: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className={lab}>Ringkasan</label>
            <textarea
              rows={2}
              className={inp}
              value={entry.summary}
              onChange={(e) => onChange({ ...entry, summary: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <p className={lab}>Poin utama</p>
            {entry.highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inp}
                  value={h}
                  onChange={(e) => {
                    const highlights = [...entry.highlights];
                    highlights[i] = e.target.value;
                    onChange({ ...entry, highlights });
                  }}
                />
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => {
                    const highlights = entry.highlights.filter((_, j) => j !== i);
                    onChange({ ...entry, highlights: highlights.length ? highlights : [""] });
                  }}
                >
                  −
                </button>
              </div>
            ))}
            <button
              type="button"
              className={btnGhost}
              onClick={() => onChange({ ...entry, highlights: [...entry.highlights, ""] })}
            >
              + Poin
            </button>
          </div>
        </div>
      );
    case "experience":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <label className={lab}>Perusahaan / organisasi</label>
            <input
              className={inp}
              value={entry.company}
              onChange={(e) => onChange({ ...entry, company: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Posisi</label>
            <input
              className={inp}
              value={entry.position}
              onChange={(e) => onChange({ ...entry, position: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Mulai</label>
            <input
              className={inp}
              value={entry.startDate}
              onChange={(e) => onChange({ ...entry, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Selesai</label>
            <input
              className={inp}
              value={entry.endDate}
              onChange={(e) => onChange({ ...entry, endDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Lokasi</label>
            <input
              className={inp}
              value={entry.location}
              onChange={(e) => onChange({ ...entry, location: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className={lab}>Ringkasan</label>
            <textarea
              rows={2}
              className={inp}
              value={entry.summary}
              onChange={(e) => onChange({ ...entry, summary: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <p className={lab}>Poin utama</p>
            {entry.highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inp}
                  value={h}
                  onChange={(e) => {
                    const highlights = [...entry.highlights];
                    highlights[i] = e.target.value;
                    onChange({ ...entry, highlights });
                  }}
                />
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => {
                    const highlights = entry.highlights.filter((_, j) => j !== i);
                    onChange({ ...entry, highlights: highlights.length ? highlights : [""] });
                  }}
                >
                  −
                </button>
              </div>
            ))}
            <button
              type="button"
              className={btnGhost}
              onClick={() => onChange({ ...entry, highlights: [...entry.highlights, ""] })}
            >
              + Poin
            </button>
          </div>
        </div>
      );
    case "project":
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <label className={lab}>Nama proyek</label>
            <input
              className={inp}
              value={entry.name}
              onChange={(e) => onChange({ ...entry, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Mulai</label>
            <input
              className={inp}
              value={entry.startDate}
              onChange={(e) => onChange({ ...entry, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Selesai</label>
            <input
              className={inp}
              value={entry.endDate}
              onChange={(e) => onChange({ ...entry, endDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className={lab}>Lokasi</label>
            <input
              className={inp}
              value={entry.location}
              onChange={(e) => onChange({ ...entry, location: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className={lab}>Ringkasan</label>
            <textarea
              rows={2}
              className={inp}
              value={entry.summary}
              onChange={(e) => onChange({ ...entry, summary: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 space-y-2">
            <p className={lab}>Poin utama</p>
            {entry.highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inp}
                  value={h}
                  onChange={(e) => {
                    const highlights = [...entry.highlights];
                    highlights[i] = e.target.value;
                    onChange({ ...entry, highlights });
                  }}
                />
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => {
                    const highlights = entry.highlights.filter((_, j) => j !== i);
                    onChange({ ...entry, highlights: highlights.length ? highlights : [""] });
                  }}
                >
                  −
                </button>
              </div>
            ))}
            <button
              type="button"
              className={btnGhost}
              onClick={() => onChange({ ...entry, highlights: [...entry.highlights, ""] })}
            >
              + Poin
            </button>
          </div>
        </div>
      );
    case "publication":
      return (
        <div className="space-y-2">
          <div className="space-y-1">
            <label className={lab}>Judul</label>
            <input
              className={inp}
              value={entry.title}
              onChange={(e) => onChange({ ...entry, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <p className={lab}>Penulis (satu baris per nama; *nama* untuk penulis utama)</p>
            {entry.authors.map((a, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inp}
                  value={a}
                  onChange={(e) => {
                    const authors = [...entry.authors];
                    authors[i] = e.target.value;
                    onChange({ ...entry, authors });
                  }}
                />
                <button
                  type="button"
                  className={btnGhost}
                  onClick={() => {
                    const authors = entry.authors.filter((_, j) => j !== i);
                    onChange({ ...entry, authors: authors.length ? authors : [""] });
                  }}
                >
                  −
                </button>
              </div>
            ))}
            <button
              type="button"
              className={btnGhost}
              onClick={() => onChange({ ...entry, authors: [...entry.authors, ""] })}
            >
              + Penulis
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <label className={lab}>Jurnal / konferensi</label>
              <input
                className={inp}
                value={entry.journal}
                onChange={(e) => onChange({ ...entry, journal: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className={lab}>Tanggal</label>
              <input
                className={inp}
                value={entry.date}
                onChange={(e) => onChange({ ...entry, date: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className={lab}>DOI</label>
              <input
                className={inp}
                value={entry.doi}
                onChange={(e) => onChange({ ...entry, doi: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className={lab}>URL</label>
              <input
                className={inp}
                value={entry.url}
                onChange={(e) => onChange({ ...entry, url: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={lab}>Ringkasan</label>
            <textarea
              rows={2}
              className={inp}
              value={entry.summary}
              onChange={(e) => onChange({ ...entry, summary: e.target.value })}
            />
          </div>
        </div>
      );
    default:
      return null;
  }
}
