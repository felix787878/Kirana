import { NextResponse } from "next/server";

const KROKI_MERMAID_SVG = "https://kroki.io/mermaid/svg";
const MAX_BYTES = 120_000;

/** Proxy ke Kroki agar diagram Mermaid bisa di-render lewat SVG tanpa masalah CORS di browser. */
export async function POST(req: Request) {
  const text = await req.text();
  if (!text.trim()) {
    return NextResponse.json({ error: "Body kosong." }, { status: 400 });
  }
  const bytes = new TextEncoder().encode(text).length;
  if (bytes > MAX_BYTES) {
    return NextResponse.json({ error: "Diagram terlalu panjang." }, { status: 400 });
  }

  try {
    const r = await fetch(KROKI_MERMAID_SVG, {
      method: "POST",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: text.trim(),
    });
    if (!r.ok) {
      const errText = await r.text().catch(() => r.statusText);
      return NextResponse.json(
        { error: `Kroki ${r.status}: ${errText.slice(0, 500)}` },
        { status: 502 }
      );
    }
    const svg = await r.text();
    if (!svg.trimStart().toLowerCase().startsWith("<svg")) {
      return NextResponse.json({ error: "Respons bukan SVG." }, { status: 502 });
    }
    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghubungi layanan diagram." },
      { status: 502 }
    );
  }
}
