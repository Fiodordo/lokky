"use client";

import { useState, useEffect } from "react";

const guides = [
  {
    id: "ssl",
    issue: "Certificat SSL invalide ou expiré",
    severity: "Critique",
    severityColor: "#ef4444",
    severityBg: "rgba(239,68,68,0.1)",
    icon: "ti-lock",
    what: "Votre site n'est pas chiffré. Les visiteurs voient un message d'alerte rouge et quittent immédiatement.",
    why: "Google pénalise les sites non sécurisés. Les paiements en ligne ne fonctionnent plus.",
    how: ["Connectez-vous à votre hébergeur (OVH, Hostinger, Infomaniak...)", "Allez dans Hébergement → SSL/TLS", "Cliquez sur 'Renouveler' ou 'Activer Let's Encrypt'", "Attendez 5-10 minutes et vérifiez que le cadenas apparaît"],
    cms: { Shopify: "Paramètres → Domaines → SSL actif automatiquement", WordPress: "Installez le plugin 'Really Simple SSL'", Bubble: "Settings → Domain → SSL activé automatiquement", Vercel: "Automatique si domaine connecté" },
  },
  {
    id: "https",
    issue: "Redirection HTTPS manquante",
    severity: "Important",
    severityColor: "#f59e0b",
    severityBg: "rgba(245,158,11,0.1)",
    icon: "ti-arrow-right",
    what: "Votre site est accessible en HTTP non sécurisé. Les données échangées ne sont pas chiffrées.",
    why: "Google préfère les sites HTTPS. Les utilisateurs peuvent être interceptés par des attaquants.",
    how: ["Sur Cloudflare : SSL/TLS → Edge Certificates → Always Use HTTPS → ON", "Sur Apache : ajoutez 'Redirect permanent / https://votresite.com' dans .htaccess", "Sur Nginx : ajoutez 'return 301 https://$host$request_uri;'"],
    cms: { Shopify: "Automatique", WordPress: "Paramètres → Général → Mettez https:// dans l'URL", Vercel: "Automatique", Cloudflare: "SSL/TLS → Always Use HTTPS" },
  },
  {
    id: "headers",
    issue: "Headers de sécurité manquants",
    severity: "Important",
    severityColor: "#f59e0b",
    severityBg: "rgba(245,158,11,0.1)",
    icon: "ti-shield",
    what: "Votre site n'a pas les protections HTTP recommandées contre le clickjacking et les injections de scripts.",
    why: "Ces headers protègent contre des attaques courantes et améliorent votre score de sécurité.",
    how: ["Sur Vercel : ajoutez des headers dans vercel.json", "Sur Netlify : créez un fichier _headers à la racine", "Sur Cloudflare : Rules → Transform Rules → Modify Response Header"],
    cms: { Vercel: "vercel.json → headers → X-Frame-Options: DENY", Netlify: "_headers → /* X-Frame-Options: DENY", Cloudflare: "Rules → Transform Rules" },
  },
  {
    id: "cookies",
    issue: "Cookies non sécurisés",
    severity: "Mineur",
    severityColor: "#00d4aa",
    severityBg: "rgba(0,212,170,0.1)",
    icon: "ti-cookie",
    what: "Vos cookies n'ont pas les attributs Secure et HttpOnly. Ils peuvent être volés via des attaques XSS.",
    why: "Les cookies de session sans protection peuvent être interceptés pour usurper l'identité de vos utilisateurs.",
    how: ["Node.js : res.cookie('session', value, { secure: true, httpOnly: true })", "Next.js : cookies().set('session', value, { secure: true, httpOnly: true })", "Express : utilisez helmet.js pour sécuriser automatiquement les cookies"],
    cms: { Shopify: "Géré automatiquement", WordPress: "Installez Wordfence Security", "Next.js": "Option { secure: true, httpOnly: true }" },
  },
];

export default function GuidesPage() {
  const [open, setOpen] = useState<string | null>("ssl");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setOpen(hash);
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>Guides de correction</h1>
        <p style={{ fontSize: "13px", color: "#5a8a9f" }}>Comment corriger les failles détectées par Lokky</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {guides.map((guide) => (
          <div key={guide.id} id={guide.id} style={{ background: "#0a1929", border: "0.5px solid #1a3a4a", borderRadius: "10px", overflow: "hidden", scrollMarginTop: "20px" }}>
            <button onClick={() => setOpen(open === guide.id ? null : guide.id)} style={{ width: "100%", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "none", border: "none", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <i className={`ti ${guide.icon}`} style={{ fontSize: "16px", color: guide.severityColor }}></i>
                <p style={{ fontSize: "13px", fontWeight: "500", color: "#e0f0f8", textAlign: "left" }}>{guide.issue}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "10px", fontWeight: "600", padding: "2px 10px", borderRadius: "20px", background: guide.severityBg, color: guide.severityColor, whiteSpace: "nowrap" }}>{guide.severity}</span>
                <i className={`ti ${open === guide.id ? "ti-chevron-up" : "ti-chevron-down"}`} style={{ fontSize: "14px", color: "#5a8a9f" }}></i>
              </div>
            </button>
            {open === guide.id && (
              <div style={{ padding: "0 20px 20px", borderTop: "0.5px solid #1a3a4a" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingTop: "16px" }}>
                  {[
                    { label: "→ ce que ça veut dire", text: guide.what },
                    { label: "→ pourquoi c'est important", text: guide.why },
                  ].map((item) => (
                    <div key={item.label}>
                      <p style={{ fontSize: "10px", color: "#5a8a9f", fontFamily: "monospace", marginBottom: "6px" }}>{item.label}</p>
                      <p style={{ fontSize: "13px", color: "#e0f0f8", lineHeight: "1.6" }}>{item.text}</p>
                    </div>
                  ))}
                  <div>
                    <p style={{ fontSize: "10px", color: "#5a8a9f", fontFamily: "monospace", marginBottom: "8px" }}>→ comment corriger</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {guide.how.map((step, i) => (
                        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                          <span style={{ fontSize: "10px", color: "#00d4aa", fontFamily: "monospace", marginTop: "2px", whiteSpace: "nowrap" }}>{i + 1}.</span>
                          <p style={{ fontSize: "12px", color: "#5a8a9f", lineHeight: "1.6" }}>{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: "10px", color: "#5a8a9f", fontFamily: "monospace", marginBottom: "8px" }}>→ par plateforme</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {Object.entries(guide.cms).map(([platform, instruction]) => (
                        <div key={platform} style={{ display: "flex", gap: "10px", background: "rgba(255,255,255,0.02)", borderRadius: "6px", padding: "8px 12px" }}>
                          <span style={{ fontSize: "11px", color: "#00d4aa", fontFamily: "monospace", minWidth: "80px" }}>{platform}</span>
                          <p style={{ fontSize: "11px", color: "#5a8a9f" }}>{instruction}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}