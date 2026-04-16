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
    paddingTop: 46,
    paddingHorizontal: 48,
    paddingBottom: 40,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: "#0f172a",
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    color: "#0b3b66",
  },
  meta: {
    fontSize: 10.5,
    marginBottom: 18,
    color: "#334155",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginBottom: 16,
  },
  block: { marginBottom: 12 },
  label: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "#64748b",
  },
  body: {
    fontSize: 10.5,
    lineHeight: 1.45,
    color: "#1e293b",
  },
  profileBox: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    backgroundColor: "#f8fafc",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    fontSize: 8,
    color: "#64748b",
    textAlign: "center",
  },
});

export function CVPdfDocument({ data }: { data: UserCvData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{data.fullName || "Nama"}</Text>
        <Text style={styles.meta}>
          {data.school || "Sekolah"}
          {data.school && data.age ? " · " : ""}
          {data.age ? `Usia ${data.age}` : ""}
          {(data.school || data.age) && data.contact ? " · " : ""}
          {data.contact || ""}
        </Text>
        <View style={styles.divider} />

        <View style={styles.profileBox}>
          <Text style={styles.label}>Profil singkat</Text>
          <Text style={styles.body}>
            Pelajar yang aktif belajar, bertanggung jawab, dan siap berkembang
            melalui kegiatan sekolah, organisasi, serta pengalaman praktis.
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>Hobi dan minat</Text>
          <Text style={styles.body}>{data.hobbies || "Belum diisi"}</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>Pengalaman organisasi / kegiatan</Text>
          <Text style={styles.body}>{data.organization || "Belum diisi"}</Text>
        </View>

        <Text style={styles.footer}>
          Dibuat dengan Kirana - CV pelajar satu halaman.
        </Text>
      </Page>
    </Document>
  );
}
