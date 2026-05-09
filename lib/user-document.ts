import type { RiasecCode } from "@/lib/questions";
import type { RiasecScores } from "@/lib/scoring";
import type { UserCvData } from "./kirana-cv-model";

export type {
  CvBulletBlock,
  CvConnection,
  CvEducation,
  CvEntryKind,
  CvExperience,
  CvNumberedBlock,
  CvOneLine,
  CvProject,
  CvPublication,
  CvReversedNumberedBlock,
  CvSection,
  CvSectionEntry,
  CvSocial,
  CvTextBlock,
  LegacyFlatCv,
  UserCvData,
} from "./kirana-cv-model";

export {
  createEmptyEntry,
  createEmptySection,
  CV_SCHEMA_VERSION,
  getDefaultCvDocument,
  migrateLegacyCvToV2,
  newCvId,
  normalizeUserCv,
  sanitizeCvDocument,
} from "./kirana-cv-model";

/** Narasi diri pengguna — opsional, untuk personalisasi roadmap AI */
export type NarrativeSelf = {
  /** Hal yang orang lain tidak tahu tentang kamu */
  hiddenTrait?: string;
  /** Aktivitas yang bikin kamu lupa waktu */
  flowActivity?: string;
  /** Siapa yang ingin kamu bantu dan kenapa */
  helpTarget?: string;
};

export type RiasecTestHistoryEntry = {
  /** epoch ms */
  createdAtMs: number;
  scores: RiasecScores;
  topCodes: RiasecCode[];
  /** Kunci id soal sebagai string agar kompatibel dengan Firestore */
  testAnswers?: Record<string, string> | null;
};

export type RoadmapHistoryEntry = {
  /** epoch ms */
  createdAtMs: number;
  topCodes: RiasecCode[];
  age: number;
  text: string;
};

/** Dokumen `users/{uid}` di Firestore */
export type UserDocument = {
  name?: string;
  age?: number | null;
  riasecScores?: RiasecScores | null;
  topRiasecCodes?: RiasecCode[] | null;
  /** Kunci id soal sebagai string agar kompatibel dengan Firestore */
  testAnswers?: Record<string, string> | null;
  /** Histori 5 hasil tes terbaru (paling baru di depan) */
  riasecHistory?: RiasecTestHistoryEntry[] | null;
  /** Histori mindmap/roadmap yang pernah di-generate */
  roadmapHistory?: RoadmapHistoryEntry[] | null;
  cv?: UserCvData | null;
  /** Narasi diri untuk personalisasi saran AI */
  narrativeSelf?: NarrativeSelf | null;
  updatedAt?: unknown;
};
