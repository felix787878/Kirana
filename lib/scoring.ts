import {
  type RiasecCode,
  RIASEC_QUESTIONS,
  type Question,
} from "@/lib/questions";

export type RiasecScores = Record<RiasecCode, number>;

export const RIASEC_LABELS_ID: Record<RiasecCode, string> = {
  R: "Realistik",
  I: "Investigatif",
  A: "Artistik",
  S: "Sosial",
  E: "Enterprising",
  C: "Konvensional",
};

const CODES: RiasecCode[] = ["R", "I", "A", "S", "E", "C"];

export function emptyRiasecScores(): RiasecScores {
  return {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  };
}

const optionMetaByKey = new Map<
  string,
  { category: RiasecCode; value: number }
>();

function buildOptionLookup(): void {
  if (optionMetaByKey.size > 0) return;
  for (const q of RIASEC_QUESTIONS) {
    for (const opt of q.options) {
      optionMetaByKey.set(`${q.id}:${opt.id}`, {
        category: opt.category,
        value: opt.value,
      });
    }
  }
}

/**
 * Jawaban: map id soal → id opsi yang dipilih (mis. { 1: "1a", 2: "2b", ... }).
 * Setiap jawaban menambah skor sesuai bobot opsi (1..5) ke kategori terkait.
 */
export function scoreRiasecAnswers(
  answers: Record<number, string>
): RiasecScores {
  buildOptionLookup();
  const scores = emptyRiasecScores();

  for (const q of RIASEC_QUESTIONS) {
    const chosen = answers[q.id];
    if (!chosen) continue;
    const meta = optionMetaByKey.get(`${q.id}:${chosen}`);
    if (meta) scores[meta.category] += meta.value;
  }

  return scores;
}

export type RankedCategory = {
  code: RiasecCode;
  label: string;
  score: number;
};

/** Urutkan kategori dari skor tertinggi; skor sama diurutkan stabil R→I→A→S→E→C */
export function rankRiasecScores(scores: RiasecScores): RankedCategory[] {
  const orderIndex = (c: RiasecCode) => CODES.indexOf(c);
  return CODES.map((code) => ({
    code,
    label: RIASEC_LABELS_ID[code],
    score: scores[code],
  })).sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return orderIndex(a.code) - orderIndex(b.code);
  });
}

export function topRiasecCategories(
  scores: RiasecScores,
  count = 2
): RankedCategory[] {
  return rankRiasecScores(scores).slice(0, count);
}

/** Contoh rekomendasi karier singkat per kode RIASEC (bahasa Indonesia). */
export const CAREER_SUGGESTIONS_BY_CODE: Record<RiasecCode, string[]> = {
  R: [
    "Teknisi listrik/mesin",
    "Mekanik otomotif",
    "Operator alat berat",
    "Peternak / pertanian praktis",
    "Teknisi jaringan lapangan",
  ],
  I: [
    "Analis data / statistik",
    "Peneliti atau asisten laboratorium",
    "Programmer / pengembang perangkat lunak",
    "Apoteker atau teknologi farmasi",
    "Insinyur (sipil, industri, lingkungan)",
  ],
  A: [
    "Desainer grafis / UI",
    "Penulis / jurnalis konten",
    "Musisi / sound designer",
    "Animator / video editor",
    "Penata busana / fashion",
  ],
  S: [
    "Guru / fasilitator pembelajaran",
    "Konselor atau peer mentor",
    "Perawat atau tenaga kesehatan pendamping",
    "Pekerja sosial / aktivis komunitas",
    "Pelatih olahraga remaja",
  ],
  E: [
    "Wirausahawan / pemilik usaha kecil",
    "Marketing / brand ambassador",
    "Manajer proyek atau event",
    "Sales / perwakilan bisnis",
    "Politik muda / organisasi kepemimpinan",
  ],
  C: [
    "Staf administrasi / sekretaris",
    "Akuntan / pembukuan",
    "Analis keuangan pemula",
    "Staf gudang / logistik dokumen",
    "Quality control administratif",
  ],
};

export function careerSuggestionsForCodes(codes: RiasecCode[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const code of codes) {
    for (const job of CAREER_SUGGESTIONS_BY_CODE[code]) {
      if (!seen.has(job)) {
        seen.add(job);
        out.push(job);
      }
    }
  }
  return out;
}

export function validateAllQuestionsAnswered(
  answers: Record<number, string>
): { ok: true } | { ok: false; missing: number[] } {
  const missing: number[] = [];
  for (const q of RIASEC_QUESTIONS) {
    const v = answers[q.id];
    if (!v || !q.options.some((o) => o.id === v)) missing.push(q.id);
  }
  return missing.length === 0 ? { ok: true } : { ok: false, missing };
}

export function getQuestionById(id: number): Question | undefined {
  return RIASEC_QUESTIONS.find((q) => q.id === id);
}
