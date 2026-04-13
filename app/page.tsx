"use client";

import Link from "next/link";
import Image from "next/image";

const RIASEC_DATA = [
  {
    title: "Realistic",
    desc: "Suka bekerja dengan hewan, perkakas, atau mesin; umumnya menghindari aktivitas sosial seperti mengajar atau merawat orang lain. Memiliki keterampilan baik dalam mengerjakan gambar mekanik/listrik serta menghargai hal-hal praktis yang bisa disentuh.",
  },
  {
    title: "Investigative",
    desc: "Suka mempelajari dan memecahkan masalah matematika atau sains; umumnya menghindari peran memimpin atau membujuk orang lain. Memandang diri sebagai pribadi yang presisi, ilmiah, dan intelektual.",
  },
  {
    title: "Artistic",
    desc: "Suka aktivitas kreatif seperti seni, drama, kerajinan tangan, musik, atau menulis kreatif; menghindari aktivitas yang sangat teratur atau berulang. Memandang diri sebagai pribadi yang ekspresif, orisinal, dan independen.",
  },
  {
    title: "Social",
    desc: "Suka membantu orang lain seperti mengajar, merawat, atau memberikan informasi; umumnya menghindari penggunaan mesin atau perkakas untuk mencapai tujuan. Menghargai bantuan kepada sesama dan penyelesaian masalah sosial.",
  },
  {
    title: "Enterprising",
    desc: "Suka memimpin dan membujuk orang lain, serta menjual ide atau barang; umumnya menghindari aktivitas yang membutuhkan observasi cermat dan pemikiran analitis ilmiah. Memandang diri sebagai pribadi yang energetik dan ambisius.",
  },
  {
    title: "Conventional",
    desc: "Suka bekerja dengan angka, catatan, atau mesin dengan cara yang teratur dan terencana; menghindari aktivitas yang tidak terstruktur atau ambigu. Sangat baik dalam bekerja dengan catatan tertulis secara sistematis.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center text-center">
          <Image 
            src="/icon.png" 
            alt="Kirana Logo" 
            width={100} 
            height={100} 
            className="mb-6"
          />
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Mengenal Kirana</h1>
          <p className="text-lg text-stone-600 max-w-2xl leading-relaxed">
            Platform bimbingan karier berbasis ilmiah menggunakan kerangka kerja 
            <strong> RIASEC</strong> untuk membantu remaja mengenal potensi diri 
            dan merencanakan masa depan yang cerah.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/auth"
              className="h-12 inline-flex items-center justify-center rounded-xl bg-teal-700 px-8 text-sm font-semibold text-white hover:bg-teal-800 transition-colors shadow-lg"
            >
              Mulai Tes Minat
            </Link>
          </div>
        </div>
      </header>

      {/* Tentang RIASEC */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-200">
          <h2 className="text-2xl font-bold text-stone-900 mb-6">Apa itu Tes RIASEC?</h2>
          <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed">
            <p className="mb-4">
              Tes RIASEC adalah alat penilaian kepribadian karier yang dikembangkan oleh psikolog John Holland. 
              Tes ini membagi minat manusia ke dalam enam kategori utama. Tujuannya adalah untuk mencocokkan 
              kepribadian seseorang dengan lingkungan kerja yang paling sesuai.
            </p>
            <p>
              Bagi adik-adik di panti asuhan, mengenal tipe kepribadian ini sangat penting agar kalian bisa 
              memilih sekolah atau keterampilan yang memang cocok dengan bakat alami kalian, sehingga 
              peluang sukses di masa depan menjadi jauh lebih besar.
            </p>
          </div>
        </div>

        {/* Daftar Kepribadian */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-stone-900 mb-8 text-center">Mengenal 6 Tipe Kepribadian</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RIASEC_DATA.map((item) => (
              <div 
                key={item.title} 
                className="bg-white p-6 rounded-2xl border border-stone-200 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-bold text-teal-700 mb-3">{item.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-stone-200 text-center text-stone-500 text-sm">
        <p>&copy; 2026 Kirana — Bimbingan Karier Masa Depan</p>
      </footer>
    </div>
  );
}