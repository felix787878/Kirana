import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import type {
  CvSectionEntry,
  UserCvData,
} from "@/lib/user-document";

const accent = "#0b3b66";
const muted = "#64748b";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingHorizontal: 44,
    paddingBottom: 36,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: "#0f172a",
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    color: accent,
    marginBottom: 4,
  },
  headline: {
    fontSize: 10.5,
    textAlign: "center",
    color: accent,
    marginBottom: 10,
  },
  contactRow: {
    fontSize: 9,
    textAlign: "center",
    color: "#334155",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: accent,
    marginTop: 12,
    marginBottom: 3,
  },
  sectionRule: {
    height: 1,
    backgroundColor: accent,
    opacity: 0.35,
    marginBottom: 8,
  },
  body: {
    fontSize: 9.5,
    lineHeight: 1.4,
    color: "#1e293b",
    marginBottom: 6,
  },
  rowTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  rowMeta: {
    fontSize: 9,
    color: muted,
    marginBottom: 4,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 6,
  },
  bulletDot: { width: 10, fontSize: 9.5 },
  bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.35 },
  oneLineLabel: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 44,
    right: 44,
    fontSize: 8,
    color: muted,
    textAlign: "center",
  },
});

function stripMd(s: string) {
  return s.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");
}

function EntryBlock({ entry }: { entry: CvSectionEntry }) {
  switch (entry.kind) {
    case "text":
      return (
        <Text style={styles.body}>
          {stripMd(entry.body || "—")}
        </Text>
      );
    case "one_line":
      return (
        <Text style={[styles.body, { marginBottom: 4 }]}>
          <Text style={styles.oneLineLabel}>{entry.label ? `${entry.label}: ` : ""}</Text>
          {entry.details}
        </Text>
      );
    case "bullet_block":
      return (
        <View style={{ marginBottom: 6 }}>
          {entry.items.filter(Boolean).map((t, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{stripMd(t)}</Text>
            </View>
          ))}
        </View>
      );
    case "numbered_block":
      return (
        <View style={{ marginBottom: 6 }}>
          {entry.items.filter(Boolean).map((t, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>{`${i + 1}.`}</Text>
              <Text style={styles.bulletText}>{stripMd(t)}</Text>
            </View>
          ))}
        </View>
      );
    case "reversed_numbered": {
      const items = entry.items.filter(Boolean);
      const n = items.length;
      return (
        <View style={{ marginBottom: 6 }}>
          {items.map((t, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>{`${n - i}.`}</Text>
              <Text style={styles.bulletText}>{stripMd(t)}</Text>
            </View>
          ))}
        </View>
      );
    }
    case "education":
      return (
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.rowTitle}>
            {entry.institution}
            {entry.degree ? ` — ${entry.degree}` : ""}
            {entry.area ? `, ${entry.area}` : ""}
          </Text>
          <Text style={styles.rowMeta}>
            {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
            {entry.location ? ` · ${entry.location}` : ""}
          </Text>
          {entry.summary ? <Text style={styles.body}>{entry.summary}</Text> : null}
          {entry.highlights.filter(Boolean).map((h, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{stripMd(h)}</Text>
            </View>
          ))}
        </View>
      );
    case "experience":
      return (
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.rowTitle}>
            {entry.company}
            {entry.position ? ` — ${entry.position}` : ""}
          </Text>
          <Text style={styles.rowMeta}>
            {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
            {entry.location ? ` · ${entry.location}` : ""}
          </Text>
          {entry.summary ? <Text style={styles.body}>{entry.summary}</Text> : null}
          {entry.highlights.filter(Boolean).map((h, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{stripMd(h)}</Text>
            </View>
          ))}
        </View>
      );
    case "project":
      return (
        <View style={{ marginBottom: 10 }}>
          <Text style={styles.rowTitle}>{entry.name}</Text>
          <Text style={styles.rowMeta}>
            {[entry.startDate, entry.endDate].filter(Boolean).join(" – ")}
            {entry.location ? ` · ${entry.location}` : ""}
          </Text>
          {entry.summary ? <Text style={styles.body}>{entry.summary}</Text> : null}
          {entry.highlights.filter(Boolean).map((h, i) => (
            <View key={i} style={styles.bullet}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>{stripMd(h)}</Text>
            </View>
          ))}
        </View>
      );
    case "publication":
      return (
        <View style={{ marginBottom: 10 }}>
          <Text style={[styles.rowTitle, { fontFamily: "Helvetica-Bold" }]}>{entry.title}</Text>
          <Text style={[styles.body, { color: "#334155" }]}>
            {entry.authors.filter(Boolean).join(", ")}
          </Text>
          <Text style={styles.body}>
            {entry.doi ? `${entry.doi} · ` : ""}
            {entry.journal}
            {entry.date ? ` · ${entry.date}` : ""}
          </Text>
          {entry.url && entry.url !== "https://" ? (
            <Link src={entry.url} style={{ color: accent, fontSize: 9 }}>
              {entry.url}
            </Link>
          ) : null}
        </View>
      );
    default:
      return null;
  }
}

export function CVPdfDocument({ data }: { data: UserCvData }) {
  const contacts = [
    data.location,
    data.email,
    data.phone,
    data.website,
  ].filter(Boolean);
  const socialLine = data.socialNetworks
    .filter((s) => s.network && s.username)
    .map((s) => `${s.network}: ${s.username}`)
    .join(" · ");
  const customLine = data.customConnections
    .filter((c) => c.label && c.value)
    .map((c) => `${c.label}: ${c.value}`)
    .join(" · ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{data.fullName || "Nama"}</Text>
        {data.headline ? <Text style={styles.headline}>{data.headline}</Text> : null}
        {contacts.length ? (
          <Text style={styles.contactRow}>{contacts.join(" · ")}</Text>
        ) : null}
        {socialLine ? <Text style={styles.contactRow}>{socialLine}</Text> : null}
        {customLine ? <Text style={styles.contactRow}>{customLine}</Text> : null}

        {data.sections.map((sec) => (
          <View key={sec.id}>
            <Text style={styles.sectionTitle}>{sec.title || "Bagian"}</Text>
            <View style={styles.sectionRule} />
            {sec.entries.map((en) => (
              <EntryBlock key={en.id} entry={en} />
            ))}
          </View>
        ))}

        <Text style={styles.footer}>Dibuat dengan Kirana</Text>
      </Page>
    </Document>
  );
}
