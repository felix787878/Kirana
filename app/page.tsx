"use client";

import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
import landingAnimation from "./animasi halaman pertama.json";
import testLogo from "./test_logo.png";
import cvLogo from "./cv_logo.png";
import roadmapLogo from "./roadmap_logo.png";
import iconImg from "./icon.png";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#d9edf4]">
      <div className="pointer-events-none absolute inset-0 aurora-bg" />
      <header className="relative z-10 border-b border-sky-100/70 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image src={iconImg} alt="Kirana Logo" width={44} height={44} priority />
            <span className="text-2xl font-semibold text-cyan-700">kirana</span>
          </div>
          <Link
            href="/auth"
            className="text-sm font-semibold text-slate-700 transition hover:text-cyan-700"
          >
            Login
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:py-16">
        <div className="order-1">
          <Lottie
            animationData={landingAnimation}
            loop
            autoplay
            className="mx-auto w-full max-w-[560px]"
          />
        </div>

        <div className="order-2 text-center md:text-left">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
            Tes. Rencanakan. Wujudkan.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700 md:text-xl/relaxed">
            Kenali dirimu lebih dalam dengan Tes Psikologi, susun strategi masa depanmu lewat
            Roadmap Karier AI, dan siapkan dokumen pertamamu dengan CV Maker.
          </p>

          <Link
            href="/auth"
            className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-amber-500 px-10 text-sm font-semibold text-white shadow-lg transition hover:bg-amber-600"
          >
            Mulai
          </Link>
        </div>
      </main>

      <section className="relative z-10 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-slate-950/90">
            <div className="pointer-events-none absolute inset-0">
              <div className="bg-grad-circle bg-grad-first" />
              <div className="bg-grad-circle bg-grad-second" />
              <div className="bg-grad-circle bg-grad-third" />
              <div className="bg-grad-circle bg-grad-fourth" />
              <div className="bg-grad-circle bg-grad-fifth" />
            </div>

            <div className="relative px-6 py-16 text-center text-slate-50 md:px-10">
              <h2 className="text-3xl font-semibold md:text-4xl">Tentang Kirana</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-200/90 md:text-base md:leading-relaxed">
                Kirana adalah platform digital yang dirancang untuk menemani perjalanan eksplorasi karier.
                Kami percaya bahwa setiap individu memiliki potensi unik, namun seringkali bingung bagaimana cara
                menyalurkannya ke masa depan yang tepat.
              </p>

              <div className="mt-10 grid gap-6 text-left md:grid-cols-3">
                <div className="rounded-2xl bg-white/95 p-6 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                      <Image
                        src={testLogo}
                        alt="Tes Minat Karier (RIASEC)"
                        className="h-7 w-7 object-contain"
                      />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      Tes Minat Karier (RIASEC)
                    </h3>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-slate-700 md:text-sm">
                    Metode dari Dr. John Holland untuk mengelompokkan kecenderungan minat berdasarkan enam
                    kategori: Realistic, Investigative, Artistic, Social, Enterprising, dan Conventional.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/95 p-6 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
                      <Image
                        src={roadmapLogo}
                        alt="Roadmap"
                        className="h-7 w-7 object-contain"
                      />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">Roadmap</h3>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-slate-700 md:text-sm">
                    Roadmap atau Peta jalan adalah gambaran rencana yang memperlihatkan tahapan-tahapan untuk
                    mencapai tujuan tertentu dalam kurun waktu yang sudah ditentukan. Fungsinya adalah untuk
                    mengatur strategi atau rangkaian tugas agar tetap sejalan dengan sasaran utama yang ingin
                    diraih.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/95 p-6 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                      <Image
                        src={cvLogo}
                        alt="Curriculum Vitae"
                        className="h-7 w-7 object-contain"
                      />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">Curriculum Vitae</h3>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-slate-700 md:text-sm">
                    Curriculum Vitae atau daftar riwayat hidup adalah dokumen yang memberikan gambaran ringkas
                    mengenai profil seseorang, mencakup latar belakang pendidikan, kompetensi yang dimiliki, serta
                    pencapaian yang telah diraih. Dokumen ini bertindak sebagai alat komunikasi utama untuk
                    memperkenalkan kualifikasi diri kepada pihak luar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .aurora-bg {
          background-image: repeating-linear-gradient(
              100deg,
              #cffafe 10%,
              #e0f2fe 15%,
              #f0f9ff 20%,
              #e0f2fe 25%,
              #cffafe 30%
            ),
            repeating-linear-gradient(
              100deg,
              rgba(34, 211, 238, 0.45) 10%,
              rgba(56, 189, 248, 0.45) 15%,
              rgba(191, 219, 254, 0.45) 20%,
              rgba(125, 211, 252, 0.45) 25%,
              rgba(6, 182, 212, 0.45) 30%
            );
          background-size: 300% 200%, 200% 200%;
          background-position: 50% 50%, 50% 50%;
          filter: blur(12px);
          opacity: 0.65;
          animation: aurora 32s linear infinite;
        }

        @keyframes aurora {
          from {
            background-position: 50% 50%, 50% 50%;
          }
          to {
            background-position: 350% 50%, 350% 50%;
          }
        }

        .bg-grad-circle {
          position: absolute;
          border-radius: 9999px;
          mix-blend-mode: screen;
          filter: blur(24px);
          opacity: 0.6;
        }

        .bg-grad-first {
          width: 40%;
          height: 60%;
          left: 10%;
          top: -10%;
          background: radial-gradient(circle at center, rgba(56, 189, 248, 0.8), transparent 60%);
          animation: moveVertical 30s ease infinite;
        }

        .bg-grad-second {
          width: 45%;
          height: 55%;
          right: -10%;
          top: 0;
          background: radial-gradient(circle at center, rgba(14, 165, 233, 0.75), transparent 60%);
          animation: moveInCircle 26s linear infinite;
        }

        .bg-grad-third {
          width: 55%;
          height: 70%;
          left: 20%;
          bottom: -20%;
          background: radial-gradient(circle at center, rgba(34, 197, 94, 0.65), transparent 60%);
          animation: moveHorizontal 32s ease-in-out infinite;
        }

        .bg-grad-fourth {
          width: 30%;
          height: 40%;
          right: 20%;
          bottom: -10%;
          background: radial-gradient(circle at center, rgba(249, 115, 22, 0.7), transparent 60%);
          animation: moveInCircle 20s ease-in-out infinite;
        }

        .bg-grad-fifth {
          width: 35%;
          height: 45%;
          left: 40%;
          top: 20%;
          background: radial-gradient(circle at center, rgba(94, 234, 212, 0.75), transparent 60%);
          animation: moveVertical 36s ease-in-out infinite;
        }

        @keyframes moveHorizontal {
          0% {
            transform: translateX(-50%) translateY(-10%);
          }
          50% {
            transform: translateX(50%) translateY(10%);
          }
          100% {
            transform: translateX(-50%) translateY(-10%);
          }
        }

        @keyframes moveInCircle {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(180deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes moveVertical {
          0% {
            transform: translateY(-30%);
          }
          50% {
            transform: translateY(30%);
          }
          100% {
            transform: translateY(-30%);
          }
        }
      `}</style>
    </div>
  );
}