export type RiasecCode = "R" | "I" | "A" | "S" | "E" | "C";

export type QuestionOption = {
  id: string;
  text: string;
  category: RiasecCode;
  value: number;
};

export type Question = {
  id: number;
  prompt: string;
  options: QuestionOption[];
};

function createLikertOptions(
  questionId: number,
  category: RiasecCode
): QuestionOption[] {
  return [
    {
      id: `${questionId}-1`,
      text: "Sangat Tidak Suka",
      category,
      value: 1,
    },
    {
      id: `${questionId}-2`,
      text: "Tidak Suka",
      category,
      value: 2,
    },
    {
      id: `${questionId}-3`,
      text: "Netral",
      category,
      value: 3,
    },
    {
      id: `${questionId}-4`,
      text: "Suka",
      category,
      value: 4,
    },
    {
      id: `${questionId}-5`,
      text: "Sangat Suka",
      category,
      value: 5,
    },
  ];
}

/**
 * 30 soal pernyataan RIASEC (Likert 1-5).
 * Setiap jawaban menambah skor sesuai bobot pilihan (1..5) ke kategori soal.
 */
export const RIASEC_QUESTIONS: Question[] = [
  {
    id: 1,
    prompt:
      "Kamu suka memperbaiki barang yang rusak, seperti membetulkan kabel yang putus atau mainan yang macet?",
    options: createLikertOptions(1, "R"),
  },
  {
    id: 2,
    prompt:
      "Kamu suka merakit sesuatu dengan tanganmu sendiri, contohnya merakit PC, furnitur, atau mainan (Gundam/LEGO)?",
    options: createLikertOptions(2, "R"),
  },
  {
    id: 3,
    prompt:
      "Kamu suka kegiatan di luar ruangan yang melibatkan fisik, seperti berkebun, memanjat, atau olahraga berat?",
    options: createLikertOptions(3, "R"),
  },
  {
    id: 4,
    prompt:
      "Kamu suka mempelajari cara kerja mesin, misalnya penasaran bagaimana mesin motor atau alat elektronik bekerja?",
    options: createLikertOptions(4, "R"),
  },
  {
    id: 5,
    prompt:
      "Kamu suka menggunakan peralatan seperti obeng, palu, atau perangkat pertukangan lainnya?",
    options: createLikertOptions(5, "R"),
  },
  {
    id: 6,
    prompt:
      "Kamu suka memecahkan teka-teki atau soal logika yang sulit dan menantang?",
    options: createLikertOptions(6, "I"),
  },
  {
    id: 7,
    prompt:
      "Kamu suka melakukan eksperimen atau percobaan untuk mencari tahu alasan di balik sebuah fenomena?",
    options: createLikertOptions(7, "I"),
  },
  {
    id: 8,
    prompt:
      "Kamu suka membaca artikel sains atau menonton dokumenter tentang bagaimana alam semesta bekerja?",
    options: createLikertOptions(8, "I"),
  },
  {
    id: 9,
    prompt:
      "Kamu suka menganalisis data atau angka untuk menemukan pola tertentu yang tidak dilihat orang lain?",
    options: createLikertOptions(9, "I"),
  },
  {
    id: 10,
    prompt:
      'Kamu suka bertanya "kenapa" berkali-kali sampai kamu benar-benar paham akar dari sebuah masalah?',
    options: createLikertOptions(10, "I"),
  },
  {
    id: 11,
    prompt:
      "Kamu suka membuat karya seni visual, seperti menggambar, melukis, atau mendesain sesuatu?",
    options: createLikertOptions(11, "A"),
  },
  {
    id: 12,
    prompt:
      "Kamu suka menulis cerita, puisi, atau script untuk mengekspresikan ide-ide unik di kepalamu?",
    options: createLikertOptions(12, "A"),
  },
  {
    id: 13,
    prompt:
      "Kamu suka memainkan alat musik, menyanyi, atau menciptakan nada yang baru?",
    options: createLikertOptions(13, "A"),
  },
  {
    id: 14,
    prompt:
      "Kamu suka melakukan sesuatu dengan caramu sendiri daripada mengikuti instruksi yang kaku?",
    options: createLikertOptions(14, "A"),
  },
  {
    id: 15,
    prompt:
      "Kamu suka mendekorasi ruang atau mencoba berbagai kombinasi pakaian agar terlihat estetik dan menarik?",
    options: createLikertOptions(15, "A"),
  },
  {
    id: 16,
    prompt:
      "Kamu suka menjelaskan materi pelajaran ke teman yang merasa kesulitan memahami tugas sekolah?",
    options: createLikertOptions(16, "S"),
  },
  {
    id: 17,
    prompt:
      "Kamu suka mendengarkan curhatan teman dan memberikan dukungan emosional kepada mereka?",
    options: createLikertOptions(17, "S"),
  },
  {
    id: 18,
    prompt:
      "Kamu suka ikut dalam kegiatan bakti sosial atau menjadi relawan untuk membantu orang yang membutuhkan?",
    options: createLikertOptions(18, "S"),
  },
  {
    id: 19,
    prompt:
      "Kamu suka bekerja dalam tim di mana semua orang saling mendukung daripada bekerja sendirian?",
    options: createLikertOptions(19, "S"),
  },
  {
    id: 20,
    prompt:
      "Kamu suka melayani atau merawat orang lain, misalnya menjadi pengurus OSIS atau PMR?",
    options: createLikertOptions(20, "S"),
  },
  {
    id: 21,
    prompt:
      "Kamu suka memimpin sebuah kelompok atau proyek, misalnya menjadi ketua kelas atau kapten tim bola?",
    options: createLikertOptions(21, "E"),
  },
  {
    id: 22,
    prompt:
      "Kamu suka menyakinkan orang lain agar mau mengikuti ide atau pendapatmu?",
    options: createLikertOptions(22, "E"),
  },
  {
    id: 23,
    prompt:
      "Kamu suka mencari peluang untuk berbisnis, seperti berjualan makanan atau barang di sekolah?",
    options: createLikertOptions(23, "E"),
  },
  {
    id: 24,
    prompt:
      "Kamu suka berbicara di depan umum atau melakukan presentasi dengan penuh percaya diri?",
    options: createLikertOptions(24, "E"),
  },
  {
    id: 25,
    prompt:
      "Kamu suka mengambil risiko dan tantangan baru demi mencapai sebuah target yang besar?",
    options: createLikertOptions(25, "E"),
  },
  {
    id: 26,
    prompt:
      "Kamu suka menyusun jadwal harian atau daftar tugas (to-do list) agar hidupmu lebih teratur?",
    options: createLikertOptions(26, "C"),
  },
  {
    id: 27,
    prompt:
      "Kamu suka menata file atau folder di komputer/HP agar rapi dan mudah ditemukan?",
    options: createLikertOptions(27, "C"),
  },
  {
    id: 28,
    prompt:
      "Kamu suka mengerjakan tugas yang memiliki langkah-langkah jelas dan instruksi yang detail?",
    options: createLikertOptions(28, "C"),
  },
  {
    id: 29,
    prompt:
      "Kamu suka memeriksa ulang hasil kerjaanmu untuk memastikan tidak ada kesalahan kecil?",
    options: createLikertOptions(29, "C"),
  },
  {
    id: 30,
    prompt:
      "Kamu suka mengelola uang tabungan atau catatan pengeluaran dengan teliti?",
    options: createLikertOptions(30, "C"),
  },
];

export const RIASEC_QUESTION_COUNT = RIASEC_QUESTIONS.length;
