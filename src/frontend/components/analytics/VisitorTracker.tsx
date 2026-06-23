"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (sessionStorage.getItem("vt_sent")) return;
    sessionStorage.setItem("vt_sent", "1");

    fetch("/api/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userAgent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: `${screen.width}×${screen.height}`,
        referrer: document.referrer || "Direct",
        page: pathname,
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
