/** Model CV bergaya dokumen akademik (Kirana). Disimpan di `users/{uid}.cv`. */

export const CV_SCHEMA_VERSION = 2 as const;

export type CvSocial = { id: string; network: string; username: string };
export type CvConnection = { id: string; label: string; value: string };

export type CvEducation = {
  kind: "education";
  id: string;
  institution: string;
  area: string;
  degree: string;
  startDate: string;
  endDate: string;
  location: string;
  summary: string;
  highlights: string[];
};

export type CvExperience = {
  kind: "experience";
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  location: string;
  summary: string;
  highlights: string[];
};

export type CvPublication = {
  kind: "publication";
  id: string;
  title: string;
  authors: string[];
  journal: string;
  date: string;
  doi: string;
  url: string;
  summary: string;
};

export type CvProject = {
  kind: "project";
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  summary: string;
  highlights: string[];
};

export type CvOneLine = { kind: "one_line"; id: string; label: string; details: string };
export type CvBulletBlock = { kind: "bullet_block"; id: string; items: string[] };
export type CvNumberedBlock = { kind: "numbered_block"; id: string; items: string[] };
export type CvReversedNumberedBlock = {
  kind: "reversed_numbered";
  id: string;
  items: string[];
};
export type CvTextBlock = { kind: "text"; id: string; body: string };

export type CvSectionEntry =
  | CvEducation
  | CvExperience
  | CvPublication
  | CvProject
  | CvOneLine
  | CvBulletBlock
  | CvNumberedBlock
  | CvReversedNumberedBlock
  | CvTextBlock;

export type CvSection = { id: string; title: string; entries: CvSectionEntry[] };

export type UserCvData = {
  schemaVersion: typeof CV_SCHEMA_VERSION;
  fullName: string;
  headline: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  photoUrl: string;
  socialNetworks: CvSocial[];
  customConnections: CvConnection[];
  sections: CvSection[];
};

export type LegacyFlatCv = {
  fullName?: string;
  age?: string;
  school?: string;
  hobbies?: string;
  organization?: string;
  contact?: string;
  profileSummary?: string;
  customSections?: { id: string; title: string; body: string }[];
};

