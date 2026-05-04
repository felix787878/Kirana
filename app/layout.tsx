import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Kirana — Minat & Karier",
  description:
    "Platform minat karier untuk remaja: tes RIASEC, peta jalan AI, dan CV.",
  icons: {
    icon: "/kirana2.png",
    shortcut: "/kirana2.png",
    apple: "/kirana2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // #region agent log
  fetch("http://127.0.0.1:7435/ingest/05ba4735-ad69-436d-9b0e-34a9e27f2497", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "770b3c",
    },
    body: JSON.stringify({
      sessionId: "770b3c",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "app/layout.tsx:27",
      message: "RootLayout rendered with metadata icons",
      data: {
        icon: metadata.icons,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
