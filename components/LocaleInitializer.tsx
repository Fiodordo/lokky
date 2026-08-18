"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LocaleInitializer() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/" || pathname === "/en" || pathname.startsWith("/en/")) {
      window.localStorage.setItem("lokky-locale", pathname === "/" ? "fr" : "en");
    }
  }, [pathname]);
  return null;
}
