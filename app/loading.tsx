import { LoaderFive } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-kirana-shell px-4">
      <LoaderFive text="Memuat..." />
    </div>
  );
}
