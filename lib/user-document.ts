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

/** Dokumen `users/{uid}` di Firestore */
export type UserDocument = {
  name?: string;
  age?: number | null;
  riasecScores?: RiasecScores | null;
  topRiasecCodes?: RiasecCode[] | null;
  /** Kunci id soal sebagai string agar kompatibel dengan Firestore */
  testAnswers?: Record<string, string> | null;
  cv?: UserCvData | null;
  updatedAt?: unknown;
};
