"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type ScanResult = {
  domain: string;
  sslValid: boolean;
  expiresAt: string | null;
  httpsRedirect: boolean;
  securityHeaders: Record<string, boolean>;
  cookies: { secure: boolean; httpOnly: boolean; found: boolean };
  score: string;
  scanId: string | null;
};

const headerLabels: Record<string, string> = {
  "strict-transport-security": "Force HTTPS (HSTS)",
  "x-content-type-options": "Protection contre le sniffing",
  "x-frame-options": "Protection contre le clickjacking",
  "content-security-policy": "Protection contre les scripts malveillants",
};

const guideLinks: Record<string, string> = {
  "ti-lock": "/dashboard/guides#ssl",
  "ti-arrow-right": "/dashboard/guides#https",
  "ti-shield": "/dashboard/guides#headers",
  "ti-cookie": "/dashboard/guides#cookies",
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
  const [ownerConfirmed, setOwnerConfirmed] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  async function handleScan() {
    setLoading(true);
    setError("");
    setResult(null);
    setSummary(null);
    setCopied(false);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, userId }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        const sumRes = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const sumData = await sumRes.json();
        if (sumData.summary) setSummary(sumData.summary);
      }
    } catch {
      setError("Erreur lors du scan");
    } finally {
      setLoading(false);
    }
  }

  function copyLink() {
    if (result?.scanId) {
      navigator.clipboard.writeText(`${window.location.origin}/report/${result.scanId}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

        <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "12px", color: "#00d4aa", fontFamily: "monospace", whiteSpace: "nowrap" }}>$ scan</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && url && ownerConfirmed && handleScan()}
            placeholder="monprojet.com"
            style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "0.5px solid #1a3a4a", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#e0f0f8", fontFamily: "monospace", outline: "none" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 0", marginBottom: "12px" }}>
          <input
            type="checkbox"
            id="owner"
            checked={ownerConfirmed}
            onChange={(e) => setOwnerConfirmed(e.target.checked)}
            style={{ marginTop: "2px", accentColor: "#00d4aa", cursor: "pointer", width: "14px", height: "14px", flexShrink: 0 }}
          />
          <label htmlFor="owner" style={{ fontSize: "11px", color: "#5a8a9f", cursor: "pointer", lineHeight: "1.5" }}>
            Je certifie être propriétaire ou avoir l'autorisation de scanner ce domaine. Tout usage non autorisé est interdit.
          </label>
        </div>

        <button
          onClick={handleScan}
          disabled={loading || !url || !ownerConfirmed}
          style={{ background: "#00d4aa", color: "#0a1929", border: "none", borderRadius: "6px", padding: "10px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer", opacity: loading || !url || !ownerConfirmed ? 0.5 : 1 }}
        >
          {loading ? "Scan..." : "Lancer le scan"}
        </button>

        {loading && (
          <div style={{ marginTop: "14px" }}>
            <p style={{ fontSize: "11px", color: "#00d4aa", fontFamily: "monospace" }}>→ Vérification SSL en cours...</p>
            <p style={{ fontSize: "11px", color: "#5a8a9f", fontFamily: "monospace", marginTop: "4px" }}>→ Analyse des headers de sécurité...</p>
          </div>
        )}

        {error && (
          <div style={{ marginTop: "12px" }}>
            <p style={{ fontSize: "12px", color: "#ef4444", fontFamily: "monospace", marginBottom: "8px" }}>✗ {error}</p>
            {error.includes("Limite atteinte") && (
              <Link href="/dashboard/upgrade" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#00d4aa", color: "#0a1929", padding: "8px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>
                Upgrader mon plan →
              </Link>
            )}
          </div>
        )}
      </div>

      {summary && (
        <div style={{ background: "rgba(0,212,170,0.06)", border: "0.5px solid rgba(0,212,170,0.2)", borderRadius: "10px", padding: "16px 20px", marginBottom: "16px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
          <i className="ti ti-robot" style={{ fontSize: "16px", color: "#00d4aa", flexShrink: 0, marginTop: "2px" }}></i>
          <p style={{ fontSize: "13px", color: "#e0f0f8", lineHeight: "1.7" }}>{summary}</p>
        </div>
      )}

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
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Check ok={item.ok} />
                    {!item.ok && (
                      <a href={guideLinks[item.icon] ?? "/dashboard/guides"} style={{ fontSize: "10px", color: "#00d4aa", textDecoration: "none", whiteSpace: "nowrap" }}>→ Guide</a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Lien partageable */}
            {result.scanId && (
              <div style={{ padding: "16px 24px", borderTop: "0.5px solid #1a3a4a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "#5a8a9f", marginBottom: "4px" }}>Lien partageable</p>
                  <p style={{ fontSize: "12px", color: "#e0f0f8", fontFamily: "monospace" }}>{window.location.origin}/report/{result.scanId}</p>
                </div>
                <button
                  onClick={copyLink}
                  style={{ background: copied ? "rgba(0,212,170,0.1)" : "transparent", border: "0.5px solid #1a3a4a", color: copied ? "#00d4aa" : "#5a8a9f", borderRadius: "6px", padding: "8px 14px", fontSize: "12px", cursor: "pointer" }}
                >
                  {copied ? "✓ Copié !" : "Copier le lien"}
                </button>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}