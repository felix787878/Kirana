import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@/lib/firebase";
import type { RiasecCode } from "@/lib/questions";
import type { RiasecScores } from "@/lib/scoring";
import type { UserCvData, UserDocument, NarrativeSelf } from "@/lib/user-document";

export const USERS_COLLECTION = "users";

export function userDocRef(uid: string) {
  return doc(getFirebaseFirestore(), USERS_COLLECTION, uid);
}

export async function fetchUserDocument(uid: string): Promise<UserDocument | null> {
  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) return null;
  return snap.data() as UserDocument;
}

export function subscribeUserDocument(
  uid: string,
  onData: (data: UserDocument | null) => void
): () => void {
  return onSnapshot(userDocRef(uid), (snap) => {
    if (!snap.exists()) {
      onData(null);
      return;
    }
    onData(snap.data() as UserDocument);
  });
}

export async function mergeUserDocument(
  uid: string,
  partial: Partial<UserDocument>
): Promise<void> {
  await setDoc(
    userDocRef(uid),
    { ...partial, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function saveRiasecTestResult(
  uid: string,
  payload: {
    scores: RiasecScores;
    topCodes: RiasecCode[];
    answers: Record<number, string>;
  }
): Promise<void> {
  const testAnswers: Record<string, string> = {};
  for (const [k, v] of Object.entries(payload.answers)) {
    testAnswers[String(k)] = v;
  }
  await mergeUserDocument(uid, {
    riasecScores: payload.scores,
    topRiasecCodes: payload.topCodes,
    testAnswers,
  });
}

export async function saveProfileBasics(
  uid: string,
  name: string,
  age: number | null
): Promise<void> {
  await mergeUserDocument(uid, { name, age });
}

export async function saveCvData(uid: string, cv: UserCvData): Promise<void> {
  await mergeUserDocument(uid, { cv });
}

export function answersToNumericRecord(
  raw: Record<string, string> | null | undefined
): Record<number, string> {
  if (!raw) return {};
  const out: Record<number, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    const n = Number(k);
    if (!Number.isNaN(n)) out[n] = v;
  }
  return out;
}

export async function saveNarrativeSelf(
  uid: string,
  narrative: NarrativeSelf
): Promise<void> {
  await mergeUserDocument(uid, { narrativeSelf: narrative });
}
