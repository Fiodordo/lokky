"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LocaleInitializer(){const pathname=usePathname();useEffect(()=>{if(pathname==="/"||pathname==="/en"||pathname.startsWith("/en/")){const locale=pathname==="/"?"fr":"en";window.localStorage.setItem("lokky-locale",locale);document.cookie=`lokky-locale=${locale}; path=/; max-age=31536000; samesite=lax`; }},[pathname]);return null}
