"use client";

import {
  isValidElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import type { Options as SanitizeOptions } from "rehype-sanitize";

const extraTableTags = ["table", "thead", "tbody", "tr", "th", "td"] as const;
const sanitizeSchema: SanitizeOptions = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), ...extraTableTags],
};

let mermaidLib: Promise<typeof import("mermaid").default> | null = null;

function loadMermaid() {
  if (!mermaidLib) {
    mermaidLib = import("mermaid").then((mod) => {
      const m = mod.default;
      m.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          primaryColor: "#99f6e4",
          primaryTextColor: "#042f2e",
          primaryBorderColor: "#0f766e",
          lineColor: "#44403c",
          secondaryColor: "#d1fae5",
          tertiaryColor: "#fafaf9",
          background: "#ffffff",
          mainBkg: "#ccfbf1",
          nodeBorder: "#0d9488",
          clusterBkg: "#ecfdf5",
        },
        // "strict" sering memblokir label node / subgraph dari LLM; loose lebih toleran.
        securityLevel: "loose",
        fontFamily: "var(--font-sans), system-ui, sans-serif",
      });
      return m;
    });
  }
  return mermaidLib;
}

/** Fallback: server Next mem-proxy ke Kroki (hindari CORS + lebih andal di browser). */
async function renderMermaidViaKroki(chart: string): Promise<string | null> {
  const body = chart.trim();
  if (!body) return null;
  try {
    const r = await fetch("/api/mermaid-svg", {
      method: "POST",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body,
    });
    if (!r.ok) return null;
    const t = await r.text();
    if (!t.trimStart().toLowerCase().startsWith("<svg")) return null;
    return t;
  } catch {
    return null;
  }
}

function MermaidBlock({ chart }: { chart: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    host.replaceChildren();
    setErr(null);

    (async () => {
      const trimmed = chart.trim();
      if (!trimmed) {
        if (!cancelled) setErr("Diagram kosong.");
        return;
      }
      try {
        const mermaid = await loadMermaid();
        if (cancelled || !hostRef.current) return;
        const id = `mmd-${baseId}-${Math.random().toString(36).slice(2, 10)}`;
        const { svg } = await mermaid.render(id, trimmed);
        if (!cancelled && hostRef.current) {
          hostRef.current.innerHTML = svg;
        }
      } catch (firstErr) {
        const fromKroki = await renderMermaidViaKroki(trimmed);
        if (!cancelled && hostRef.current && fromKroki) {
          hostRef.current.innerHTML = fromKroki;
          return;
        }
        if (!cancelled) {
          const msg =
            firstErr instanceof Error ? firstErr.message : String(firstErr);
          setErr(
            `${msg} — cadangan server (Kroki) tidak mengembalikan SVG; periksa koneksi atau blok jaringan.`
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [chart, baseId]);

  if (err) {
    return (
      <figure
        className="my-5 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 shadow-sm"
        role="group"
        aria-label="Diagram tidak dapat ditampilkan"
      >
        <figcaption className="font-semibold">Diagram tidak valid</figcaption>
        <p className="mt-1 text-xs leading-relaxed opacity-90">{err}</p>
        <pre className="mt-2 max-h-36 overflow-auto rounded-lg bg-white/90 p-2 font-mono text-[11px] leading-snug text-stone-600">
          {chart.trim()}
        </pre>
      </figure>
    );
  }

  return (
    <figure
      className="my-5 overflow-hidden rounded-xl border border-teal-200/90 bg-gradient-to-b from-white to-teal-50/30 p-3 shadow-sm ring-1 ring-stone-100"
      role="presentation"
    >
      <div
        ref={hostRef}
        className="flex min-h-[120px] justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-h-[420px] [&_svg]:max-w-full"
      />
    </figure>
  );
}

/** Awal baris yang umum dipakai Mermaid (LLM sering lupa menulis ```mermaid). */
const MERMAID_FIRST_LINE =
  /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram-v2|stateDiagram|erDiagram|gantt|pie|gitGraph|journey|requirement|mindmap|timeline|C4Context|C4Container|block-beta|sankey-beta)\b/i;

/** Lewati baris kosong & komentar Mermaid `%%` / `%%{init: ...` */
function firstMeaningfulLine(src: string): string {
  for (const line of src.split(/\r?\n/)) {
    const t = line.trim();
    if (t.length === 0) continue;
    if (t.startsWith("%%")) continue;
    return t;
  }
  return "";
}

function looksLikeMermaidSource(src: string): boolean {
  return MERMAID_FIRST_LINE.test(firstMeaningfulLine(src));
}

/**
 * Cari teks diagram di dalam pohon `pre` (fenced code, komponen `code` custom,
 * atau `code` intrinsik tanpa bahasa tapi isinya seperti Mermaid).
 */
function findMermaidSourceInPreTree(node: ReactNode): string | null {
  if (node == null || typeof node === "boolean") return null;
  if (typeof node === "string" || typeof node === "number") return null;
  if (Array.isArray(node)) {
    for (const x of node) {
      const v = findMermaidSourceInPreTree(x);
      if (v) return v;
    }
    return null;
  }
  if (!isValidElement(node)) return null;

  const props = node.props as { className?: string; children?: ReactNode };
  const cls = props.className ?? "";
  const raw = String(props.children ?? "").replace(/\n$/, "");
  const lang = (/language-([\w-]*)/i.exec(cls)?.[1] ?? "").toLowerCase();

  const isLikelyBlockCode =
    node.type === "code" ||
    (typeof cls === "string" && cls.includes("language-"));

  if (isLikelyBlockCode) {
    if (lang === "mermaid") return raw;
    if (looksLikeMermaidSource(raw)) return raw;
  }

  return findMermaidSourceInPreTree(props.children);
}

function getMermaidChartFromPre(children: ReactNode): string | null {
  return findMermaidSourceInPreTree(children);
}

export function RoadmapMarkdown({ content }: { content: string }) {
  return (
    <div className="roadmap-markdown space-y-4 text-[0.9375rem] leading-relaxed text-stone-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-6 border-b border-teal-100 pb-2 text-xl font-bold tracking-tight text-teal-950 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 border-b border-stone-200 pb-1.5 text-lg font-semibold text-teal-900 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-5 text-base font-semibold text-stone-900">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[0.9375rem] leading-relaxed text-stone-700">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-3 list-disc space-y-1.5 pl-5 marker:text-teal-600">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-3 list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-teal-700">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-4 rounded-r-xl border-l-4 border-teal-500 bg-teal-50/60 px-4 py-2.5 text-stone-700 shadow-sm">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-8 border-0 border-t border-dashed border-stone-200" />
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-stone-900">{children}</strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-medium text-teal-800 underline decoration-teal-300 underline-offset-2 transition hover:text-teal-950"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-sm">
              <table className="w-full min-w-[280px] border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-teal-50/90 text-teal-950">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-stone-100 last:border-0">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2.5 font-semibold">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2.5 text-stone-700">{children}</td>
          ),
          pre: ({ children }) => {
            const mermaidSrc = getMermaidChartFromPre(children);
            if (mermaidSrc !== null) {
              return <MermaidBlock chart={mermaidSrc} />;
            }
            return (
              <pre className="my-4 overflow-x-auto rounded-xl bg-stone-900 p-4 text-sm text-stone-100 shadow-inner">
                {children}
              </pre>
            );
          },
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(
              className && String(className).includes("language-")
            );
            if (isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-[0.85em] text-teal-900 ring-1 ring-stone-200/80"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
