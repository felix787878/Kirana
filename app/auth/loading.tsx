import { LoaderFive } from "@/components/ui/loader";

export default function AuthSegmentLoading() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-kirana-shell px-4"
      aria-busy="true"
      aria-live="polite"
    >
      <LoaderFive text="Memuat..." />
    </div>
  );
}
