"use client";

import { AuthProvider } from "@/components/AuthProvider";
import { NavigationProgress } from "@/components/NavigationProgress";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NavigationProgress />
      {children}
    </AuthProvider>
  );
}
