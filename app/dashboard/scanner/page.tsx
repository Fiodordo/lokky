"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ScanResult = {
  domain: string;
  sslValid: boolean;
  expiresAt: string | null;
  httpsRedirect: boolean;
  securityHeaders: Record<string, boolean>;
  cookies: { secure: boolean; httpOnly: boolean; found: boolean };
  score: string;
};

const headerLabels: Record<string, string> = {
  "strict-transport-security": "Force HTTPS (HSTS)",
  "x-content-type-options": "Protection contre le sniffing",
  "x-frame-options": "Protection contre le clickjacking",
  "content-security-policy": "Protection contre les scripts malveillants",
};

const scoreColor = (s: string) => {
  if (s === "A" || s === "B") return { bg: "rgba(0,212,170,0.1)", color: "#00d4aa", border: "rgba(0,212,170,0.3)" };
  if (s === "C") return { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", border: "rgba(245,158,11,0.3)" };
  return { bg: "rgba(239,68,68,0.1)", color: "#ef4444", border: "rgba(239,68,68,0.3)" };
};

export default function ScannerPage() {
  const [userId, setUserId] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  async function handleScan() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, userId }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Erreur lors du scan");
    } finally {
      setLoading(false);
    }
  }

  const Check = ({ ok }: { ok: boolean }) => (
    <span style={{ color: ok ? "#00d4aa" : "#ef4444", fontSize: "13px" }}>{ok ? "✓ OK" : "✗ Manquant"}</span>
  );

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>Scanner mon projet</h1>
        <p style={{ fontSize: "13px", color: "#5a8a9f" }}>Analyse SSL, headers de sécurité, cookies et redirection HTTPS</p>
      </div>
      <div style={{ background: "#0a1929", border: "0.5px solid #1a3a4a", borderRadius: "10px", padding: "20px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00d4aa" }}></div>
          <span style={{ fontSize: "11px", color: "#5a8a9f", marginLeft: "8px", fontFamily: "monospace" }}>lokky — scanner</span>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "12px", color: "#00d4aa", fontFamily: "monospace", whiteSpace: "nowrap" }}>$ scan</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && url && handleScan()}
            placeholder="monprojet.com"
            style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "0.5px solid #1a3a4a", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#e0f0f8", fontFamily: "monospace", outline: "none" }}
          />
          <button onClick={handleScan} disabled={loading || !url} style={{ background: "#00d4aa", color: "#0a1929", border: "none", borderRadius: "6px", padding: "10px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer", opacity: loading || !url ? 0.5 : 1, whiteSpace: "nowrap" }}>
            {loading ? "Scan..." : "Lancer"}
          </button>
        </div>
        {loading && (
          <div style={{ marginTop: "14px" }}>
            <p style={{ fontSize: "11px", color: "#00d4aa", fontFamily: "monospace" }}>→ Vérification SSL en cours...</p>
            <p style={{ fontSize: "11px", color: "#5a8a9f", fontFamily: "monospace", marginTop: "4px" }}>→ Analyse des headers de sécurité...</p>
          </div>
        )}
        {error && <p style={{ marginTop: "12px", fontSize: "12px", color: "#ef4444", fontFamily: "monospace" }}>✗ Erreur: {error}</p>}
      </div>

      {result && (() => {
        const sc = scoreColor(result.score);
        return (
          <div style={{ background: "#0a1929", border: "0.5px solid #1a3a4a", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "0.5px solid #1a3a4a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "11px", color: "#5a8a9f", marginBottom: "4px", fontFamily: "monospace" }}>rapport de sécurité</p>
                <p style={{ fontSize: "16px", fontWeight: "500", color: "#e0f0f8" }}>{result.domain}</p>
              </div>
              <div style={{ background: sc.bg, border: `0.5px solid ${sc.border}`, borderRadius: "8px", padding: "8px 16px", textAlign: "center" }}>
                <p style={{ fontSize: "28px", fontWeight: "700", color: sc.color, lineHeight: "1" }}>{result.score}</p>
                <p style={{ fontSize: "9px", color: sc.color, marginTop: "2px" }}>Score</p>
              </div>
            </div>
            <div style={{ padding: "20px 24px", display: "grid", gap: "10px" }}>
              {[
                { icon: "ti-lock", label: "Certificat SSL", ok: result.sslValid, sub: result.expiresAt ? `Expire le ${new Date(result.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}` : undefined },
                { icon: "ti-arrow-right", label: "Redirection HTTPS", ok: result.httpsRedirect },
                ...Object.entries(result.securityHeaders).map(([key, value]) => ({ icon: "ti-shield", label: headerLabels[key] ?? key, ok: value })),
                ...(result.cookies.found ? [
                  { icon: "ti-cookie", label: "Cookie Secure", ok: result.cookies.secure },
                  { icon: "ti-cookie", label: "Cookie HttpOnly", ok: result.cookies.httpOnly },
                ] : []),
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <i className={`ti ${item.icon}`} style={{ fontSize: "14px", color: "#5a8a9f" }}></i>
                    <div>
                      <p style={{ fontSize: "13px", color: "#e0f0f8" }}>{item.label}</p>
                      {item.sub && <p style={{ fontSize: "10px", color: "#5a8a9f" }}>{item.sub}</p>}
                    </div>
                  </div>
                  <Check ok={item.ok} />
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}