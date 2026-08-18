import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import LocaleInitializer from "@/components/LocaleInitializer";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 2 };
export const metadata: Metadata = {
  title: "Lokky — Sécurité simplifiée pour makers et créateurs",
  description: "Scannez votre site ou application et détectez les failles de sécurité en quelques secondes. SSL, headers, cookies — tout vérifié automatiquement.",
  icons: { icon: "/favicon.svg" },
  openGraph: { title: "Lokky — Sécurité simplifiée pour makers et créateurs", description: "Scannez votre site ou application et détectez les failles de sécurité en quelques secondes.", url: "https://lokky-mu.vercel.app", siteName: "Lokky", locale: "fr_FR", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr" className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="min-h-full flex flex-col"><LocaleInitializer />{children}</body></html>;
}
