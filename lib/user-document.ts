import type { RiasecCode } from "@/lib/questions";
import type { RiasecScores } from "@/lib/scoring";

export type UserCvData = {
  fullName: string;
  age: string;
  school: string;
  hobbies: string;
  organization: string;
  contact: string;
};

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
