import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { UserCvData } from "@/lib/user-document";

type CvPercobaanPdfDocumentProps = {
  accentColor: string;
  fullName: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  summary?: string;
  experience?: string;
  education?: string;
  skills: string[];
  languageItems?: Array<{ name: string; level: string }>;
  certificationText?: string;
  photoSrc?: string;
  showLanguages?: boolean;
  showCertification?: boolean;
};

const LANGUAGE_LEVEL_SCORE: Record<string, number> = {
  Pemula: 1,
  Menengah: 2,
  Mahir: 3,
  Native: 4,
};

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#0f172a",
  },
  card: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    overflow: "hidden",
    flexDirection: "row",
    minHeight: 680,
  },
  sidebar: {
    width: "30%",
    padding: 14,
    color: "#ffffff",
  },
  main: {
    width: "70%",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  sectionTitleSidebar: {
    marginTop: 10,
    marginBottom: 6,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  photoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: "#ffffff",
    overflow: "hidden",
  },
  logoText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  logoCaption: {
    marginTop: 4,
    fontSize: 7.5,
    color: "#ffffff",
    letterSpacing: 1.1,
    fontFamily: "Helvetica-Bold",
  },
  sectionTitleMain: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 4,
  },
  line: {
    marginBottom: 4,
    fontSize: 9.5,
    lineHeight: 1.35,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletDot: {
    width: 10,
  },
  bulletText: {
    flex: 1,
    lineHeight: 1.35,
  },
  languageName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  languageBars: {
    flexDirection: "row",
    gap: 3,
    marginBottom: 2,
  },
  languageBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  languageBarActive: {
    backgroundColor: "#ffffff",
  },
  languageLevel: {
    fontSize: 7.5,
    color: "rgba(255,255,255,0.88)",
    marginBottom: 6,
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  contact: {
    fontSize: 9,
    color: "#475569",
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  contactValue: {
    flex: 1,
  },
  paragraph: {
    fontSize: 9.5,
    lineHeight: 1.45,
    color: "#334155",
  },
  footer: {
    position: "absolute",
    bottom: 14,
    left: 24,
    right: 24,
    textAlign: "center",
    fontSize: 8,
    color: "#64748b",
  },
});

function splitLines(text?: string) {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.replace(/^[•\-\s]+/, "").trim())
    .filter(Boolean);
}

function buildIconDataUri(path: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#334155"><path d="${path}"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const LOCATION_ICON_URI = buildIconDataUri(
  "M12 22s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Zm0-9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
);
const PHONE_ICON_URI = buildIconDataUri(
  "M6.6 10.8a15.4 15.4 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.2 11.2 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.3a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.24 1l-2 2.3Z"
);
const MAIL_ICON_URI = buildIconDataUri(
  "M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Zm1.8.5 7.2 5 7.2-5H4.8Zm14.7 10.2V8.8l-7 4.85a1 1 0 0 1-1.14 0l-7-4.85v8.4h14.2Z"
);

function ContactIcon({
  kind,
}: {
  kind: "location" | "phone" | "mail";
}) {
  const src = kind === "location" ? LOCATION_ICON_URI : kind === "phone" ? PHONE_ICON_URI : MAIL_ICON_URI;
  return <Image src={src} style={{ width: 10, height: 10 }} />;
}

function getExperienceText(cv: UserCvData) {
  if (!Array.isArray(cv?.sections)) return "";
  return cv.sections.find((section) => section.key === "experience")?.entries?.[0]?.contentText ?? "";
}

function getEducationText(cv: UserCvData) {
  if (!Array.isArray(cv?.sections)) return "";
  return cv.sections.find((section) => section.key === "education")?.entries?.[0]?.contentText ?? "";
}

