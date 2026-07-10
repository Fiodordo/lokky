import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 2,
};

export const metadata: Metadata = {
  title: "Lokky — Sécurité simplifiée pour makers et créateurs",
  description: "Scannez votre site ou application et détectez les failles de sécurité en quelques secondes. SSL, headers, cookies — tout vérifié automatiquement.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Lokky — Sécurité simplifiée pour makers et créateurs",
    description: "Scannez votre site ou application et détectez les failles de sécurité en quelques secondes.",
    url: "https://lokky-mu.vercel.app",
    siteName: "Lokky",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}