"use client";

import type { CvSectionEntry, UserCvData } from "@/lib/user-document";

const accent = "#0b3b66";

function RichParagraph({ text, as: Tag = "p" }: { text: string; as?: "p" | "span" }) {
  if (!text.trim())
    return Tag === "span" ? (
      <span className="text-sm text-slate-400">—</span>
    ) : (
      <p className="text-sm text-slate-400">—</p>
    );
  const segments = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  const className = "whitespace-pre-wrap text-[9.5pt] leading-relaxed text-slate-800";
  return (
    <Tag className={Tag === "span" ? `block ${className}` : className}>
      {segments.map((seg, i) => {
        if (seg.startsWith("**") && seg.endsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-slate-900">
              {seg.slice(2, -2)}
            </strong>
          );
        }
        if (seg.startsWith("*") && seg.endsWith("*") && seg.length > 2) {
          return (
            <em key={i} className="italic text-slate-700">
              {seg.slice(1, -1)}
            </em>
          );
        }
        const urlMatch = seg.match(/https?:\/\/[^\s]+/g);
        if (urlMatch) {
          const bits = seg.split(/(https?:\/\/[^\s]+)/g);
          return (
            <span key={i}>
              {bits.map((b, j) =>
                /^https?:\/\//.test(b) ? (
                  <a
                    key={j}
                    href={b}
                    className="text-[#0b3b66] underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {b}
                  </a>
                ) : (
                  b
                )
              )}
            </span>
          );
        }
        return <span key={i}>{seg}</span>;
      })}
    </Tag>
  );
}

