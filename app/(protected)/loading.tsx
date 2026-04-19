import { LoaderFive } from "@/components/ui/loader";

/** Ditampilkan segera saat pindah antar halaman di area terlindungi (menu utama, tes, dll.). */
export default function ProtectedSegmentLoading() {
  return (
    <div
      className="flex min-h-[42vh] flex-col items-center justify-center py-10"
      aria-busy="true"
      aria-live="polite"
    >
      <LoaderFive text="Memuat halaman..." />
    </div>
  );
}
