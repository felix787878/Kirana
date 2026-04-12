import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  ...(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    ? { measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }
    : {}),
};

function assertFirebaseConfig(): void {
  const required: (keyof typeof firebaseConfig)[] = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];
  const missing = required.filter((k) => !firebaseConfig[k]);
  if (missing.length > 0) {
    const names: Record<keyof typeof firebaseConfig, string> = {
      apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
      authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
      projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
      storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
      messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
      measurementId: "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
    };
    throw new Error(
      `Firebase belum dikonfigurasi. Atur: ${missing.map((k) => names[k]).join(", ")}`
    );
  }
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!getApps().length) {
    assertFirebaseConfig();
    app = initializeApp(firebaseConfig);
  }
  return app ?? getApps()[0]!;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirebaseFirestore(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}
