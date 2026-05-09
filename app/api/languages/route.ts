import { NextResponse } from "next/server";

const FALLBACK_LANGUAGES = [
  "Indonesia",
  "Inggris",
  "Arab",
  "Jepang",
  "Korea",
  "Mandarin",
  "Jerman",
  "Prancis",
  "Spanyol",
];

export async function GET() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=languages", {
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) {
      return NextResponse.json({ languages: FALLBACK_LANGUAGES });
    }

    const data = (await response.json()) as Array<{ languages?: Record<string, string> }>;
    const set = new Set<string>();

    for (const item of data) {
      const langs = item?.languages ? Object.values(item.languages) : [];
      for (const lang of langs) {
        const clean = String(lang || "").trim();
        if (clean) set.add(clean);
      }
    }

    const sorted = Array.from(set).sort((a, b) => a.localeCompare(b, "id-ID"));
    const prioritized = ["Indonesia", "Inggris"];
    const merged = [
      ...prioritized,
      ...sorted.filter(
        (name) =>
          name.localeCompare("Indonesia", "id-ID", { sensitivity: "base" }) !== 0 &&
          name.localeCompare("Inggris", "id-ID", { sensitivity: "base" }) !== 0
      ),
    ];

    return NextResponse.json({ languages: merged });
  } catch {
    return NextResponse.json({ languages: FALLBACK_LANGUAGES });
  }
}
