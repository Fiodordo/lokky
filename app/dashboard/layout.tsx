"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: "🏠" },
  { href: "/dashboard/scanner", label: "Scanner", icon: "🔍" },
  { href: "/dashboard/history", label: "Historique", icon: "📊" },
  { href: "/dashboard/alerts", label: "Alertes", icon: "🔔" },
  { href: "/dashboard/guides", label: "Guides de correction", icon: "📖" },
  { href: "/dashboard/upgrade", label: "Mon abonnement", icon: "⚡" },
  { href: "/dashboard/settings", label: "Paramètres", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setEmail(data.user.email ?? "");
        setLoading(false);
      }
    });
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 text-sm">Chargement...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col fixed h-full">
        {/* Logo */}
        <div className="px-6 py-5 border-b">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">Lokky</Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t">
          <p className="text-xs text-gray-500 truncate mb-2">{email}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left text-xs text-gray-500 hover:text-red-600 transition-colors"
          >
            → Déconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
}