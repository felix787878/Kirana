import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { UserCvData } from "@/lib/user-document";

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingHorizontal: 40,
    paddingBottom: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1c1917",
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    color: "#0f766e",
  },
  meta: {
    fontSize: 10,
    marginBottom: 14,
    color: "#44403c",
  },
  block: { marginBottom: 10 },
  label: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    color: "#292524",
  },
  body: {
    fontSize: 10,
    lineHeight: 1.45,
    color: "#44403c",
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#78716c",
    textAlign: "center",
  },
});

export function CVPdfDocument({ data }: { data: UserCvData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{data.fullName || "Nama"}</Text>
        <Text style={styles.meta}>
          {data.age ? `Usia: ${data.age}` : ""}
          {data.age && data.contact ? " · " : ""}
          {data.contact || ""}
        </Text>

        <View style={styles.block}>
          <Text style={styles.label}>Sekolah / pendidikan</Text>
          <Text style={styles.body}>{data.school || "—"}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>Hobi & minat</Text>
          <Text style={styles.body}>{data.hobbies || "—"}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>Pengalaman organisasi</Text>
          <Text style={styles.body}>{data.organization || "—"}</Text>
        </View>

        <Text style={styles.footer}>
          Dibuat dengan Kirana — ringkasan satu halaman untuk pembelajaran &
          magang.
        </Text>
      </Page>
    </Document>
  );
}
