"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: "ti-home" },
  { href: "/dashboard/scanner", label: "Scanner", icon: "ti-search" },
  { href: "/dashboard/history", label: "Historique", icon: "ti-chart-bar" },
  { href: "/dashboard/alerts", label: "Alertes", icon: "ti-bell" },
  { href: "/dashboard/guides", label: "Guides de correction", icon: "ti-book" },
  { href: "/dashboard/upgrade", label: "Mon abonnement", icon: "ti-bolt" },
  { href: "/dashboard/settings", label: "Paramètres", icon: "ti-settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
      else {
        setEmail(data.user.email ?? "");
        setLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a1929" }}>
      <p style={{ color: "#00d4aa", fontSize: "14px" }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d1f2d" }}>

      {/* Mobile header */}
      {isMobile && (
        <div style={{ position: "sticky", top: 0, zIndex: 20, background: "#0a1929", borderBottom: "0.5px solid #1a3a4a", padding: "0 16px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <i className="ti ti-shield-check" style={{ fontSize: "16px", color: "#00d4aa" }}></i>
            <span style={{ fontSize: "14px", fontWeight: "500", color: "#00d4aa", letterSpacing: "1px" }}>LOKKY</span>
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e0f0f8", fontSize: "20px" }}>
            <i className={`ti ${menuOpen ? "ti-x" : "ti-menu-2"}`}></i>
          </button>
        </div>
      )}

      {/* Mobile menu overlay */}
      {menuOpen && isMobile && (
        <div style={{ position: "fixed", inset: 0, zIndex: 15, background: "rgba(0,0,0,0.5)" }} onClick={() => setMenuOpen(false)}>
          <div style={{ width: "260px", height: "100vh", background: "#0a1929", borderRight: "0.5px solid #1a3a4a", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: "20px 16px", borderBottom: "0.5px solid #1a3a4a" }}>
              <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                <i className="ti ti-shield-check" style={{ fontSize: "18px", color: "#00d4aa" }}></i>
                <span style={{ fontSize: "16px", fontWeight: "500", color: "#00d4aa", letterSpacing: "1px" }}>LOKKY</span>
              </Link>
            </div>
            <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "6px", fontSize: "14px", textDecoration: "none", background: isActive ? "rgba(0,212,170,0.1)" : "transparent", color: isActive ? "#00d4aa" : "#5a8a9f", borderLeft: isActive ? "2px solid #00d4aa" : "2px solid transparent" }}>
                    <i className={`ti ${item.icon}`} style={{ fontSize: "16px" }}></i>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div style={{ padding: "16px", borderTop: "0.5px solid #1a3a4a" }}>
              <p style={{ fontSize: "11px", color: "#5a8a9f", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</p>
              <button onClick={handleLogout} style={{ fontSize: "11px", color: "#5a8a9f", background: "none", border: "none", cursor: "pointer" }}>→ Déconnexion</button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop + Mobile main */}
      <div style={{ display: "flex" }}>
        {!isMobile && (
          <div style={{ position: "fixed", height: "100vh", width: "220px", background: "#0a1929", borderRight: "0.5px solid #1a3a4a", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 16px", borderBottom: "0.5px solid #1a3a4a" }}>
              <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                <i className="ti ti-shield-check" style={{ fontSize: "18px", color: "#00d4aa" }}></i>
                <span style={{ fontSize: "16px", fontWeight: "500", color: "#00d4aa", letterSpacing: "1px" }}>LOKKY</span>
              </Link>
            </div>
            <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", borderRadius: "6px", fontSize: "13px", textDecoration: "none", background: isActive ? "rgba(0,212,170,0.1)" : "transparent", color: isActive ? "#00d4aa" : "#5a8a9f", borderLeft: isActive ? "2px solid #00d4aa" : "2px solid transparent" }}>
                    <i className={`ti ${item.icon}`} style={{ fontSize: "15px" }}></i>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div style={{ padding: "16px", borderTop: "0.5px solid #1a3a4a" }}>
              <p style={{ fontSize: "11px", color: "#5a8a9f", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</p>
              <button onClick={handleLogout} style={{ fontSize: "11px", color: "#5a8a9f", background: "none", border: "none", cursor: "pointer" }}>→ Déconnexion</button>
            </div>
          </div>
        )}
        <main style={{ flex: 1, marginLeft: isMobile ? "0" : "220px", padding: isMobile ? "16px" : "32px", minHeight: "100vh", background: "#0d1f2d", maxWidth: "100%" }}>
          {children}
        </main>
      </div>
    </div>
  );
}