export function newCvId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `cv-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyEducation(id: string): CvEducation {
  return {
    kind: "education",
    id,
    institution: "",
    area: "",
    degree: "",
    startDate: "",
    endDate: "",
    location: "",
    summary: "",
    highlights: [""],
  };
}

function emptyExperience(id: string): CvExperience {
  return {
    kind: "experience",
    id,
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    location: "",
    summary: "",
    highlights: [""],
  };
}

function emptyPublication(id: string): CvPublication {
  return {
    kind: "publication",
    id,
    title: "",
    authors: [""],
    journal: "",
    date: "",
    doi: "",
    url: "",
    summary: "",
  };
}

function emptyProject(id: string): CvProject {
  return {
    kind: "project",
    id,
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    summary: "",
    highlights: [""],
  };
}

/** Dokumen demo: Bahasa Indonesia + merek Kirana; struktur mengikuti contoh RenderCV. */
export function getDefaultCvDocument(): UserCvData {
  return {
    schemaVersion: CV_SCHEMA_VERSION,
    fullName: "Andi Pratama",
    headline: "Insinyur perangkat lunak · minat karier & pembelajaran",
    location: "Jakarta, Indonesia",
    email: "andi.pratama@email.com",
    phone: "+62 812 3456 7890",
    website: "https://kirana.app",
    photoUrl: "",
    socialNetworks: [
      { id: newCvId(), network: "LinkedIn", username: "andipratama" },
      { id: newCvId(), network: "GitHub", username: "andipratama" },
    ],
    customConnections: [{ id: newCvId(), label: "Portofolio", value: "https://contoh.dev" }],
    sections: [
      {
        id: newCvId(),
        title: "Selamat datang di Kirana CV",
        entries: [
          {
            kind: "text",
            id: newCvId(),
            body:
              "Kirana membantu Anda menyusun CV terstruktur dari data yang Anda isi, lalu mengunduh PDF dengan tata letak rapi.\n\n" +
              "Setiap judul bagian bisa Anda ubah sesuka Anda.\n\n" +
              "Gunakan baris baru untuk paragraf. Contoh penekanan: **tebal**, *miring*, dan tautan https://kirana.app",
          },
        ],
      },
      {
        id: newCvId(),
        title: "Pendidikan",
        entries: [
          {
            kind: "education",
            id: newCvId(),
            institution: "Universitas Indonesia",
            area: "Ilmu Komputer",
            degree: "S1",
            startDate: "2018-08",
            endDate: "2022-07",
            location: "Depok, Indonesia",
            summary: "",
            highlights: [
              "Skripsi: sistem rekomendasi karier berbasis minat pengguna",
              "Pembimbing: Dr. Rina Wijaya, M.Kom.",
              "Beasiswa prestasi akademik (2019–2021)",
            ],
          },
          {
            kind: "education",
            id: newCvId(),
            institution: "SMA Negeri 8 Jakarta",
            area: "MIPA",
            degree: "SMA",
            startDate: "2015-07",
            endDate: "2018-05",
            location: "Jakarta, Indonesia",
            summary: "",
            highlights: ["Nilai UN rata-rata 88", "Ketua klub robotik sekolah"],
          },
        ],
      },
      {
        id: newCvId(),
        title: "Pengalaman",
        entries: [
          {
            kind: "experience",
            id: newCvId(),
            company: "PT Nexus Teknologi Indonesia",
            position: "Co-founder & CTO",
            startDate: "2023-06",
            endDate: "present",
            location: "Jakarta, Indonesia",
            summary: "",
            highlights: [
              "Membangun infrastruktur API layanan AI untuk 2M+ permintaan per bulan dengan SLA 99,97%",
              "Memimpin putaran pendanaan Seri A dan memperluas tim rekayasa dari 3 menjadi 28 orang",
              "Mengoptimalkan inferensi model sehingga latensi turun ~73% dibanding garis dasar",
            ],
          },
          {
            kind: "experience",
            id: newCvId(),
            company: "NVIDIA Research",
            position: "Magang penelitian",
            startDate: "2022-05",
            endDate: "2022-08",
            location: "Santa Clara, AS",
            summary: "",
            highlights: [
              "Merancang mekanisme perhatian sparse untuk mengurangi jejak memori transformer",
              "Co-penulis makalah di NeurIPS 2022 (spotlight)",
            ],
          },
          {
            kind: "experience",
            id: newCvId(),
            company: "Google DeepMind",
            position: "Magang penelitian",
            startDate: "2021-05",
            endDate: "2021-08",
            location: "London, Inggris",
            summary: "",
            highlights: [
              "Algoritma RL untuk koordinasi multi-agen",
              "Publikasi di ICML 2022 dan workshop NeurIPS 2022",
            ],
          },
          {
            kind: "experience",
            id: newCvId(),
            company: "Apple ML Research",
            position: "Magang penelitian",
            startDate: "2020-05",
            endDate: "2020-08",
            location: "Cupertino, AS",
            summary: "",
            highlights: [
              "Pipeline kompresi jaringan saraf on-device untuk puluhan juta perangkat",
              "2 pengajuan paten di bidang kuantisasi model",
            ],
          },
          {
            kind: "experience",
            id: newCvId(),
            company: "Microsoft Research",
            position: "Magang penelitian",
            startDate: "2019-05",
            endDate: "2019-08",
            location: "Redmond, AS",
            summary: "",
            highlights: [
              "Kerangka self-supervised untuk pemodelan bahasa sumber daya rendah",
              "Integrasi penelitian ke layanan Azure Cognitive Services",
            ],
          },
        ],
      },
      {
        id: newCvId(),
        title: "Proyek",
        entries: [
          {
            kind: "project",
            id: newCvId(),
            name: "FlashInfer (contoh)",
            startDate: "2023-01",
            endDate: "present",
            location: "",
            summary: "Pustaka open source kernel inferensi LLM berperforma tinggi",
            highlights: [
              "Percepatan 2,8x dibanding implementasi perhatian dasar di GPU A100",
              "Diadopsi komunitas open source (ribuan bintang GitHub — contoh)",
            ],
          },
          {
            kind: "project",
            id: newCvId(),
            name: "NeuralPrune (contoh)",
            startDate: "2021-01",
            endDate: "2024-05",
            location: "",
            summary: "Toolkit pruning jaringan saraf terdiferensiasi",
            highlights: [
              "Mengecilkan model hingga 90% dengan degradasi akurasi <1% pada ImageNet",
              "Ditampilkan sebagai alat ekosistem PyTorch (contoh)",
            ],
          },
        ],
      },
      {
        id: newCvId(),
        title: "Publikasi",
        entries: [
          {
            kind: "publication",
            id: newCvId(),
            title: "Sparse Mixture-of-Experts at Scale: Efficient Routing for Trillion-Parameter Models",
            authors: ["*Andi Pratama*", "Sarah Williams", "David Park"],
            journal: "NeurIPS 2023",
            date: "2023-07",
            doi: "10.1234/neurips.2023.1234",
            url: "https://",
            summary: "",
          },
          {
            kind: "publication",
            id: newCvId(),
            title: "Neural Architecture Search via Differentiable Pruning",
            authors: ["James Liu", "*Andi Pratama*"],
            journal: "NeurIPS 2022, Spotlight",
            date: "2022-12",
            doi: "10.1234/neurips.2022.5678",
            url: "https://",
            summary: "",
          },
          {
            kind: "publication",
            id: newCvId(),
            title: "Multi-Agent Reinforcement Learning with Emergent Communication",
            authors: ["Maria Garcia", "*Andi Pratama*", "Tom Anderson"],
            journal: "ICML 2022",
            date: "2022-07",
            doi: "10.1234/icml.2022.9012",
            url: "https://",
            summary: "",
          },
          {
            kind: "publication",
            id: newCvId(),
            title: "On-Device Model Compression via Learned Quantization",
            authors: ["*Andi Pratama*", "Kevin Wu"],
            journal: "ICLR 2021, Best Paper Award",
            date: "2021-05",
            doi: "10.1234/iclr.2021.3456",
            url: "https://",
            summary: "",
          },
        ],
      },
      {
        id: newCvId(),
        title: "Penghargaan terpilih",
        entries: [
          {
            kind: "bullet_block",
            id: newCvId(),
            items: [
              "MIT Technology Review 35 Under 35 Innovators (2024) — contoh",
              "Forbes 30 Under 30 Enterprise Technology (2024) — contoh",
              "Beasiswa doktor Google untuk Machine Learning (2020–2023) — contoh",
              "Fulbright untuk studi lanjut (2018) — contoh",
            ],
          },
        ],
      },
      {
        id: newCvId(),
        title: "Keahlian",
        entries: [
          { kind: "one_line", id: newCvId(), label: "Bahasa", details: "Python, C++, CUDA, Rust, Julia" },
          {
            kind: "one_line",
            id: newCvId(),
            label: "Kerangka ML",
            details: "PyTorch, JAX, TensorFlow, Triton, ONNX",
          },
          {
            kind: "one_line",
            id: newCvId(),
            label: "Infrastruktur",
            details: "Kubernetes, Ray, pelatihan terdistribusi, AWS, GCP",
          },
          {
            kind: "one_line",
            id: newCvId(),
            label: "Bidang riset",
            details: "NAS, kompresi model, inferensi efisien, multi-agent RL",
          },
        ],
      },
      {
        id: newCvId(),
        title: "Paten",
        entries: [
          {
            kind: "numbered_block",
            id: newCvId(),
            items: [
              "Kuantisasi adaptif untuk inferensi jaringan saraf di perangkat edge (US Patent 11,234,567) — contoh",
              "Pola sparsitas dinamis untuk perhatian transformer efisien (US Patent 11,345,678) — contoh",
              "Metode NAS yang sadar perangkat keras (US Patent 11,456,789) — contoh",
            ],
          },
        ],
      },
      {
        id: newCvId(),
        title: "Undangan bicara",
        entries: [
          {
            kind: "reversed_numbered",
            id: newCvId(),
            items: [
              "Scaling Laws for Efficient Inference — Stanford HAI Symposium (2024)",
              "Building AI Infrastructure for the Next Decade — TechCrunch Disrupt (2024)",
              "From Research to Production: Lessons in ML Systems — NeurIPS Workshop (2023)",
              "Efficient Deep Learning: A Practitioner's Perspective — Google Tech Talk (2022)",
            ],
          },
        ],
      },
      {
        id: newCvId(),
        title: "Bagian baru",
        entries: [{ kind: "text", id: newCvId(), body: "" }],
      },
      {
        id: newCvId(),
        title: "Bagian baru 2",
        entries: [{ kind: "text", id: newCvId(), body: "" }],
      },
    ],
  };
}

function sanitizeEntry(e: unknown): CvSectionEntry | null {
  if (!e || typeof e !== "object" || !("kind" in e)) return null;
  const rec = e as Record<string, unknown>;
  const k = String(rec.kind ?? "");
  const id = typeof rec.id === "string" && rec.id ? rec.id : newCvId();
  switch (k) {
    case "text":
      return { kind: "text", id, body: String((e as CvTextBlock).body ?? "") };
    case "one_line":
      return {
        kind: "one_line",
        id,
        label: String((e as CvOneLine).label ?? ""),
        details: String((e as CvOneLine).details ?? ""),
      };
    case "bullet_block":
      return {
        kind: "bullet_block",
        id,
        items: Array.isArray((e as CvBulletBlock).items)
          ? (e as CvBulletBlock).items.map((x) => String(x))
          : [""],
      };
    case "numbered_block":
      return {
        kind: "numbered_block",
        id,
        items: Array.isArray((e as CvNumberedBlock).items)
          ? (e as CvNumberedBlock).items.map((x) => String(x))
          : [""],
      };
    case "reversed_numbered":
      return {
        kind: "reversed_numbered",
        id,
        items: Array.isArray((e as CvReversedNumberedBlock).items)
          ? (e as CvReversedNumberedBlock).items.map((x) => String(x))
          : [""],
      };
    case "education": {
      const x = e as CvEducation;
      return {
        kind: "education",
        id,
        institution: String(x.institution ?? ""),
        area: String(x.area ?? ""),
        degree: String(x.degree ?? ""),
        startDate: String(x.startDate ?? ""),
        endDate: String(x.endDate ?? ""),
        location: String(x.location ?? ""),
        summary: String(x.summary ?? ""),
        highlights: Array.isArray(x.highlights) ? x.highlights.map((h) => String(h)) : [""],
      };
    }
    case "experience": {
      const x = e as CvExperience;
      return {
        kind: "experience",
        id,
        company: String(x.company ?? ""),
        position: String(x.position ?? ""),
        startDate: String(x.startDate ?? ""),
        endDate: String(x.endDate ?? ""),
        location: String(x.location ?? ""),
        summary: String(x.summary ?? ""),
        highlights: Array.isArray(x.highlights) ? x.highlights.map((h) => String(h)) : [""],
      };
    }
    case "publication": {
      const x = e as CvPublication;
      return {
        kind: "publication",
        id,
        title: String(x.title ?? ""),
        authors: Array.isArray(x.authors) ? x.authors.map((a) => String(a)) : [""],
        journal: String(x.journal ?? ""),
        date: String(x.date ?? ""),
        doi: String(x.doi ?? ""),
        url: String(x.url ?? ""),
        summary: String(x.summary ?? ""),
      };
    }
    case "project": {
      const x = e as CvProject;
      return {
        kind: "project",
        id,
        name: String(x.name ?? ""),
        startDate: String(x.startDate ?? ""),
        endDate: String(x.endDate ?? ""),
        location: String(x.location ?? ""),
        summary: String(x.summary ?? ""),
        highlights: Array.isArray(x.highlights) ? x.highlights.map((h) => String(h)) : [""],
      };
    }
    default:
      return null;
  }
}

function sanitizeSection(s: unknown): CvSection | null {
  if (!s || typeof s !== "object") return null;
  const id =
    typeof (s as CvSection).id === "string" && (s as CvSection).id
      ? (s as CvSection).id
      : newCvId();
  const title = String((s as CvSection).title ?? "");
  const entriesRaw = Array.isArray((s as CvSection).entries) ? (s as CvSection).entries : [];
  const entries = entriesRaw.map(sanitizeEntry).filter((x): x is CvSectionEntry => Boolean(x));
  return { id, title, entries };
}

export function sanitizeCvDocument(raw: Partial<UserCvData> | null | undefined): UserCvData {
  const base = getDefaultCvDocument();
  if (!raw || typeof raw !== "object") return base;
  if (raw.schemaVersion !== CV_SCHEMA_VERSION) return base;

  const socialNetworks = Array.isArray(raw.socialNetworks)
    ? raw.socialNetworks
        .filter((x): x is CvSocial => Boolean(x))
        .map((x) => ({
          id: typeof x.id === "string" && x.id ? x.id : newCvId(),
          network: String(x.network ?? ""),
          username: String(x.username ?? ""),
        }))
    : base.socialNetworks;

  const customConnections = Array.isArray(raw.customConnections)
    ? raw.customConnections
        .filter((x): x is CvConnection => Boolean(x))
        .map((x) => ({
          id: typeof x.id === "string" && x.id ? x.id : newCvId(),
          label: String(x.label ?? ""),
          value: String(x.value ?? ""),
        }))
    : base.customConnections;

  const sectionsRaw = Array.isArray(raw.sections) ? raw.sections : [];
  const sections = sectionsRaw.map(sanitizeSection).filter((x): x is CvSection => Boolean(x));

  return {
    schemaVersion: CV_SCHEMA_VERSION,
    fullName: String(raw.fullName ?? base.fullName),
    headline: String(raw.headline ?? base.headline),
    location: String(raw.location ?? base.location),
    email: String(raw.email ?? base.email),
    phone: String(raw.phone ?? base.phone),
    website: String(raw.website ?? base.website),
    photoUrl: String(raw.photoUrl ?? ""),
    socialNetworks,
    customConnections,
    sections: sections.length ? sections : base.sections,
  };
}

export function migrateLegacyCvToV2(legacy: LegacyFlatCv): UserCvData {
  const def = getDefaultCvDocument();
  const lines: string[] = [];
  if (legacy.profileSummary?.trim()) lines.push(legacy.profileSummary.trim());
  if (legacy.school?.trim()) lines.push(`Info: ${legacy.school.trim()}`);
  if (legacy.age?.trim()) lines.push(`Detail: ${legacy.age.trim()}`);
  if (legacy.hobbies?.trim()) lines.push(`Minat: ${legacy.hobbies.trim()}`);
  if (legacy.organization?.trim()) lines.push(`Pengalaman: ${legacy.organization.trim()}`);
  const mergedBody = lines.join("\n\n");
  const sections = [...def.sections];
  if (mergedBody) {
    sections.unshift({
      id: newCvId(),
      title: "Data dari formulir lama",
      entries: [{ kind: "text", id: newCvId(), body: mergedBody }],
    });
  }
  return {
    ...def,
    fullName: legacy.fullName?.trim() || def.fullName,
    email: legacy.contact?.includes("@") ? legacy.contact.trim() : def.email,
    phone: legacy.contact && !legacy.contact.includes("@") ? legacy.contact.trim() : def.phone,
    headline: legacy.school?.trim() || def.headline,
    sections,
  };
}

export function normalizeUserCv(raw: unknown): UserCvData {
  if (raw && typeof raw === "object" && (raw as UserCvData).schemaVersion === CV_SCHEMA_VERSION) {
    return sanitizeCvDocument(raw as UserCvData);
  }
  if (raw && typeof raw === "object" && "fullName" in raw && !("schemaVersion" in raw)) {
    return migrateLegacyCvToV2(raw as LegacyFlatCv);
  }
  if (raw && typeof raw === "object" && (raw as UserCvData).schemaVersion !== CV_SCHEMA_VERSION) {
    return migrateLegacyCvToV2(raw as unknown as LegacyFlatCv);
  }
  return getDefaultCvDocument();
}

export type CvEntryKind = CvSectionEntry["kind"];

export function createEmptyEntry(kind: CvEntryKind): CvSectionEntry {
  const id = newCvId();
  switch (kind) {
    case "text":
      return { kind: "text", id, body: "" };
    case "one_line":
      return { kind: "one_line", id, label: "", details: "" };
    case "bullet_block":
      return { kind: "bullet_block", id, items: [""] };
    case "numbered_block":
      return { kind: "numbered_block", id, items: [""] };
    case "reversed_numbered":
      return { kind: "reversed_numbered", id, items: [""] };
    case "education":
      return emptyEducation(id);
    case "experience":
      return emptyExperience(id);
    case "publication":
      return emptyPublication(id);
    case "project":
      return emptyProject(id);
    default:
      return { kind: "text", id, body: "" };
  }
}

export function createEmptySection(title = "Bagian baru"): CvSection {
  return { id: newCvId(), title, entries: [{ kind: "text", id: newCvId(), body: "" }] };
}
