"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Scan = {
  id: string;
  domain: string;
  expires_at: string | null;
  ssl_valid: boolean;
};

export default function AlertsPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) loadAlerts(data.user.id);
    });
  }, []);

  async function loadAlerts(uid: string) {
    const { data } = await supabase.from("scans").select("id, domain, expires_at, ssl_valid").eq("user_id", uid).order("expires_at", { ascending: true });
    if (data) setScans(data);
    setLoading(false);
  }

  function getDaysLeft(expiresAt: string | null): number | null {
    if (!expiresAt) return null;
    return Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  }

  function getLevel(days: number | null) {
    if (days === null) return null;
    if (days <= 7) return { color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", label: "Critique" };
    if (days <= 30) return { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", label: "Attention" };
    return { color: "#00d4aa", bg: "rgba(0,212,170,0.08)", border: "rgba(0,212,170,0.2)", label: "OK" };
  }

  const alerts = scans.filter(s => { const d = getDaysLeft(s.expires_at); return d !== null && d <= 30; });

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>Alertes & Notifications</h1>
        <p style={{ fontSize: "13px", color: "#5a8a9f" }}>Surveillez les expirations SSL de vos projets</p>
      </div>
      <div style={{ background: "rgba(0,212,170,0.06)", border: "0.5px solid rgba(0,212,170,0.2)", borderRadius: "10px", padding: "14px 18px", marginBottom: "24px", display: "flex", gap: "10px", alignItems: "center" }}>
        <i className="ti ti-bell" style={{ fontSize: "16px", color: "#00d4aa" }}></i>
        <p style={{ fontSize: "12px", color: "#5a8a9f" }}>Vous recevez automatiquement un email <span style={{ color: "#00d4aa" }}>7 jours avant</span> l'expiration de votre certificat SSL.</p>
      </div>
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "14px", fontWeight: "500", color: "#e0f0f8", marginBottom: "12px", fontFamily: "monospace" }}>→ Expirations dans les 30 prochains jours</h2>
        {loading ? (
          <p style={{ color: "#5a8a9f", fontSize: "13px" }}>Chargement...</p>
        ) : alerts.length === 0 ? (
          <div style={{ background: "#0a1929", border: "0.5px solid #1a3a4a", borderRadius: "10px", padding: "32px", textAlign: "center" }}>
            <i className="ti ti-shield-check" style={{ fontSize: "32px", color: "#00d4aa", display: "block", marginBottom: "10px" }}></i>
            <p style={{ color: "#e0f0f8", fontSize: "13px", marginBottom: "4px" }}>Aucune alerte</p>
            <p style={{ color: "#5a8a9f", fontSize: "11px" }}>Tous vos certificats SSL sont valides</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {alerts.map((scan) => {
              const days = getDaysLeft(scan.expires_at);
              const level = getLevel(days);
              return (
                <div key={scan.id} style={{ background: level?.bg, border: `0.5px solid ${level?.border}`, borderRadius: "10px", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <i className="ti ti-alert-triangle" style={{ fontSize: "16px", color: level?.color }}></i>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: "500", color: "#e0f0f8", fontFamily: "monospace" }}>{scan.domain}</p>
                      <p style={{ fontSize: "11px", color: "#5a8a9f", marginTop: "2px" }}>Expire le {new Date(scan.expires_at!).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "20px", fontWeight: "700", color: level?.color }}>{days}j</p>
                    <p style={{ fontSize: "10px", color: level?.color }}>{level?.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div>
        <h2 style={{ fontSize: "14px", fontWeight: "500", color: "#e0f0f8", marginBottom: "12px", fontFamily: "monospace" }}>→ Tous vos projets surveillés</h2>
        <div style={{ background: "#0a1929", border: "0.5px solid #1a3a4a", borderRadius: "10px", overflow: "hidden" }}>
          {scans.length === 0 ? (
            <p style={{ color: "#5a8a9f", fontSize: "13px", padding: "20px" }}>Aucun projet scanné</p>
          ) : (
            scans.map((scan, i) => {
              const days = getDaysLeft(scan.expires_at);
              const level = getLevel(days);
              return (
                <div key={scan.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: i < scans.length - 1 ? "0.5px solid #1a3a4a" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <i className="ti ti-world" style={{ fontSize: "13px", color: "#5a8a9f" }}></i>
                    <p style={{ fontSize: "13px", color: "#e0f0f8", fontFamily: "monospace" }}>{scan.domain}</p>
                  </div>
                  <span style={{ fontSize: "11px", padding: "2px 10px", borderRadius: "20px", background: level?.bg ?? "rgba(255,255,255,0.05)", color: level?.color ?? "#5a8a9f", border: `0.5px solid ${level?.border ?? "#1a3a4a"}` }}>
                    {days !== null ? `${days}j` : "N/A"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}