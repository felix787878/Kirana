export type RiasecCode = "R" | "I" | "A" | "S" | "E" | "C";

export type QuestionOption = {
  id: string;
  text: string;
  category: RiasecCode;
};

export type Question = {
  id: number;
  prompt: string;
  options: QuestionOption[];
};

/**
 * 30 soal pilihan ganda RIASEC (bahasa Indonesia).
 * Setiap jawaban menambah skor pada satu kategori.
 */
export const RIASEC_QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "Kegiatan mana yang paling kamu nikmati di waktu luang?",
    options: [
      { id: "1a", text: "Memperbaiki barang rusak atau merakit model", category: "R" },
      { id: "1b", text: "Membaca tentang penemuan atau eksperimen sains", category: "I" },
      { id: "1c", text: "Menggambar, menulis cerita, atau bermain musik", category: "A" },
      { id: "1d", text: "Ngobrol mendalam dan membantu teman cerita", category: "S" },
    ],
  },
  {
    id: 2,
    prompt: "Di kelompok tugas, peran mana yang paling cocok untukmu?",
    options: [
      { id: "2a", text: "Menyiapkan data, jadwal, dan memastikan rapi", category: "C" },
      { id: "2b", text: "Mempresentasikan ide di depan kelas", category: "E" },
      { id: "2c", text: "Mendengarkan semua pihak dan meredakan konflik", category: "S" },
      { id: "2d", text: "Mencari fakta dan memverifikasi informasi", category: "I" },
    ],
  },
  {
    id: 3,
    prompt: "Mata pelajaran mana yang biasanya paling menarik bagimu?",
    options: [
      { id: "3a", text: "Olahraga, praktik kerja, atau keterampilan tangan", category: "R" },
      { id: "3b", text: "Matematika, IPA, atau logika", category: "I" },
      { id: "3c", text: "Seni, bahasa, atau sastra", category: "A" },
      { id: "3d", text: "PKn, IPS sosial, atau bimbingan konseling", category: "S" },
    ],
  },
  {
    id: 4,
    prompt: "Kamu lebih bangga ketika…",
    options: [
      { id: "4a", text: "Berhasil menjual ide atau mengajak orang ikut", category: "E" },
      { id: "4b", text: "Menyelesaikan laporan tanpa kesalahan kecil", category: "C" },
      { id: "4c", text: "Membuat karya yang terlihat orisinal", category: "A" },
      { id: "4d", text: "Membantu seseorang merasa lebih percaya diri", category: "S" },
    ],
  },
  {
    id: 5,
    prompt: "Lingkungan kerja impianmu lebih condong ke…",
    options: [
      { id: "5a", text: "Bengkel, lapangan, atau studio praktik", category: "R" },
      { id: "5b", text: "Laboratorium atau ruang riset tenang", category: "I" },
      { id: "5c", text: "Kantor terstruktur dengan prosedur jelas", category: "C" },
      { id: "5d", text: "Ruang meeting dan interaksi bisnis", category: "E" },
    ],
  },
  {
    id: 6,
    prompt: "Tantangan seperti apa yang kamu sukai?",
    options: [
      { id: "6a", text: "Memecahkan teka-teki atau analisis data", category: "I" },
      { id: "6b", text: "Memimpin tim menuju target", category: "E" },
      { id: "6c", text: "Merancang tampilan atau konsep baru", category: "A" },
      { id: "6d", text: "Memperbaiki mesin atau peralatan", category: "R" },
    ],
  },
  {
    id: 7,
    prompt: "Kata yang paling menggambarkan dirimu:",
    options: [
      { id: "7a", text: "Penolong", category: "S" },
      { id: "7b", text: "Teratur", category: "C" },
      { id: "7c", text: "Berani ambil risiko", category: "E" },
      { id: "7d", text: "Penyelidik", category: "I" },
    ],
  },
  {
    id: 8,
    prompt: "Kamu lebih nyaman belajar dengan cara…",
    options: [
      { id: "8a", text: "Praktik langsung dan mencoba sendiri", category: "R" },
      { id: "8b", text: "Membaca teori lalu menguji hipotesis", category: "I" },
      { id: "8c", text: "Berdiskusi dan belajar dari cerita orang", category: "S" },
      { id: "8d", text: "Mengikuti langkah-langkah yang sudah jelas", category: "C" },
    ],
  },
  {
    id: 9,
    prompt: "Proyek mana yang paling membuatmu semangat?",
    options: [
      { id: "9a", text: "Pameran seni, drama, atau konten kreatif", category: "A" },
      { id: "9b", text: "Kampanye sosial atau penggalangan dana", category: "E" },
      { id: "9c", text: "Program mentoring untuk adik kelas", category: "S" },
      { id: "9d", text: "Inventarisasi dan sistem penyimpanan barang", category: "C" },
    ],
  },
  {
    id: 10,
    prompt: "Saat ada masalah teknis (misalnya lampu mati), kamu biasanya…",
    options: [
      { id: "10a", text: "Ingin mencoba perbaiki sendiri", category: "R" },
      { id: "10b", text: "Mencari tahu penyebabnya secara logis", category: "I" },
      { id: "10c", text: "Meminta bantuan sambil belajar dari orang lain", category: "S" },
      { id: "10d", text: "Mencatat langkah dan memastikan aman", category: "C" },
    ],
  },
  {
    id: 11,
    prompt: "Hal mana yang paling membuatmu bosan?",
    options: [
      { id: "11a", text: "Kerja monoton tanpa ide baru", category: "A" },
      { id: "11b", text: "Terlalu banyak teori tanpa praktik", category: "R" },
      { id: "11c", text: "Diskusi tanpa keputusan atau tindakan", category: "E" },
      { id: "11d", text: "Kerja tanpa aturan atau dokumentasi", category: "C" },
    ],
  },
  {
    id: 12,
    prompt: "Jika punya klub di sekolah, kamu lebih tertarik…",
    options: [
      { id: "12a", text: "Klub robotik atau otomotif", category: "R" },
      { id: "12b", text: "Klub debat atau kewirausahaan", category: "E" },
      { id: "12c", text: "Klub literasi atau teater", category: "A" },
      { id: "12d", text: "Klub relawan komunitas", category: "S" },
    ],
  },
  {
    id: 13,
    prompt: "Gaya memutuskan yang paling kamu pakai:",
    options: [
      { id: "13a", text: "Mengandalkan data dan bukti", category: "I" },
      { id: "13b", text: "Mendengar perasaan dan kebutuhan orang", category: "S" },
      { id: "13c", text: "Mengikuti prosedur dan kebijakan", category: "C" },
      { id: "13d", text: "Memilih yang paling menguntungkan tujuan besar", category: "E" },
    ],
  },
  {
    id: 14,
    prompt: "Kamu lebih suka menghabiskan waktu untuk…",
    options: [
      { id: "14a", text: "Mendesain poster atau konten visual", category: "A" },
      { id: "14b", text: "Berkebun, memasak, atau kerajinan tangan", category: "R" },
      { id: "14c", text: "Mengorganisir spreadsheet atau daftar", category: "C" },
      { id: "14d", text: "Berdiskusi tentang isu sosial", category: "S" },
    ],
  },
  {
    id: 15,
    prompt: "Target karier jangka panjang yang menggambarkanmu:",
    options: [
      { id: "15a", text: "Ahli di bidang teknis atau lapangan", category: "R" },
      { id: "15b", text: "Peneliti atau analis", category: "I" },
      { id: "15c", text: "Pengusaha atau pemimpin organisasi", category: "E" },
      { id: "15d", text: "Guru, konselor, atau pekerja sosial", category: "S" },
    ],
  },
  {
    id: 16,
    prompt: "Saat presentasi, kamu lebih fokus pada…",
    options: [
      { id: "16a", text: "Membujuk audiens dan menutup dengan ajakan", category: "E" },
      { id: "16b", text: "Grafik, fakta, dan kesimpulan logis", category: "I" },
      { id: "16c", text: "Cerita dan empati ke pendengar", category: "S" },
      { id: "16d", text: "Slide rapi dan alur yang teratur", category: "C" },
    ],
  },
  {
    id: 17,
    prompt: "Kegiatan luar sekolah yang paling cocok:",
    options: [
      { id: "17a", text: "Kursus coding atau olimpiade sains", category: "I" },
      { id: "17b", text: "Komunitas musik atau menulis", category: "A" },
      { id: "17c", text: "Panitia acara dan humas", category: "E" },
      { id: "17d", text: "Pelatihan pertolongan pertama atau pendampingan", category: "S" },
    ],
  },
  {
    id: 18,
    prompt: "Kamu merasa “ini aku banget” ketika…",
    options: [
      { id: "18a", text: "Semua berkas sudah tersimpan rapi dan on time", category: "C" },
      { id: "18b", text: "Ide kreatifmu dipuji banyak orang", category: "A" },
      { id: "18c", text: "Kamu berhasil memperbaiki sesuatu yang rusak", category: "R" },
      { id: "18d", text: "Orang lain berkembang karena bantuanmu", category: "S" },
    ],
  },
  {
    id: 19,
    prompt: "Pilih pekerjaan yang paling ingin kamu coba dulu:",
    options: [
      { id: "19a", text: "Teknisi atau operator alat", category: "R" },
      { id: "19b", text: "Ilmuwan laboratorium", category: "I" },
      { id: "19c", text: "Desainer atau penulis iklan", category: "A" },
      { id: "19d", text: "Manajer penjualan atau pemilik usaha kecil", category: "E" },
    ],
  },
  {
    id: 20,
    prompt: "Saat belajar topik baru, apa yang paling penting?",
    options: [
      { id: "20a", text: "Bisa langsung dipraktekkan", category: "R" },
      { id: "20b", text: "Ada penjelasan mendalam “mengapa”", category: "I" },
      { id: "20c", text: "Bisa dibahas bareng teman", category: "S" },
      { id: "20d", text: "Ada checklist dan contoh yang jelas", category: "C" },
    ],
  },
  {
    id: 21,
    prompt: "Karakter bos atau mentor idamanmu:",
    options: [
      { id: "21a", text: "Memberi arah strategis dan peluang", category: "E" },
      { id: "21b", text: "Sabar mendengar dan membimbing secara personal", category: "S" },
      { id: "21c", text: "Teliti dan konsisten dengan standar", category: "C" },
      { id: "21d", text: "Mendorong eksperimen dan pemikiran kritis", category: "I" },
    ],
  },
  {
    id: 22,
    prompt: "Kamu lebih menghargai…",
    options: [
      { id: "22a", text: "Kejujuran dan ketepatan data", category: "C" },
      { id: "22b", text: "Inovasi dan ekspresi diri", category: "A" },
      { id: "22c", text: "Keberanian memimpin dan bertanggung jawab", category: "E" },
      { id: "22d", text: "Kerja keras fisik yang hasilnya terlihat", category: "R" },
    ],
  },
  {
    id: 23,
    prompt: "Jika diminta memilih proyek bulanan, kamu pilih…",
    options: [
      { id: "23a", text: "Riset singkat + laporan temuan", category: "I" },
      { id: "23b", text: "Video atau konten kreatif untuk medsos", category: "A" },
      { id: "23c", text: "Membangun rak, furniture, atau prototipe", category: "R" },
      { id: "23d", text: "Mengajar adik-adik di panti atau TPQ", category: "S" },
    ],
  },
  {
    id: 24,
    prompt: "Hal yang membuatmu stres di kerja kelompok:",
    options: [
      { id: "24a", text: "Teman tidak ikut aturan waktu dan format", category: "C" },
      { id: "24b", text: "Tidak ada yang mau mengambil keputusan", category: "E" },
      { id: "24c", text: "Ide diabaikan tanpa diskusi", category: "A" },
      { id: "24d", text: "Argumen tidak berdasarkan fakta", category: "I" },
    ],
  },
  {
    id: 25,
    prompt: "Kamu lebih sering diminta teman untuk…",
    options: [
      { id: "25a", text: "Membantu PR matematika atau IPA", category: "I" },
      { id: "25b", text: "Menjadi ketua atau juru bicara", category: "E" },
      { id: "25c", text: "Mendengarkan masalah pribadi mereka", category: "S" },
      { id: "25d", text: "Memperbaiki gadget atau barang sekolah", category: "R" },
    ],
  },
  {
    id: 26,
    prompt: "Visi 5 tahun ke depan yang paling kamu sukai:",
    options: [
      { id: "26a", text: "Punya usaha sendiri yang berkembang", category: "E" },
      { id: "26b", text: "Bekerja di bidang seni atau media", category: "A" },
      { id: "26c", text: "Profesi yang banyak berurusan dengan administrasi akurat", category: "C" },
      { id: "26d", text: "Profesi yang banyak berinteraksi dengan orang", category: "S" },
    ],
  },
  {
    id: 27,
    prompt: "Saat liburan, kamu lebih senang…",
    options: [
      { id: "27a", text: "Wisata alam dan aktivitas outdoor", category: "R" },
      { id: "27b", text: "Museum sains atau workshop teknologi", category: "I" },
      { id: "27c", text: "Festival budaya atau pameran", category: "A" },
      { id: "27d", text: "Kumpul komunitas dan kerja sukarela", category: "S" },
    ],
  },
  {
    id: 28,
    prompt: "Keterampilan mana yang ingin kamu dalami?",
    options: [
      { id: "28a", text: "Public speaking dan negosiasi", category: "E" },
      { id: "28b", text: "Akuntansi dasar atau manajemen dokumen", category: "C" },
      { id: "28c", text: "Fotografi atau editing video", category: "A" },
      { id: "28d", text: "Pemrograman atau statistik", category: "I" },
    ],
  },
  {
    id: 29,
    prompt: "Pilih pernyataan yang paling benar tentang dirimu:",
    options: [
      { id: "29a", text: "Aku suka hal konkret yang bisa disentuh hasilnya", category: "R" },
      { id: "29b", text: "Aku suka mengorganisir informasi dan angka", category: "C" },
      { id: "29c", text: "Aku suka memimpin dan memengaruhi orang lain", category: "E" },
      { id: "29d", text: "Aku suka mengeksplorasi ide dan konsep abstrak", category: "I" },
    ],
  },
  {
    id: 30,
    prompt: "Jika harus memilih satu kalimat untuk moto karier:",
    options: [
      { id: "30a", text: "Membantu orang lain berkembang adalah tujuanku", category: "S" },
      { id: "30b", text: "Kreativitasku adalah caraku berkontribusi", category: "A" },
      { id: "30c", text: "Aku bangga dengan kerja nyata yang bermanfaat", category: "R" },
      { id: "30d", text: "Aku ingin membangun sesuatu yang besar dan berdampak luas", category: "E" },
    ],
  },
];

export const RIASEC_QUESTION_COUNT = RIASEC_QUESTIONS.length;
