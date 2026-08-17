"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const plans = [
  { id: "free", name: "Free", price: "0€", desc: "Pour tester Lokky sur ton premier SaaS.", features: ["Premier scan gratuit", "Security score", "Problèmes détectés", "Rapport simplifié"], cta: "Commencer gratuitement" },
  { id: "pro", name: "Pro", price: "29€", suffix: "/mois", desc: "Pour les makers qui shipent régulièrement.", features: ["Scans récurrents", "Historique complet", "Alertes de sécurité", "Rapports détaillés", "Guides de correction"], cta: "Lancer mon SaaS en sécurité →", highlight: true },
  { id: "agence", name: "Agence", price: "99€", suffix: "/mois", desc: "Pour gérer plusieurs SaaS et clients.", features: ["Projets illimités", "Scans fréquents", "Rapports exportables", "Support prioritaire"], cta: "Choisir Agence" },
];

export default function PricingPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (data.user) { setEmail(data.user.email ?? ""); setUserId(data.user.id); } }); }, []);

  async function handleSubscribe(planId: string) {
    if (planId === "free") { router.push(userId ? "/dashboard" : "/register"); return; }
    if (!userId) { router.push("/register"); return; }
    setLoading(planId);
    try {
      const res = await fetch("/api/create-checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan: planId, userId, email }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Erreur lors de la création du paiement");
    } catch { alert("Erreur réseau"); } finally { setLoading(null); }
  }

  return (
    <main className="pricing-page">
      <header className="pricing-nav"><a href="/" className="logo"><span>◈</span> LOKKY</a><nav><a href="/">Accueil</a><a href="/login">Connexion</a><a href="/register" className="nav-cta">Commencer →</a></nav></header>
      <section className="pricing-hero"><span className="eyebrow">PRICING</span><h1>La sécurité coûte moins cher<br /><em>qu'un SaaS compromis.</em></h1><p>Commence gratuitement. Upgrade quand ton SaaS devient sérieux.</p></section>
      <section className="plans">{plans.map(plan => <article key={plan.id} className={`plan ${plan.highlight ? "featured" : ""}`}>
        {plan.highlight && <div className="popular">LE CHOIX DES MAKERS</div>}
        <span className="plan-label">{plan.name.toUpperCase()}</span><h2>{plan.price}<small>{plan.suffix}</small></h2><p className="desc">{plan.desc}</p>
        <ul>{plan.features.map(f => <li key={f}>✓ <span>{f}</span></li>)}</ul>
        <button onClick={() => handleSubscribe(plan.id)} disabled={loading === plan.id}>{loading === plan.id ? "Redirection..." : plan.cta}</button>
      </article>)}</section>
      <section className="pricing-proof"><div><span className="eyebrow">POURQUOI PRO ?</span><h2>Tu ne paies pas pour<br /><em>un joli score.</em></h2></div><div className="proof-grid"><div><b>01</b><h3>Tu shipes souvent</h3><p>Chaque nouveau déploiement peut introduire une mauvaise configuration. Les scans récurrents te permettent de vérifier dans le temps.</p></div><div><b>02</b><h3>Tu veux comprendre</h3><p>Les rapports ne se contentent pas de dire « vulnérable ». Ils expliquent le risque et quoi faire ensuite.</p></div><div><b>03</b><h3>Tu veux dormir tranquille</h3><p>Ton SaaS fonctionne. Lokky t'aide à vérifier qu'il est aussi suffisamment sécurisé avant de l'exposer à tes utilisateurs.</p></div></div></section>
      <section className="pricing-faq"><span className="eyebrow">FAQ</span><h2>Simple.</h2><div><details><summary>Je peux tester sans payer ? <span>+</span></summary><p>Oui. Le plan Free te permet de commencer avec un premier scan, sans carte bancaire.</p></details><details><summary>Lokky corrige-t-il directement mon code ? <span>+</span></summary><p>Lokky identifie les problèmes et te guide vers la correction. La vision produit est d'aller jusqu'aux corrections prêtes à utiliser avec Cursor ou Claude Code.</p></details><details><summary>Lokky remplace-t-il un audit de sécurité ? <span>+</span></summary><p>Non. Lokky est pensé comme un premier filet de sécurité pour les makers, pas comme un audit de sécurité professionnel complet.</p></details></div></section>
      <footer className="pricing-footer"><a href="/" className="logo"><span>◈</span> LOKKY</a><span>Security for the vibe coding era.</span></footer>
      <style jsx global>{`*{box-sizing:border-box}body{margin:0;background:#07050b;color:#fff;font-family:Inter,Arial,sans-serif}.pricing-page{min-height:100vh;background:radial-gradient(circle at 50% 0%,#1a0d2c 0%,#09060d 40%,#07050b 75%);padding-bottom:60px}.pricing-nav{height:68px;max-width:1120px;margin:auto;padding:0 24px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between}.logo{color:#fff;text-decoration:none;font-weight:700;letter-spacing:.14em;font-size:14px}.logo span{color:#a855f7;font-size:18px}.pricing-nav nav{display:flex;gap:24px;align-items:center}.pricing-nav nav a{color:rgba(255,255,255,.55);text-decoration:none;font-size:13px}.pricing-nav .nav-cta{color:#fff;background:#8b5cf6;padding:9px 15px;border-radius:8px}.pricing-hero{text-align:center;padding:100px 24px 55px}.eyebrow{font:600 10px ui-monospace;letter-spacing:.16em;color:#a855f7}.pricing-hero h1{font-size:clamp(42px,6vw,64px);line-height:1.04;letter-spacing:-.045em;font-weight:600;margin:20px 0}.pricing-hero h1 em,.pricing-proof h2 em{color:#a855f7;font-style:normal}.pricing-hero p{color:rgba(255,255,255,.45);font-size:15px}.plans{max-width:1040px;margin:auto;padding:20px 24px 100px;display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.plan{position:relative;padding:28px;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025);border-radius:15px}.plan.featured{border-color:rgba(168,85,247,.5);background:linear-gradient(180deg,rgba(139,92,246,.13),rgba(255,255,255,.025));box-shadow:0 25px 80px rgba(88,28,135,.15)}.popular{position:absolute;top:-12px;right:20px;background:#8b5cf6;color:#fff;padding:5px 9px;border-radius:999px;font:600 9px ui-monospace}.plan-label{color:#a855f7;font:600 10px ui-monospace;letter-spacing:.12em}.plan h2{font-size:38px;margin:20px 0 5px}.plan h2 small{font-size:13px;color:rgba(255,255,255,.35);font-weight:400}.plan .desc{height:36px;color:rgba(255,255,255,.4);font-size:12px;line-height:1.5}.plan ul{list-style:none;padding:0;margin:28px 0;display:grid;gap:12px;min-height:110px}.plan li{color:#a855f7;font-size:13px}.plan li span{color:rgba(255,255,255,.65);margin-left:6px}.plan button{width:100%;border:0;border-radius:8px;padding:12px;font-weight:600;font-size:12px;cursor:pointer;background:rgba(255,255,255,.07);color:#fff}.plan.featured button{background:#8b5cf6}.pricing-proof{max-width:1040px;margin:auto;padding:90px 24px;border-top:1px solid rgba(255,255,255,.07);display:grid;grid-template-columns:.8fr 1.2fr;gap:80px}.pricing-proof h2,.pricing-faq h2{font-size:42px;line-height:1.05;letter-spacing:-.035em;margin-top:18px}.proof-grid{display:grid;gap:22px}.proof-grid>div{border-left:1px solid rgba(168,85,247,.3);padding-left:20px}.proof-grid b{font:11px ui-monospace;color:#a855f7}.proof-grid h3{font-size:15px;margin:9px 0}.proof-grid p{color:rgba(255,255,255,.4);font-size:13px;line-height:1.7;margin:0}.pricing-faq{max-width:820px;margin:auto;padding:90px 24px}.pricing-faq>div{margin-top:30px;border-top:1px solid rgba(255,255,255,.08)}details{border-bottom:1px solid rgba(255,255,255,.08);padding:20px 0}summary{list-style:none;cursor:pointer;font-size:14px;color:rgba(255,255,255,.75);display:flex;justify-content:space-between}summary span{color:#a855f7}details p{color:rgba(255,255,255,.4);font-size:13px;line-height:1.7;max-width:680px}.pricing-footer{max-width:1040px;margin:auto;padding:30px 24px;border-top:1px solid rgba(255,255,255,.07);display:flex;justify-content:space-between;color:rgba(255,255,255,.25);font-size:11px}@media(max-width:800px){.plans,.pricing-proof{grid-template-columns:1fr}.pricing-proof{gap:45px}.pricing-nav nav a:first-child{display:none}}`}</style>
    </main>
  );
}
