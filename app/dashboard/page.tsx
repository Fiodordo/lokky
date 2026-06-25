"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardHome() {
  const [scansCount, setScansCount] = useState(0);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [lastScore, setLastScore] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) loadStats(data.user.id);
    });
  }, []);

  async function loadStats(uid: string) {
    const { data } = await supabase
      .from("scans")
      .select("domain, score, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (data) {
      setScansCount(data.length);
      setLastScan(data[0]?.domain ?? null);
      setLastScore(data[0]?.score ?? null);
    }
  }

  const scoreColor = (s: string | null) => {
    if (s === "A" || s === "B") return "#00d4aa";
    if (s === "C") return "#f59e0b";
    if (s === "D" || s === "F") return "#ef4444";
    return "#ffffff";
  };

  const stats = [
    { label: "Scans effectués", value: scansCount.toString(), icon: "ti-search" },
    { label: "Dernier projet", value: lastScan ?? "—", icon: "ti-world" },
    { label: "Dernier score", value: lastScore ?? "—", icon: "ti-shield-check", color: scoreColor(lastScore) },
    { label: "Plan actuel", value: "Starter", icon: "ti-bolt" },
  ];

  const actions = [
    { label: "Scanner un projet", desc: "Analysez SSL, headers, cookies en quelques secondes", href: "/dashboard/scanner", icon: "ti-search" },
    { label: "Voir l'historique", desc: "Consultez tous vos scans passés", href: "/dashboard/history", icon: "ti-chart-bar" },
    { label: "Guides de correction", desc: "Apprenez à corriger les failles détectées", href: "/dashboard/guides", icon: "ti-book" },
    { label: "Upgrader mon plan", desc: "Débloquez les scans automatiques et alertes", href: "/dashboard/upgrade", icon: "ti-bolt" },
  ];

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>Vue d'ensemble</h1>
        <p style={{ fontSize: "13px", color: "#5a8a9f" }}>Bienvenue sur votre tableau de bord Lokky</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{ background: "#0d1f2d", border: "0.5px solid #1a3a4a", borderRadius: "10px", padding: "16px" }}>
            <i className={`ti ${stat.icon}`} style={{ fontSize: "16px", color: "#00d4aa", marginBottom: "8px", display: "block" }}></i>
            <p style={{ fontSize: "10px", color: "#5a8a9f", marginBottom: "4px" }}>{stat.label}</p>
            <p style={{ fontSize: "18px", fontWeight: "500", color: stat.color ?? "#ffffff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stat.value}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#0a1929", border: "0.5px solid #1a3a4a", borderRadius: "10px", padding: "20px", marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00d4aa" }}></div>
          <span style={{ fontSize: "11px", color: "#5a8a9f", marginLeft: "8px" }}>lokky — scanner</span>
        </div>
        <p style={{ fontSize: "11px", color: "#00d4aa", marginBottom: "12px", fontFamily: "monospace" }}>$ lokky scan --target monprojet.com</p>
        <Link href="/dashboard/scanner" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#00d4aa", color: "#0a1929", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
          <i className="ti ti-search" style={{ fontSize: "14px" }}></i>
          Lancer un scan
        </Link>
      </div>
      <h2 style={{ fontSize: "14px", fontWeight: "500", color: "#e0f0f8", marginBottom: "12px" }}>Actions rapides</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
        {actions.map((action) => (
          <Link key={action.label} href={action.href} style={{ display: "flex", alignItems: "flex-start", gap: "12px", background: "#0a1929", border: "0.5px solid #1a3a4a", borderRadius: "10px", padding: "16px", textDecoration: "none" }}>
            <i className={`ti ${action.icon}`} style={{ fontSize: "18px", color: "#00d4aa", marginTop: "1px" }}></i>
            <div>
              <p style={{ fontSize: "13px", fontWeight: "500", color: "#e0f0f8", marginBottom: "4px" }}>{action.label}</p>
              <p style={{ fontSize: "11px", color: "#5a8a9f" }}>{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}