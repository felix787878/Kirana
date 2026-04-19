"use client";

import type { CvEntryKind, CvSection, CvSectionEntry, UserCvData } from "@/lib/user-document";
import { createEmptyEntry, createEmptySection, newCvId } from "@/lib/user-document";
import { CvEntryFormFields } from "./CvEntryFormFields";

const paperOuter =
  "mb-5 overflow-hidden rounded-md border border-slate-300/70 bg-white shadow-md ring-1 ring-slate-200/50";
const paperInp =
  "w-full border-0 bg-transparent py-1 text-[15px] text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:ring-0 text-right sm:text-left";
const btn =
  "rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100";
const selectInp =
  "max-w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none ring-teal-600 focus:ring-2";

const ADD_ENTRY_OPTIONS: { value: CvEntryKind; label: string }[] = [
  { value: "text", label: "Teks" },
  { value: "education", label: "Pendidikan" },
  { value: "experience", label: "Pengalaman" },
  { value: "publication", label: "Publikasi" },
  { value: "project", label: "Proyek" },
  { value: "one_line", label: "Satu baris (mis. keahlian)" },
  { value: "bullet_block", label: "Daftar bullet" },
  { value: "numbered_block", label: "Daftar bernomor" },
  { value: "reversed_numbered", label: "Daftar nomor terbalik" },
];

type Props = {
  data: UserCvData;
  onChange: (next: UserCvData) => void;
};

