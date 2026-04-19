import type { RiasecCode } from "@/lib/questions";
import { HOLLAND_RIASEC_REFERENCE_EN } from "@/lib/riasec-holland-reference-en";
import { RIASEC_LABELS_ID } from "@/lib/scoring";

/**
 * Menyusun blok referensi Holland/RIASEC (bahasa Inggris) untuk prompt roadmap.
 * Hanya menyertakan tipe yang dipilih pengguna (1–3), menghemat token.
 */
export function formatRiasecCareerHintsForPrompt(codes: readonly RiasecCode[]): string {
  const ordered = Array.from(new Set(codes)) as RiasecCode[];
  const sections = ordered.map((code) => {
    const label = RIASEC_LABELS_ID[code];
    const body = HOLLAND_RIASEC_REFERENCE_EN[code];
    return `--- Holland Code reference (English) for ${code} (${label}) ---\n${body}`;
  });

  return [
    "PRIMARY CAREER REFERENCE (mandatory): Use ONLY the following Holland Code material as the basis for career fit, 'best/worst' considerations, and secondary-type combinations. The user's profile codes are given in priority order: first = primary Holland type, second = secondary, third = tertiary — apply the 'secondary type' paragraphs by matching the user's 2nd and 3rd codes to the English text (e.g. if codes are I then A, use Investigative + Artistic secondary guidance).",
    "Translate and adapt examples to Indonesian context, teen-appropriate options, and realistic local pathways; the final answer stays in Bahasa Indonesia. Do not invent unrelated career theory beyond this reference.",
    ...sections,
  ].join("\n\n");
}
