/* eslint-disable jsx-a11y/alt-text */
import { Document, Font, Image, Page, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import type { UserCvData } from "@/lib/user-document";
import locationIcon from "@/app/Profil/location.png";
import emailIcon from "@/app/Profil/email.png";

Font.registerHyphenationCallback((word) => [word]);

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
  hobbyText?: string;
  photoSrc?: string;
  photoScale?: number;
  photoOffsetX?: number;
  photoOffsetY?: number;
  showLanguages?: boolean;
  showCertification?: boolean;
  showHobby?: boolean;
};

const LANGUAGE_LEVEL_SCORE: Record<string, number> = {
  Pemula: 1,
  Menengah: 2,
  Mahir: 3,
  Native: 4,
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Times-Roman",
    fontSize: 10,
    color: "#1e293b",
  },
  card: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    overflow: "hidden",
    flexDirection: "row",
    minHeight: 680,
  },
  sidebar: {
    width: "30%",
    padding: 12,
    paddingTop: 10,
    paddingLeft: 10,
    color: "#ffffff",
  },
  main: {
    width: "70%",
    padding: 18,
    paddingTop: 16,
    backgroundColor: "#ffffff",
  },
  sidebarHr: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(255,255,255,0.92)",
    marginBottom: 6,
  },
  sidebarHrSpaced: {
    marginTop: 12,
  },
  sidebarHrBelowPhoto: {
    marginTop: 2,
  },
  mainHeaderRule: {
    width: "100%",
    height: 3,
    backgroundColor: "#0f172a",
    marginTop: 8,
    marginBottom: 10,
  },
  mainSectionRule: {
    width: "100%",
    height: 1,
    backgroundColor: "#334155",
    marginTop: 10,
    marginBottom: 6,
  },
  sectionTitleSidebar: {
    marginTop: 0,
    marginBottom: 5,
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  photoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 0,
    overflow: "hidden",
  },
  logoText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
  },
  sectionTitleMain: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 0,
    marginBottom: 5,
    letterSpacing: 0.2,
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
    lineHeight: 1.45,
    fontFamily: "Times-Roman",
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
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#0f172a",
  },
  contact: {
    fontSize: 9,
    color: "#475569",
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    fontFamily: "Times-Roman",
  },
  contactValue: {
    flex: 1,
    fontFamily: "Times-Roman",
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.55,
    color: "#334155",
    fontFamily: "Times-Roman",
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

function normalizeParagraph(text?: string) {
  if (!text) return "";
  return splitLines(text).join(" ").trim();
}

function ContactIcon({
  kind,
}: {
  kind: "location" | "phone" | "mail";
}) {
  if (kind === "phone") {
    return (
      <Svg viewBox="0 0 24 24" style={{ width: 10, height: 10 }}>
        <Path
          d="M6.6 10.8a15.4 15.4 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.2 11.2 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.3a1 1 0 0 1 1 1c0 1.2.2 2.4.56 3.5a1 1 0 0 1-.24 1l-2 2.3Z"
          fill="#334155"
        />
      </Svg>
    );
  }

  const src =
    kind === "location"
      ? locationIcon
      : emailIcon;
  const resolvedSrc =
    typeof src === "string"
      ? src
      : typeof src === "object" && src && "src" in src
      ? (src as { src: string }).src
      : "";
  return <Image src={resolvedSrc} style={{ width: 10, height: 10 }} />;
}

function getExperienceText(cv: UserCvData) {
  if (!Array.isArray(cv?.sections)) return "";
  const section = cv.sections.find((item) => item.title.toLowerCase().includes("pengalaman"));
  const firstEntry = section?.entries?.[0];
  return firstEntry && firstEntry.kind === "experience" ? firstEntry.summary ?? "" : "";
}

function getEducationText(cv: UserCvData) {
  if (!Array.isArray(cv?.sections)) return "";
  const section = cv.sections.find((item) => item.title.toLowerCase().includes("pendidikan"));
  const firstEntry = section?.entries?.[0];
  return firstEntry && firstEntry.kind === "education" ? firstEntry.summary ?? "" : "";
}

function getSkills(cv: UserCvData) {
  if (!Array.isArray(cv?.sections)) return [];
  const section = cv.sections.find((item) => item.title.toLowerCase().includes("keahlian"));
  const firstEntry = section?.entries?.[0];
  if (!firstEntry || firstEntry.kind !== "one_line") return [];
  return firstEntry.details
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLocation(location?: string) {
  const parts = (location ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return {
    city: parts[0] ?? "",
    province: parts[1] ?? "",
    postalCode: parts[2] ?? "",
  };
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
  hobbyText,
  photoSrc,
  photoScale = 1,
  photoOffsetX = 0,
  photoOffsetY = 0,
  showLanguages = false,
  showCertification = false,
  showHobby = false,
}: CvPercobaanPdfDocumentProps) {
  const experienceLines = splitLines(experience);
  const educationLines = splitLines(education);
  const certificationLines = splitLines(certificationText);
  const hobbyLines = splitLines(hobbyText);
  const summaryParagraph = normalizeParagraph(summary);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <View style={[styles.sidebar, { backgroundColor: accentColor || "#0EA5A6" }]}>
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              {photoSrc ? (
                <View style={styles.photoCircle}>
                  <Image
                    src={photoSrc}
                    style={{
                      width: "108%",
                      height: "108%",
                      marginLeft: "-4%",
                      marginTop: "-4%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      transform: `translate(${photoOffsetX}px, ${photoOffsetY}px) scale(${photoScale})`,
                      transformOrigin: "top",
                    }}
                  />
                </View>
              ) : (
                <View style={styles.logoCircle}>
                  <Text style={styles.logoText}>K</Text>
                </View>
              )}
            </View>

            <View style={[styles.sidebarHr, styles.sidebarHrBelowPhoto]} />
            <Text style={styles.sectionTitleSidebar}>KETERAMPILAN</Text>
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
                <View style={[styles.sidebarHr, styles.sidebarHrSpaced]} />
                <Text style={styles.sectionTitleSidebar}>BAHASA</Text>
                {languageItems.slice(0, 4).map((item, index) => (
                  <View key={`${item.name}-${index}`} style={{ marginBottom: 2 }}>
                    <Text style={styles.languageName}>{item.name}</Text>
                    <View style={styles.languageBars}>
                      {Array.from({ length: 4 }).map((_, barIdx) => (
                        <View
                          key={`${item.name}-${barIdx}`}
                          style={
                            barIdx < (LANGUAGE_LEVEL_SCORE[item.level] ?? 1)
                              ? [styles.languageBar, styles.languageBarActive]
                              : styles.languageBar
                          }
                        />
                      ))}
                    </View>
                    <Text style={styles.languageLevel}>{item.level}</Text>
                  </View>
                ))}
              </View>
            )}

            {showHobby && !!hobbyLines.length && (
              <View>
                <View style={[styles.sidebarHr, styles.sidebarHrSpaced]} />
                <Text style={styles.sectionTitleSidebar}>HOBI</Text>
                {hobbyLines.slice(0, 6).map((line, index) => (
                  <View key={`hobby-${index}`} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>-</Text>
                    <Text style={styles.bulletText}>{line}</Text>
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

            <View style={styles.mainHeaderRule} />
            <Text style={[styles.sectionTitleMain, { color: accentColor || "#0EA5A6" }]}>Profil</Text>
            <Text style={styles.paragraph}>{summaryParagraph || "Profil belum diisi."}</Text>

            <View style={styles.mainSectionRule} />
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

            <View style={styles.mainSectionRule} />
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
                <View style={styles.mainSectionRule} />
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
  const loc = splitLocation(cv?.location);
  return {
    fullName: cv?.fullName ?? "",
    city: loc.city,
    province: loc.province,
    postalCode: loc.postalCode,
    phone: cv?.phone ?? "",
    email: cv?.email ?? "",
    summary: cv?.headline ?? "",
    experience: getExperienceText(cv),
    education: getEducationText(cv),
    skills: getSkills(cv),
  };
}
