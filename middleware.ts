import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path === "/favicon.ico" || path === "/icon.png" || path === "/kirana2.png") {
    // #region agent log
    fetch("http://127.0.0.1:7435/ingest/05ba4735-ad69-436d-9b0e-34a9e27f2497", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "770b3c",
      },
      body: JSON.stringify({
        sessionId: "770b3c",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "middleware.ts:8",
        message: "Favicon-related asset requested",
        data: { path },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }

  return NextResponse.next();
}
