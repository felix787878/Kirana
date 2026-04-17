import React from "react";
import { LoaderFive } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#d9edf4]">
      <LoaderFive text="Loading..." />
    </div>
  );
}
