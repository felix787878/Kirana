# Kirana

**Kirana** adalah aplikasi web berbasis **Next.js 14** untuk membantu remaja **12–18 tahun** mengenal minat karier (tes **RIASEC**), mendapat **saran langkah belajar** lewat AI, dan menyusun **CV** sederhana dengan unduhan PDF.

## Fitur

- **Tes minat RIASEC** — soal Likert, skor per kategori, dan ringkasan hasil.
- **Saran langkah belajar / peta jalan** — dihasilkan lewat **OpenRouter**. Output bersifat usulan, pengguna didorong mendiskusikannya dengan **pihak yang berwenang** (pembina, guru, atau wali).
- **CV Builder** — input ringkas, pratinjau, unduh PDF.

Data profil, hasil tes, dan data CV disimpan di **Firestore**.

## Prasyarat

- **Node.js** LTS (misalnya 20.x) dan **npm**
- Akun **Google** untuk [Firebase Console](https://console.firebase.google.com/)
- Akun **OpenRouter** untuk [kunci API](https://openrouter.ai/keys)

## Menjalankan secara lokal

### 1. Dependensi

```bash
npm install
```

### 2. Variabel lingkungan

Salin `.env.example` ke `.env.local` (PowerShell: `Copy-Item .env.example .env.local`), lalu isi:

**Firebase (wajib untuk login & penyimpanan)** — dari Firebase Console → Project settings → aplikasi web:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` — opsional (Analytics)

**OpenRouter (wajib untuk `/api/roadmap`)**

- `OPENROUTER_API_KEY` — dari [OpenRouter Keys](https://openrouter.ai/keys)
- Opsional: `OPENROUTER_MODEL` — contoh: `openai/gpt-4o-mini` (lihat [daftar model](https://openrouter.ai/models))
- Opsional: `OPENROUTER_BASE_URL`, `OPENROUTER_HTTP_REFERER`, `OPENROUTER_APP_TITLE` — lihat komentar di `.env.example`

Setelah mengubah `.env.local`, **restart** `npm run dev`.

### 3. Firebase

1. **Authentication** — aktifkan metode **Email/kata sandi**.
2. **Firestore** — buat database; aturan contoh agar user hanya mengakses dokumen miliknya:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Dev server

```bash
npm run dev
```

Buka **http://localhost:3000** (atau port yang ditampilkan terminal).

### 5. Build produksi

```bash
npm run build
npm start
```

## Skrip npm

| Perintah        | Fungsi                    |
|-----------------|---------------------------|
| `npm run dev`   | Server pengembangan      |
| `npm run build` | Build produksi           |
| `npm run start` | Menjalankan hasil build  |
| `npm run lint`  | ESLint                    |

## UX navigasi & memuat

- **`app/loading.tsx`** — layar memuat awal aplikasi.
- **`app/(protected)/loading.tsx`** — memuat cepat saat pindah antar halaman setelah login (dashboard, tes, hasil, roadmap, CV).
- **`app/auth/loading.tsx`** — memuat saat masuk rute login/daftar.
- **`NavigationProgress`** — bilah tipis di atas layar saat menekan tautan navigasi internal, agar respons terasa lebih cepat sebelum konten rute siap.

## Struktur utama proyek

```text
app/
  page.tsx                    # Beranda publik
  loading.tsx                 # Memuat awal
  auth/                       # Login & daftar (+ loading)
  (protected)/                # Area setelah login (+ loading segment)
    layout.tsx                # AuthedShell + AuthGuard
    dashboard/, tes-minat/, hasil/, roadmap/, cv-maker/
  api/roadmap/route.ts        # Saran langkah belajar via OpenRouter (server)
lib/
  firebase.ts, firestore.ts
  questions.ts                # Bank soal RIASEC
  scoring.ts                  # Skor & label kategori
components/
  AuthProvider, AuthGuard, AuthedShell, AppHeader
  NavigationProgress.tsx      # Indikator navigasi
  ui/                         # Loader, dll.
```

---