export function CvRichForm({ data, onChange }: Props) {
  function patch(partial: Partial<UserCvData>) {
    onChange({ ...data, ...partial });
  }

  function setSections(sections: CvSection[]) {
    onChange({ ...data, sections });
  }

  function updateSection(sectionId: string, fn: (s: CvSection) => CvSection) {
    setSections(data.sections.map((s) => (s.id === sectionId ? fn(s) : s)));
  }

  function updateEntry(sectionId: string, entryId: string, next: CvSectionEntry) {
    updateSection(sectionId, (s) => ({
      ...s,
      entries: s.entries.map((e) => (e.id === entryId ? next : e)),
    }));
  }

  function removeEntry(sectionId: string, entryId: string) {
    updateSection(sectionId, (s) => ({
      ...s,
      entries: s.entries.filter((e) => e.id !== entryId),
    }));
  }

  function addEntry(sectionId: string, kind: CvEntryKind) {
    updateSection(sectionId, (s) => ({
      ...s,
      entries: [...s.entries, createEmptyEntry(kind)],
    }));
  }

  function removeSection(sectionId: string) {
    setSections(data.sections.filter((s) => s.id !== sectionId));
  }

  return (
    <div className="max-h-[calc(100dvh-10rem)] space-y-1 overflow-y-auto pr-0.5 sm:max-h-[calc(100dvh-8rem)] xl:max-h-[calc(100dvh-6rem)]">
      <p className="px-1 pb-2 text-center text-xs text-slate-500 xl:hidden">Ubah data — format mirip lembar CV</p>

      <div className={paperOuter}>
        <div className="border-b border-slate-200 bg-slate-50/90 px-3 py-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-600">Data utama</h2>
        </div>
        <div className="divide-y divide-slate-200">
          <PaperRow label="Nama">
            <input
              className={paperInp}
              value={data.fullName}
              onChange={(e) => patch({ fullName: e.target.value })}
              placeholder="Nama lengkap"
            />
          </PaperRow>
          <PaperRow label="Judul">
            <input
              className={paperInp}
              value={data.headline}
              onChange={(e) => patch({ headline: e.target.value })}
              placeholder="Tagline atau posisi"
            />
          </PaperRow>
          <PaperRow label="Lokasi">
            <input
              className={paperInp}
              value={data.location}
              onChange={(e) => patch({ location: e.target.value })}
              placeholder="Kota, negara"
            />
          </PaperRow>
          <PaperRow label="Email">
            <input
              className={paperInp}
              type="email"
              autoComplete="email"
              value={data.email}
              onChange={(e) => patch({ email: e.target.value })}
              placeholder="email@contoh.com"
            />
          </PaperRow>
          <PaperRow label="Telepon">
            <input
              className={paperInp}
              type="tel"
              value={data.phone}
              onChange={(e) => patch({ phone: e.target.value })}
              placeholder="+62 …"
            />
          </PaperRow>
          <PaperRow label="Situs web">
            <input
              className={paperInp}
              value={data.website}
              onChange={(e) => patch({ website: e.target.value })}
              placeholder="https://"
            />
          </PaperRow>
          <PaperRow label="URL foto">
            <input
              className={paperInp}
              value={data.photoUrl}
              onChange={(e) => patch({ photoUrl: e.target.value })}
              placeholder="https://"
            />
          </PaperRow>

          <PaperBlockHeader
            label="Jaringan sosial"
            action={
              <button
                type="button"
                className={btn}
                onClick={() =>
                  patch({
                    socialNetworks: [...data.socialNetworks, { id: newCvId(), network: "", username: "" }],
                  })
                }
              >
                + Tambah
              </button>
            }
          >
            <div className="space-y-2">
              {data.socialNetworks.length === 0 ? (
                <p className="text-sm text-slate-400">Belum ada entri</p>
              ) : null}
              {data.socialNetworks.map((s) => (
                <div
                  key={s.id}
                  className="flex flex-col gap-2 border-t border-slate-100 pt-2 first:border-t-0 first:pt-0 sm:flex-row sm:items-center"
                >
                  <input
                    className={`${paperInp} rounded-md border border-transparent bg-slate-50/80 px-2 py-1.5 sm:max-w-[38%] sm:border-0 sm:bg-transparent sm:px-0`}
                    placeholder="LinkedIn, GitHub, …"
                    value={s.network}
                    onChange={(e) =>
                      patch({
                        socialNetworks: data.socialNetworks.map((x) =>
                          x.id === s.id ? { ...x, network: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <input
                    className={`${paperInp} flex-1 rounded-md border border-transparent bg-slate-50/80 px-2 py-1.5 sm:border-0 sm:bg-transparent sm:px-0`}
                    placeholder="Nama pengguna"
                    value={s.username}
                    onChange={(e) =>
                      patch({
                        socialNetworks: data.socialNetworks.map((x) =>
                          x.id === s.id ? { ...x, username: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    className={`${btn} shrink-0 self-end sm:self-center`}
                    onClick={() =>
                      patch({ socialNetworks: data.socialNetworks.filter((x) => x.id !== s.id) })
                    }
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </PaperBlockHeader>

          <PaperBlockHeader
            label="Koneksi kustom"
            action={
              <button
                type="button"
                className={btn}
                onClick={() =>
                  patch({
                    customConnections: [...data.customConnections, { id: newCvId(), label: "", value: "" }],
                  })
                }
              >
                + Tambah
              </button>
            }
          >
            <div className="space-y-2">
              {data.customConnections.length === 0 ? (
                <p className="text-sm text-slate-400">Belum ada entri</p>
              ) : null}
              {data.customConnections.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col gap-2 border-t border-slate-100 pt-2 first:border-t-0 first:pt-0 sm:flex-row sm:items-center"
                >
                  <input
                    className={`${paperInp} rounded-md border border-transparent bg-slate-50/80 px-2 py-1.5 sm:max-w-[34%] sm:border-0 sm:bg-transparent sm:px-0`}
                    placeholder="Label"
                    value={c.label}
                    onChange={(e) =>
                      patch({
                        customConnections: data.customConnections.map((x) =>
                          x.id === c.id ? { ...x, label: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <input
                    className={`${paperInp} flex-1 rounded-md border border-transparent bg-slate-50/80 px-2 py-1.5 sm:border-0 sm:bg-transparent sm:px-0`}
                    placeholder="Tautan atau teks"
                    value={c.value}
                    onChange={(e) =>
                      patch({
                        customConnections: data.customConnections.map((x) =>
                          x.id === c.id ? { ...x, value: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <button
                    type="button"
                    className={`${btn} shrink-0 self-end sm:self-center`}
                    onClick={() =>
                      patch({ customConnections: data.customConnections.filter((x) => x.id !== c.id) })
                    }
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </PaperBlockHeader>
        </div>
      </div>

      {data.sections.map((sec, si) => (
        <div key={sec.id} className={paperOuter}>
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50/90 px-3 py-2">
            <span className="text-[11px] font-medium text-slate-500">Bagian {si + 1}</span>
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-sm font-semibold text-slate-900 outline-none ring-0 focus:ring-0"
              value={sec.title}
              onChange={(e) => updateSection(sec.id, (s) => ({ ...s, title: e.target.value }))}
              placeholder="Judul bagian"
            />
            <button type="button" className={btn} onClick={() => removeSection(sec.id)}>
              Hapus bagian
            </button>
          </div>
          <div className="divide-y divide-slate-200">
            {sec.entries.map((en) => (
              <CvEntryFormFields
                key={en.id}
                entry={en}
                onChange={(next) => updateEntry(sec.id, en.id, next)}
                onRemove={() => removeEntry(sec.id, en.id)}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-slate-50/50 px-3 py-2.5">
            <span className="text-xs text-slate-500">Tambah entri</span>
            <select
              className={selectInp}
              defaultValue=""
              onChange={(e) => {
                const v = e.target.value as CvEntryKind;
                if (v) addEntry(sec.id, v);
                e.target.value = "";
              }}
            >
              <option value="">— pilih jenis —</option>
              {ADD_ENTRY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="w-full rounded-md border border-dashed border-teal-300/80 bg-teal-50/60 py-3 text-sm font-semibold text-teal-900 shadow-sm hover:bg-teal-50"
        onClick={() => setSections([...data.sections, createEmptySection()])}
      >
        + Bagian baru
      </button>
    </div>
  );
}

function PaperRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 px-3 py-2.5 sm:grid-cols-[minmax(108px,34%)_1fr] sm:items-center sm:gap-5 sm:py-3">
      <span className="pt-0.5 text-[13px] leading-snug text-slate-500">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function PaperBlockHeader({
  label,
  action,
  children,
}: {
  label: string;
  action: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="px-3 py-2.5 sm:py-3">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
        <span className="text-[13px] text-slate-500">{label}</span>
        <div className="shrink-0">{action}</div>
      </div>
      <div className="pt-2.5">{children}</div>
    </div>
  );
}