function EntryView({ entry }: { entry: CvSectionEntry }) {
  switch (entry.kind) {
    case "text":
      return <RichParagraph text={entry.body} />;
    case "one_line":
      return (
        <p className="text-[9.5pt] leading-relaxed text-slate-800">
          {entry.label ? (
            <span className="font-semibold text-slate-900">{entry.label}: </span>
          ) : null}
          {entry.details}
        </p>
      );
    case "bullet_block":
      return (
        <ul className="list-disc space-y-1 pl-5 text-[9.5pt] text-slate-800">
          {entry.items.filter(Boolean).map((t, i) => (
            <li key={i} className="leading-relaxed">
              <RichParagraph text={t} as="span" />
            </li>
          ))}
        </ul>
      );
    case "numbered_block":
      return (
        <ol className="list-decimal space-y-1 pl-5 text-[9.5pt] text-slate-800">
          {entry.items.filter(Boolean).map((t, i) => (
            <li key={i} className="leading-relaxed">
              <RichParagraph text={t} as="span" />
            </li>
          ))}
        </ol>
      );
    case "reversed_numbered": {
      const items = entry.items.filter(Boolean);
      const n = items.length;
      return (
        <ol className="list-none space-y-1 pl-0 text-[9.5pt] text-slate-800">
          {items.map((t, i) => (
            <li key={i} className="flex gap-2 leading-relaxed">
              <span className="w-6 shrink-0 font-medium text-slate-600">{n - i}.</span>
              <span>
                <RichParagraph text={t} as="span" />
              </span>
            </li>
          ))}
        </ol>
      );
    }
    case "education":
      return (
        <div className="mb-4">
          <p className="text-[10pt] font-bold text-slate-900">
            {entry.institution}
            {entry.degree ? ` — ${entry.degree}` : ""}
            {entry.area ? `, ${entry.area}` : ""}
          </p>
          <p className="text-[9pt] text-slate-500">
            {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
            {entry.location ? ` · ${entry.location}` : ""}
          </p>
          {entry.summary ? <RichParagraph text={entry.summary} /> : null}
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[9.5pt] text-slate-800">
            {entry.highlights.filter(Boolean).map((h, i) => (
              <li key={i}>
                <RichParagraph text={h} as="span" />
              </li>
            ))}
          </ul>
        </div>
      );
    case "experience":
      return (
        <div className="mb-4">
          <p className="text-[10pt] font-bold text-slate-900">
            {entry.company}
            {entry.position ? ` — ${entry.position}` : ""}
          </p>
          <p className="text-[9pt] text-slate-500">
            {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
            {entry.location ? ` · ${entry.location}` : ""}
          </p>
          {entry.summary ? <RichParagraph text={entry.summary} /> : null}
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[9.5pt] text-slate-800">
            {entry.highlights.filter(Boolean).map((h, i) => (
              <li key={i}>
                <RichParagraph text={h} as="span" />
              </li>
            ))}
          </ul>
        </div>
      );
    case "project":
      return (
        <div className="mb-4">
          <p className="text-[10pt] font-bold text-slate-900">{entry.name}</p>
          <p className="text-[9pt] text-slate-500">
            {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
            {entry.location ? ` · ${entry.location}` : ""}
          </p>
          {entry.summary ? <RichParagraph text={entry.summary} /> : null}
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[9.5pt] text-slate-800">
            {entry.highlights.filter(Boolean).map((h, i) => (
              <li key={i}>
                <RichParagraph text={h} as="span" />
              </li>
            ))}
          </ul>
        </div>
      );
    case "publication":
      return (
        <div className="mb-4">
          <p className="text-[10pt] font-bold text-slate-900">{entry.title}</p>
          <p className="text-[9.5pt] italic text-slate-600">
            {entry.authors.filter(Boolean).join(", ")}
          </p>
          <p className="text-[9.5pt] text-slate-800">
            {entry.doi ? `${entry.doi} · ` : ""}
            {entry.journal}
            {entry.date ? ` · ${entry.date}` : ""}
          </p>
          {entry.url && entry.url !== "https://" ? (
            <a href={entry.url} className="text-[9pt] text-[#0b3b66] underline" target="_blank" rel="noreferrer">
              {entry.url}
            </a>
          ) : null}
        </div>
      );
    default:
      return null;
  }
}

export function CvPaperPreview({ data }: { data: UserCvData }) {
  const contacts = [data.location, data.email, data.phone, data.website].filter(Boolean);
  const socials = data.socialNetworks.filter((s) => s.network && s.username);
  const customs = data.customConnections.filter((c) => c.label && c.value);

  return (
    <div className="sticky top-4 max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-xl border border-slate-200 bg-slate-100/90 p-2 shadow-inner sm:p-4 xl:max-h-[calc(100dvh-5rem)]">
      <p className="mb-2 text-center text-xs text-slate-500 xl:mb-3">Pratinjau kertas (gulir)</p>
      <div className="mx-auto w-full max-w-none bg-white shadow-lg ring-1 ring-slate-200/80">
        <div
          className="box-border min-h-[min(297mm,100dvh)] w-full max-w-none px-[clamp(10mm,4vw,14mm)] py-[clamp(8mm,3vw,12mm)] text-black sm:min-h-[297mm]"
          style={{ fontFamily: "system-ui, Segoe UI, sans-serif" }}
        >
          <p className="text-right text-[8pt] italic text-slate-400">
            Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { month: "short", year: "numeric" })}
          </p>
          <h1 className="pt-1 text-center text-[22pt] font-bold tracking-tight" style={{ color: accent }}>
            {data.fullName || "Nama"}
          </h1>
          {data.headline ? (
            <p className="mt-1 text-center text-[10.5pt]" style={{ color: accent }}>
              {data.headline}
            </p>
          ) : null}
          {contacts.length ? (
            <p className="mt-3 text-center text-[9pt] leading-relaxed text-slate-600">{contacts.join(" · ")}</p>
          ) : null}
          {socials.length ? (
            <p className="mt-1 text-center text-[9pt] text-slate-600">
              {socials.map((s) => `${s.network}: ${s.username}`).join(" · ")}
            </p>
          ) : null}
          {customs.length ? (
            <p className="mt-1 text-center text-[9pt] text-slate-600">
              {customs.map((c) => `${c.label}: ${c.value}`).join(" · ")}
            </p>
          ) : null}

          <div className="mt-8 space-y-6">
            {data.sections.map((sec) => (
              <section key={sec.id}>
                <h2 className="text-[10.5pt] font-bold" style={{ color: accent }}>
                  {sec.title || "Bagian"}
                </h2>
                <div className="mt-1 h-px w-full" style={{ backgroundColor: accent, opacity: 0.35 }} />
                <div className="mt-3 space-y-3">
                  {sec.entries.map((en) => (
                    <EntryView key={en.id} entry={en} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 text-center text-[8pt] italic text-slate-400">
            {data.fullName || "Nama"} — pratinjau Kirana
          </p>
        </div>
      </div>
    </div>
  );
}
