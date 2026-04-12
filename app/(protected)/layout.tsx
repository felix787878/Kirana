import { AuthedShell } from "@/components/AuthedShell";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthedShell>{children}</AuthedShell>;
}
