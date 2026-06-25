"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Scan = {
  id: string;
  domain: string;
  ssl_valid: boolean;
  score: string;
  created_at: string;
  https_redirect: boolean;
};

const scoreColor = (s: string) => {
  if (s === "A" || s === "B") return { color: "#00d4aa", bg: "rgba(0,212,170,0.1)", border: "rgba(0,212,170,0.2)" };
  if (s === "C") return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" };
  return { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" };
};

export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) loadScans(data.user.id);
    });
  }, []);

  async function loadScans(uid: string) {
    const { data } = await supabase.from("scans").select("*").eq("user_id", uid).order("created_at", { ascending: false });
    if (data) setScans(data);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>Historique des scans</h1>
        <p style={{ fontSize: "13px", color: "#5a8a9f" }}>{scans.length} scan{scans.length > 1 ? "s" : ""} effectué{scans.length > 1 ? "s" : ""}</p>
      </div>
      <div style={{ background: "#0a1929", border: "0.5px solid #1a3a4a", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 100px", padding: "10px 20px", borderBottom: "0.5px solid #1a3a4a" }}>
          {["Domaine", "Score", "SSL", "HTTPS", "Date"].map((h) => (
            <p key={h} style={{ fontSize: "10px", color: "#5a8a9f", fontFamily: "monospace" }}>{h}</p>
          ))}
        </div>
        {loading ? (
          <p style={{ textAlign: "center", color: "#5a8a9f", padding: "40px", fontSize: "13px" }}>Chargement...</p>
        ) : scans.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px" }}>
            <i className="ti ti-search" style={{ fontSize: "32px", color: "#1a3a4a", display: "block", marginBottom: "12px" }}></i>
            <p style={{ color: "#5a8a9f", fontSize: "13px" }}>Aucun scan effectué pour l'instant</p>
          </div>
        ) : (
          scans.map((scan, i) => {
            const sc = scoreColor(scan.score ?? "F");
            return (
              <div key={scan.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 100px", padding: "14px 20px", borderBottom: i < scans.length - 1 ? "0.5px solid #1a3a4a" : "none", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <i className="ti ti-world" style={{ fontSize: "13px", color: "#5a8a9f" }}></i>
                  <p style={{ fontSize: "13px", color: "#e0f0f8", fontFamily: "monospace" }}>{scan.domain}</p>
                </div>
                <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", background: sc.bg, color: sc.color, border: `0.5px solid ${sc.border}`, width: "fit-content" }}>{scan.score ?? "?"}</span>
                <span style={{ fontSize: "13px", color: scan.ssl_valid ? "#00d4aa" : "#ef4444" }}>{scan.ssl_valid ? "✓" : "✗"}</span>
                <span style={{ fontSize: "13px", color: scan.https_redirect ? "#00d4aa" : "#ef4444" }}>{scan.https_redirect ? "✓" : "✗"}</span>
                <p style={{ fontSize: "11px", color: "#5a8a9f", fontFamily: "monospace" }}>{new Date(scan.created_at).toLocaleDateString("fr-FR")}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}