export function CvPercobaanPdfDocument({
  accentColor,
  fullName,
  city,
  province,
  postalCode,
  phone,
  email,
  summary,
  experience,
  education,
  skills,
  languageItems = [],
  certificationText,
  photoSrc,
  showLanguages = false,
  showCertification = false,
}: CvPercobaanPdfDocumentProps) {
  const experienceLines = splitLines(experience);
  const educationLines = splitLines(education);
  const certificationLines = splitLines(certificationText);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <View style={[styles.sidebar, { backgroundColor: accentColor || "#0EA5A6" }]}>
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              {photoSrc ? (
                <View style={styles.photoCircle}>
                  <Image src={photoSrc} style={{ width: "100%", height: "100%" }} />
                </View>
              ) : (
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>K</Text>
                </View>
              )}
              <Text style={styles.logoCaption}>KIRANA CV</Text>
            </View>

            <Text style={styles.sectionTitleSidebar}>SKILLS</Text>
            {(skills.length ? skills : ["Komunikasi", "Administrasi", "Kerja tim"])
              .slice(0, 8)
              .map((item, index) => (
                <View key={`${item}-${index}`} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>-</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}

            {showLanguages && !!languageItems.length && (
              <View>
                <Text style={[styles.sectionTitleSidebar, { marginTop: 14 }]}>BAHASA</Text>
                {languageItems.slice(0, 4).map((item, index) => (
                  <View key={`${item.name}-${index}`} style={{ marginBottom: 2 }}>
                    <Text style={styles.languageName}>{item.name}</Text>
                    <View style={styles.languageBars}>
                      {Array.from({ length: 4 }).map((_, barIdx) => (
                        <View
                          key={`${item.name}-${barIdx}`}
                          style={[
                            styles.languageBar,
                            barIdx < (LANGUAGE_LEVEL_SCORE[item.level] ?? 1) ? styles.languageBarActive : null,
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={styles.languageLevel}>{item.level}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.main}>
            <Text style={styles.name}>{fullName || "SIAPA YA"}</Text>
            <View style={styles.contact}>
              <ContactIcon kind="location" />
              <Text style={styles.contactValue}>
                {[city, province, postalCode].filter(Boolean).join(", ") || "-"}
              </Text>
            </View>
            <View style={styles.contact}>
              <ContactIcon kind="phone" />
              <Text style={styles.contactValue}>{phone || "-"}</Text>
            </View>
            <View style={styles.contact}>
              <ContactIcon kind="mail" />
              <Text style={styles.contactValue}>{email || "-"}</Text>
            </View>

            <Text style={[styles.sectionTitleMain, { color: accentColor || "#0EA5A6" }]}>Profil</Text>
            <Text style={styles.paragraph}>{summary || "Profil belum diisi."}</Text>

            <Text style={[styles.sectionTitleMain, { color: accentColor || "#0EA5A6" }]}>Pengalaman</Text>
            {experienceLines.length ? (
              experienceLines.map((line, index) => (
                <View key={`exp-${index}`} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.paragraph}>Pengalaman belum diisi.</Text>
            )}

            <Text style={[styles.sectionTitleMain, { color: accentColor || "#0EA5A6" }]}>Pendidikan</Text>
            {educationLines.length ? (
              educationLines.map((line, index) => (
                <View key={`edu-${index}`} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{line}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.paragraph}>Pendidikan belum diisi.</Text>
            )}

            {showCertification && !!certificationLines.length && (
              <>
                <Text style={[styles.sectionTitleMain, { color: accentColor || "#0EA5A6" }]}>Sertifikasi</Text>
                {certificationLines.map((line, index) => (
                  <View key={`cert-${index}`} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{line}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        </View>

      </Page>
    </Document>
  );
}

export function mapCvToPercobaanPdfProps(cv: UserCvData) {
  return {
    fullName: cv?.fullName ?? "",
    city: cv?.city ?? "",
    province: cv?.province ?? "",
    postalCode: cv?.postalCode ?? "",
    phone: cv?.phone ?? "",
    email: cv?.email ?? "",
    summary: cv?.summary ?? "",
    experience: getExperienceText(cv),
    education: getEducationText(cv),
    skills: Array.isArray(cv?.skills) ? cv.skills.filter(Boolean) : [],
  };
}
