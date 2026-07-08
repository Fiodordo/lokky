import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const headerLabels: Record<string, string> = {
  "strict-transport-security": "Force HTTPS (HSTS)",
  "x-content-type-options": "Protection contre le sniffing",
  "x-frame-options": "Protection contre le clickjacking",
  "content-security-policy": "Protection contre les scripts malveillants",
};

const scoreColor = (s: string) => {
  if (s === "A" || s === "B") return { color: "#00d4aa", bg: "rgba(0,212,170,0.1)", border: "rgba(0,212,170,0.3)" };
  if (s === "C") return { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.3)" };
  return { color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)" };
};

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: scan } = await supabase
    .from("scans")
    .select("*")
    .eq("id", id)
    .single();

  if (!scan) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a1929", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "12px" }}>Rapport introuvable</p>
          <Link href="/" style={{ color: "#00d4aa", fontSize: "13px" }}>← Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const sc = scoreColor(scan.score);
  const headers = scan.security_headers as Record<string, boolean>;

  return (
    <div style={{ minHeight: "100vh", background: "#0a1929", fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <header style={{ borderBottom: "0.5px solid #1a3a4a", padding: "0 40px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <i className="ti ti-shield-check" style={{ fontSize: "18px", color: "#00d4aa" }}></i>
          <span style={{ fontSize: "16px", fontWeight: "500", color: "#00d4aa", letterSpacing: "1px" }}>LOKKY</span>
        </Link>
        <Link href="/register" style={{ background: "#00d4aa", color: "#0a1929", fontSize: "13px", fontWeight: "600", padding: "8px 18px", borderRadius: "6px", textDecoration: "none" }}>
          Scanner mon site
        </Link>
      </header>

      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 40px" }}>
        <div style={{ marginBottom: "32px" }}>
          <p style={{ fontSize: "11px", color: "#5a8a9f", marginBottom: "8px", fontFamily: "monospace" }}>rapport de sécurité partagé</p>
          <h1 style={{ fontSize: "24px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>{scan.domain}</h1>
          <p style={{ fontSize: "12px", color: "#5a8a9f" }}>
            Scanné le {new Date(scan.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div style={{ background: "#0d1f2d", border: "0.5px solid #1a3a4a", borderRadius: "10px", overflow: "hidden", marginBottom: "24px" }}>
          {/* Score */}
          <div style={{ padding: "20px 24px", borderBottom: "0.5px solid #1a3a4a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "13px", color: "#5a8a9f", marginBottom: "4px" }}>Score de sécurité global</p>
              <p style={{ fontSize: "14px", color: "#e0f0f8" }}>
                {scan.score === "A" ? "Excellent — votre site est bien protégé" :
                 scan.score === "B" ? "Bonne sécurité globale" :
                 scan.score === "C" ? "Sécurité correcte mais améliorable" :
                 scan.score === "D" ? "Plusieurs problèmes à corriger" :
                 "Risques sérieux détectés"}
              </p>
            </div>
            <div style={{ background: sc.bg, border: `0.5px solid ${sc.border}`, borderRadius: "8px", padding: "10px 20px", textAlign: "center" }}>
              <p style={{ fontSize: "36px", fontWeight: "700", color: sc.color, lineHeight: "1" }}>{scan.score}</p>
            </div>
          </div>

          {/* Checks */}
          <div style={{ padding: "20px 24px", display: "grid", gap: "10px" }}>
            {[
              { label: "Certificat SSL", ok: scan.ssl_valid, sub: scan.expires_at ? `Expire le ${new Date(scan.expires_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}` : undefined, icon: "ti-lock" },
              { label: "Redirection HTTPS", ok: scan.https_redirect, icon: "ti-arrow-right" },
              ...Object.entries(headers).map(([key, value]) => ({ label: headerLabels[key] ?? key, ok: value, icon: "ti-shield" })),
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(255,255,255,0.02)", borderRadius: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize: "14px", color: "#5a8a9f" }}></i>
                  <div>
                    <p style={{ fontSize: "13px", color: "#e0f0f8" }}>{item.label}</p>
                    {item.sub && <p style={{ fontSize: "10px", color: "#5a8a9f" }}>{item.sub}</p>}
                  </div>
                </div>
                <span style={{ fontSize: "13px", color: item.ok ? "#00d4aa" : "#ef4444" }}>{item.ok ? "✓ OK" : "✗ Manquant"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "rgba(0,212,170,0.06)", border: "0.5px solid rgba(0,212,170,0.2)", borderRadius: "10px", padding: "20px 24px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "#e0f0f8", marginBottom: "6px", fontWeight: "500" }}>Scannez votre propre site gratuitement</p>
          <p style={{ fontSize: "12px", color: "#5a8a9f", marginBottom: "16px" }}>Rapport complet en 5 secondes — sans carte bancaire</p>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#00d4aa", color: "#0a1929", padding: "12px 24px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
            <i className="ti ti-search" style={{ fontSize: "14px" }}></i>
            Scanner mon site gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
}