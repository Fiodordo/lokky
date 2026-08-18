"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const plans = [
  { id: "starter", name: "Free", price: "0€", desc: "Pour vérifier ton SaaS avant de le lancer.", features: ["1 projet", "Premier scan gratuit", "Security score", "Problèmes prioritaires", "Rapport simplifié"], current: true },
  { id: "pro", name: "Pro", price: "29€", period: "/mois", desc: "Pour les makers qui shipent et corrigent régulièrement.", features: ["Scans récurrents", "Historique complet", "Lokky Assistant", "Prompts Cursor adaptés", "Re-scan après correction", "Alertes de sécurité"], highlight: true },
  { id: "agence", name: "Agence", price: "99€", period: "/mois", desc: "Pour suivre plusieurs SaaS ou projets clients.", features: ["Projets multiples", "Scans fréquents", "Rapports exportables", "Support prioritaire", "Multi-clients" ] },
];

export default function UpgradePage() {
  const [email, setEmail] = useState(""); const [userId, setUserId] = useState(""); const [loading, setLoading] = useState<string | null>(null);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (data.user) { setEmail(data.user.email ?? ""); setUserId(data.user.id); } }); }, []);
  async function handleSubscribe(planId: string) { if (planId === "starter") return; setLoading(planId); try { const res = await fetch("/api/create-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: planId, userId, email }) }); const data = await res.json(); if (data.url) window.location.href = data.url; else alert("Erreur lors de la création du paiement"); } catch { alert("Erreur réseau"); } finally { setLoading(null); } }
  return <div style={{ maxWidth: "920px" }}>
    <div style={{ marginBottom: "32px" }}><h1 style={{ fontSize: "22px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>Mon abonnement</h1><p style={{ fontSize: "13px", color: "#5a8a9f" }}>Commence gratuitement. Passe à Pro quand tu veux que Lokky surveille ton SaaS.</p></div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
      {plans.map(plan => <div key={plan.id} style={{ background: plan.highlight ? "rgba(139,92,246,.07)" : "#0a1929", border: plan.highlight ? "1px solid rgba(168,85,247,.45)" : "0.5px solid #1a3a4a", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
        {plan.highlight && <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "#8b5cf6", color: "#fff", fontSize: "10px", fontWeight: "700", padding: "3px 12px", borderRadius: "20px", whiteSpace: "nowrap" }}>Le choix des makers</div>}
        {plan.current && <div style={{ background: "rgba(90,138,159,0.15)", color: "#5a8a9f", fontSize: "10px", fontWeight: "500", padding: "3px 10px", borderRadius: "20px", display: "inline-block", width: "fit-content" }}>Plan actuel</div>}
        <div><p style={{ fontSize: "14px", fontWeight: "500", color: plan.highlight ? "#c084fc" : "#e0f0f8", marginBottom: "4px" }}>{plan.name}</p><p style={{ fontSize: "11px", color: "#5a8a9f" }}>{plan.desc}</p></div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}><span style={{ fontSize: "28px", fontWeight: "700", color: "#e0f0f8" }}>{plan.price}</span>{plan.period && <span style={{ fontSize: "12px", color: "#5a8a9f" }}>{plan.period}</span>}</div>
        <ul style={{ display: "flex", flexDirection: "column", gap: "8px", padding: 0, margin: 0 }}>
          {plan.features.map(f => <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#a9b8c2", listStyle: "none" }}><i className="ti ti-check" style={{ fontSize: "13px", color: "#a855f7" }}></i>{f}</li>)}
        </ul>
        <button onClick={() => handleSubscribe(plan.id)} disabled={plan.current || loading === plan.id} style={{ background: plan.highlight ? "#8b5cf6" : "transparent", color: plan.highlight ? "#fff" : plan.current ? "#5a8a9f" : "#e0f0f8", border: plan.highlight ? "none" : "0.5px solid #1a3a4a", borderRadius: "6px", padding: "10px", fontSize: "13px", fontWeight: "600", cursor: plan.current ? "default" : "pointer", opacity: loading === plan.id ? .6 : 1, marginTop: "auto" }}>{plan.current ? "Plan actuel" : loading === plan.id ? "Redirection..." : `Choisir ${plan.name}`}</button>
      </div>)}
    </div>
    <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}><i className="ti ti-shield-check" style={{ fontSize: "14px", color: "#5a8a9f" }}></i><p style={{ fontSize: "11px", color: "#5a8a9f" }}>Paiement sécurisé par Stripe — Annulation à tout moment</p></div>
  </div>;
}
