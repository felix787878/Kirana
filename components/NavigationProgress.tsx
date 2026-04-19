"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Indikator navigasi instan: muncul saat pointer menekan tautan internal,
 * lalu hilang setelah pathname berubah (navigasi selesai) atau timeout cadangan.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [pathname]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const el = e.target;
      if (!(el instanceof Element)) return;
      const a = el.closest("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if (a.dataset.noNavProgress !== undefined) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.origin);
      } catch {
        return;
      }
      if (url.protocol !== "http:" && url.protocol !== "https:") return;
      if (url.origin !== window.location.origin) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const next = `${url.pathname}${url.search}`;
      const cur = `${window.location.pathname}${window.location.search}`;
      if (next === cur) return;
      setActive(true);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", onPointerDown, true);
  }, []);

  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => setActive(false), 14_000);
    return () => window.clearTimeout(t);
  }, [active]);

  if (!active) return null;

  return (
    <div
      role="progressbar"
      aria-busy="true"
      aria-label="Memuat halaman"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px] overflow-hidden bg-teal-900/10"
    >
      <div className="absolute inset-y-0 left-0 w-[42%] bg-gradient-to-r from-teal-600 via-teal-400 to-teal-600 shadow-sm animate-nav-shimmer" />
    </div>
  );
}
