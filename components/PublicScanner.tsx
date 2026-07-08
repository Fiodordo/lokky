"use client";

import { useState } from "react";
import Link from "next/link";

const scoreColor = (s: string) => {
  if (s === "A" || s === "B") return "#00d4aa";
  if (s === "C") return "#f59e0b";
  return "#ef4444";
};

const scoreMessage = (s: string) => {
  if (s === "A") return "Excellent ! Votre site est bien protégé.";
  if (s === "B") return "Bonne sécurité globale, quelques points à améliorer.";
  if (s === "C") return "Sécurité correcte mais des problèmes importants existent.";
  if (s === "D") return "Plusieurs problèmes détectés — vos visiteurs sont en danger.";
  return "Votre site présente des risques sérieux de sécurité.";
};

export default function PublicScanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    domain: string;
    score: string;
    sslValid: boolean;
    httpsRedirect: boolean;
    headers: Record<string, boolean>;
  } | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  async function handleScan() {
    setLoading(true);
    setError("");
    setResult(null);
    setEmailSent(false);
    try {
      const res = await fetch("/api/public-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
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

  async function handleEmailSubmit() {
    if (!email || !result) return;
    setEmailLoading(true);
    try {
      await fetch("/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          domain: result.domain,
          score: result.score,
          sslValid: result.sslValid,
          httpsRedirect: result.httpsRedirect,
          headers: result.headers,
        }),
      });
      setEmailSent(true);
    } catch {
      setEmailSent(true);
    } finally {
      setEmailLoading(false);
    }
  }

  const getIssuesCount = (r: typeof result) => {
    if (!r) return 0;
    let count = 0;
    if (!r.sslValid) count++;
    if (!r.httpsRedirect) count++;
    count += Object.values(r.headers).filter(v => !v).length;
    return count;
  };

  return (
    <div style={{ maxWidth: "520px", margin: "0 auto" }}>
      {/* Input */}
      <div style={{ background: "#0d0018", border: "0.5px solid rgba(168,85,247,0.3)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#a855f7" }}></div>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginLeft: "8px", fontFamily: "monospace" }}>lokky — scanner</span>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && url && handleScan()}
            placeholder="monsite.fr"
            style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(168,85,247,0.2)", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#fff", fontFamily: "monospace", outline: "none" }}
          />
          <button
            onClick={handleScan}
            disabled={loading || !url}
            style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", border: "none", borderRadius: "6px", padding: "10px 20px", fontSize: "13px", fontWeight: "600", cursor: "pointer", opacity: loading || !url ? 0.5 : 1, whiteSpace: "nowrap" }}
          >
            {loading ? "Scan..." : "Scanner"}
          </button>
        </div>
        {loading && <p style={{ marginTop: "12px", fontSize: "11px", color: "#a855f7", fontFamily: "monospace" }}>→ Analyse en cours...</p>}
        {error && <p style={{ marginTop: "10px", fontSize: "12px", color: "#ef4444", fontFamily: "monospace" }}>✗ {error}</p>}
      </div>

      {/* Résultats */}
      {result && (() => {
        const issuesCount = getIssuesCount(result);
        const sc = scoreColor(result.score);
        return (
          <div style={{ background: "#0d0018", border: "0.5px solid rgba(168,85,247,0.2)", borderRadius: "12px", overflow: "hidden" }}>
            {/* Score */}
            <div style={{ padding: "20px 24px", borderBottom: "0.5px solid rgba(168,85,247,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginBottom: "4px", fontFamily: "monospace" }}>rapport de sécurité</p>
                <p style={{ fontSize: "15px", fontWeight: "500", color: "#fff" }}>{result.domain}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>{scoreMessage(result.score)}</p>
              </div>
              <div style={{ background: "rgba(168,85,247,0.1)", border: `0.5px solid ${sc}`, borderRadius: "10px", padding: "10px 18px", textAlign: "center", flexShrink: 0 }}>
                <p style={{ fontSize: "36px", fontWeight: "700", color: sc, lineHeight: "1" }}>{result.score}</p>
                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>Score</p>
              </div>
            </div>

            {/* SSL visible */}
            <div style={{ padding: "16px 24px", borderBottom: "0.5px solid rgba(168,85,247,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <i className="ti ti-lock" style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}></i>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>Certificat SSL</p>
                </div>
                <span style={{ fontSize: "12px", color: result.sslValid ? "#a855f7" : "#ef4444" }}>{result.sslValid ? "✓ OK" : "✗ Manquant"}</span>
              </div>
            </div>

            {/* Problèmes floutés */}
            {issuesCount > 0 && (
              <div style={{ padding: "16px 24px", borderBottom: "0.5px solid rgba(168,85,247,0.1)" }}>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "10px", fontFamily: "monospace" }}>→ {issuesCount} problème{issuesCount > 1 ? "s" : ""} détecté{issuesCount > 1 ? "s" : ""}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {Array.from({ length: Math.min(issuesCount, 4) }).map((_, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: "6px", filter: "blur(3px)", userSelect: "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <i className="ti ti-shield" style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)" }}></i>
                        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>Protection ██████████</p>
                      </div>
                      <span style={{ fontSize: "12px", color: "#ef4444" }}>✗ Manquant</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Capture email */}
            <div style={{ padding: "20px 24px" }}>
              {!emailSent ? (
                <>
                  <p style={{ fontSize: "13px", color: "#fff", fontWeight: "500", marginBottom: "4px" }}>
                    Recevez le rapport complet par email
                  </p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "14px" }}>
                    Détail des {issuesCount} problème{issuesCount > 1 ? "s" : ""} + guides de correction adaptés à votre site
                  </p>
                  <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !emailLoading && email && handleEmailSubmit()}
                      placeholder="vous@exemple.com"
                      style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(168,85,247,0.2)", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#fff", outline: "none" }}
                    />
                    <button
                      onClick={handleEmailSubmit}
                      disabled={emailLoading || !email}
                      style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", border: "none", borderRadius: "6px", padding: "10px 16px", fontSize: "13px", fontWeight: "600", cursor: "pointer", opacity: emailLoading || !email ? 0.5 : 1, whiteSpace: "nowrap" }}
                    >
                      {emailLoading ? "Envoi..." : "Recevoir →"}
                    </button>
                  </div>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
                    Ou{" "}
                    <Link href="/register" style={{ color: "#a855f7", textDecoration: "none" }}>
                      créez un compte gratuit
                    </Link>
                    {" "}pour voir le rapport maintenant
                  </p>
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "20px", marginBottom: "8px" }}>✓</p>
                  <p style={{ fontSize: "14px", color: "#a855f7", fontWeight: "500", marginBottom: "4px" }}>Rapport envoyé !</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginBottom: "14px" }}>Vérifiez votre boîte mail — pensez aux spams</p>
                  <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", padding: "10px 20px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
                    Créer mon compte gratuit →
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {!result && !loading && (
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>Sans carte bancaire • Sans inscription • 100% gratuit</p>
      )}
    </div>
  );
}