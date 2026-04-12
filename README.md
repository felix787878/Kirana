# Kirana

**Kirana** adalah aplikasi web berbasis **Next.js** untuk membantu remaja usia **12–18 tahun** (termasuk yang tinggal di lingkungan panti asuhan di Indonesia) mengenal minat karier, merencanakan langkah belajar, dan menyusun CV sederhana. Antarmuka dan konten pengguna menggunakan **Bahasa Indonesia**.

## Apa saja yang bisa dilakukan?

- **Autentikasi** — Daftar dan masuk dengan **email & kata sandi** (Firebase Authentication).
- **Tes minat RIASEC** — **30 soal** pilihan ganda; skor dihitung per enam kategori (Realistik, Investigatif, Artistik, Sosial, Enterprising, Konvensional), lalu ditampilkan **dua kategori tertinggi** beserta **ide karier** yang selaras.
- **Generator peta jalan karier** — Mengirim nama, usia, dan kategori RIASEC utama ke **Google Gemini** lewat API route Next.js; hasil berupa teks rencana karier yang terstruktur.
- **Pembuat CV** — Form data diri, pratinjau satu halaman, dan **unduh PDF** (`@react-pdf/renderer`).

Data profil, hasil tes, dan isi CV disimpan di **Firestore** per pengguna (berdasarkan UID akun).

## Teknologi

| Bagian | Teknologi |
|--------|-----------|
| Framework | Next.js 14 (App Router), TypeScript |
| Gaya | Tailwind CSS |
| Backend / data | Firebase (Authentication + Firestore) |
| AI | Google Gemini API (`@google/generative-ai`) |
| PDF | `@react-pdf/renderer` |

## Prasyarat

- **Node.js** (disarankan LTS, misalnya 20.x)
- Akun **Google** untuk [Firebase Console](https://console.firebase.google.com/) dan [Google AI Studio](https://aistudio.google.com/) (kunci API Gemini)

## Cara menjalankan di komputer lokal

### 1. Pasang dependensi

Di folder proyek:

```bash
npm install
```

### 2. Konfigurasi lingkungan

Salin `.env.example` menjadi `.env.local`:

```bash
copy .env.example .env.local
```

Pada PowerShell bisa juga: `Copy-Item .env.example .env.local`

Isi variabel berikut:

**Firebase (wajib untuk login & penyimpanan data)**  
Ambil dari **Firebase Console** → Project Settings → bagian aplikasi web:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`  
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` — opsional (Analytics)

**Gemini (wajib untuk fitur peta jalan karier)**  

- `GEMINI_API_KEY` — buat di [Google AI Studio](https://aistudio.google.com/apikey) (kunci untuk **Google AI Studio**, bukan sekadar Vertex).  
- Opsional: `GEMINI_MODEL` — jika model bawaan gagal, contoh: `gemini-2.0-flash`.  
- Opsional: `GOOGLE_GENERATIVE_AI_API_KEY` — alias nama lain untuk kunci yang sama.

Setelah mengubah `.env.local`, **restart** server pengembangan.

### 3. Pengaturan Firebase yang perlu diaktifkan

1. **Authentication** → metode **Email/kata sandi** diaktifkan.  
2. **Firestore Database** — buat database (mode sesuai kebijakanmu; untuk pengembangan bisa mulai dari aturan terbatas lalu diperketat).  
3. Aturan keamanan Firestore contoh (hanya pengguna yang login yang boleh baca/tulis dokumen miliknya):

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

### 4. Jalankan mode pengembangan

```bash
npm run dev
```

Buka browser di **http://localhost:3000** (atau port yang ditampilkan di terminal).

### 5. Build produksi (opsional)

```bash
npm run build
npm start
```

## Skrip npm

| Perintah | Fungsi |
|----------|--------|
| `npm run dev` | Server pengembangan Next.js |
| `npm run build` | Build produksi |
| `npm run start` | Menjalankan hasil build |
| `npm run lint` | Pemeriksaan ESLint |

## Struktur utama proyek

```text
app/
  page.tsx                 # Beranda
  auth/page.tsx            # Login & daftar
  (protected)/             # Halaman setelah login (layout bersama)
    dashboard/, tes-minat/, hasil/, roadmap/, cv-maker/
  api/roadmap/route.ts     # Integrasi Gemini (server)
lib/
  firebase.ts              # Inisialisasi Firebase
  firestore.ts             # Baca/tulis dokumen pengguna
  questions.ts             # Bank soal RIASEC
  scoring.ts               # Perhitungan skor & rekomendasi
components/                # Komponen UI (auth, shell, PDF CV, dll.)
```

---
