"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const plans = [
  { id: "starter", name: "Starter", price: "Gratuit", desc: "Pour découvrir Lokky", features: ["1 projet", "Scan manuel", "Score de sécurité", "Rapport basique"], current: true },
  { id: "builder", name: "Builder", price: "29€", period: "/mois", desc: "Pour les makers actifs", features: ["5 projets", "Scan hebdomadaire", "Alertes email SSL", "Historique complet", "Guides de correction"], highlight: true },
  { id: "agence", name: "Agence", price: "99€", period: "/mois", desc: "Pour les pros et agences", features: ["Projets illimités", "Scan quotidien", "Rapports exportables", "Support prioritaire", "Multi-utilisateurs"] },
];

export default function UpgradePage() {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) { setEmail(data.user.email ?? ""); setUserId(data.user.id); }
    });
  }, []);

  async function handleSubscribe(planId: string) {
    if (planId === "starter") return;
    setLoading(planId);
    try {
      const res = await fetch("/api/create-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: planId, userId, email }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Erreur lors de la création du paiement");
    } catch { alert("Erreur réseau"); } finally { setLoading(null); }
  }

  return (
    <div style={{ maxWidth: "800px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>Mon abonnement</h1>
        <p style={{ fontSize: "13px", color: "#5a8a9f" }}>Choisissez le plan qui correspond à vos besoins</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {plans.map((plan) => (
          <div key={plan.id} style={{ background: plan.highlight ? "rgba(0,212,170,0.05)" : "#0a1929", border: plan.highlight ? "0.5px solid rgba(0,212,170,0.4)" : "0.5px solid #1a3a4a", borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
            {plan.highlight && <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "#00d4aa", color: "#0a1929", fontSize: "10px", fontWeight: "700", padding: "3px 12px", borderRadius: "20px", whiteSpace: "nowrap" }}>Recommandé</div>}
            {plan.current && <div style={{ background: "rgba(90,138,159,0.15)", color: "#5a8a9f", fontSize: "10px", fontWeight: "500", padding: "3px 10px", borderRadius: "20px", display: "inline-block", width: "fit-content" }}>Plan actuel</div>}
            <div>
              <p style={{ fontSize: "14px", fontWeight: "500", color: plan.highlight ? "#00d4aa" : "#e0f0f8", marginBottom: "4px" }}>{plan.name}</p>
              <p style={{ fontSize: "11px", color: "#5a8a9f" }}>{plan.desc}</p>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
              <span style={{ fontSize: "28px", fontWeight: "700", color: "#e0f0f8" }}>{plan.price}</span>
              {plan.period && <span style={{ fontSize: "12px", color: "#5a8a9f" }}>{plan.period}</span>}
            </div>
            <ul style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {plan.features.map((f) => (
                <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#5a8a9f", listStyle: "none" }}>
                  <i className="ti ti-check" style={{ fontSize: "13px", color: "#00d4aa" }}></i>{f}
                </li>
              ))}
            </ul>
            <button onClick={() => handleSubscribe(plan.id)} disabled={plan.current || loading === plan.id} style={{ background: plan.highlight ? "#00d4aa" : "transparent", color: plan.highlight ? "#0a1929" : plan.current ? "#5a8a9f" : "#e0f0f8", border: plan.highlight ? "none" : "0.5px solid #1a3a4a", borderRadius: "6px", padding: "10px", fontSize: "13px", fontWeight: "600", cursor: plan.current ? "default" : "pointer", opacity: loading === plan.id ? 0.6 : 1, marginTop: "auto" }}>
              {plan.current ? "Plan actuel" : loading === plan.id ? "Redirection..." : `Choisir ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" }}>
        <i className="ti ti-shield-check" style={{ fontSize: "14px", color: "#5a8a9f" }}></i>
        <p style={{ fontSize: "11px", color: "#5a8a9f" }}>Paiement sécurisé par Stripe — Annulation à tout moment</p>
      </div>
    </div>
  );
}