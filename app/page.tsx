"use client";

import Link from "next/link";
import PublicScanner from "@/components/PublicScanner";

const problems = [
  { icon: "🔐", title: "Auth mal configurée", text: "Une route API ou une donnée peut être accessible sans que tu t'en rendes compte." },
  { icon: "🔑", title: "Secrets exposés", text: "Une clé ou une variable sensible peut finir dans ton frontend ou ton bundle." },
  { icon: "🚀", title: "Ship trop vite", text: "Tu peux lancer en quelques jours sans savoir ce qui est réellement prêt pour la prod." },
];

const steps = [
  ["01", "Colle ton URL", "Donne à Lokky l'URL de ton SaaS en production."],
  ["02", "Lokky scanne", "On vérifie les signaux de sécurité visibles depuis l'extérieur."],
  ["03", "Corrige", "Tu comprends le problème et sais quoi corriger ensuite."],
];

export default function Home() {
  return (
    <main className="lk-page">
      <div className="lk-glow lk-glow-one" /><div className="lk-glow lk-glow-two" />
      <header className="lk-nav">
        <Link href="/" className="lk-logo"><span className="lk-logo-mark">◈</span>LOKKY</Link>
        <nav className="lk-nav-links"><Link href="/pricing">Pricing</Link><Link href="/login">Connexion</Link><Link href="/register" className="lk-nav-cta">Commencer →</Link></nav>
      </header>

      <section className="lk-hero">
        <div className="lk-badge"><span /> Pour les SaaS makers & vibe coders</div>
        <h1>Tu as vibe-codé ton SaaS.<br /><em>Est-il prêt pour la prod ?</em></h1>
        <p className="lk-hero-copy">Cursor, Claude, Lovable, Bolt… construisent ton SaaS en un temps record.<br className="desktop" /> Lokky vérifie ce que tu risques d'avoir oublié avant de le mettre entre les mains de tes utilisateurs.</p>
        <div className="lk-hero-card">
          <div className="lk-card-top"><span className="dot red" /><span className="dot yellow" /><span className="dot green" /><span>lokky / security scan</span></div>
          <div className="lk-scanner-placeholder">
            <div className="lk-input-row"><span>https://</span><span className="lk-placeholder">ton-saas.com</span><Link href="/register" className="lk-button">Scanner gratuitement →</Link></div>
            <p>Pas besoin de carte bancaire • Lance ton premier scan depuis ton espace Lokky</p>
          </div>
        </div>
        <div className="lk-trust"><span>✓ Sans carte bancaire</span><span>✓ Pensé pour les makers</span><span>✓ Résultat en quelques secondes</span></div>
      </section>

      <section className="lk-section lk-problem">
        <div className="lk-kicker">LE PROBLÈME</div><h2>Le vibe coding a rendu le shipping facile.<br /><em>La sécurité, pas encore.</em></h2>
        <p className="lk-section-copy">Aujourd'hui, tu peux passer de zéro à un SaaS fonctionnel en quelques jours. Mais quand tu es solo maker, personne ne te dit ce qui est dangereux dans ce que tu viens de shipper.</p>
        <div className="lk-grid">{problems.map((problem) => <article className="lk-problem-card" key={problem.title}><div className="lk-icon">{problem.icon}</div><h3>{problem.title}</h3><p>{problem.text}</p></article>)}</div>
      </section>

      <section className="lk-section lk-solution">
        <div className="lk-solution-copy"><div className="lk-kicker">LA SOLUTION</div><h2>Ton <em>security co-pilot</em><br />avant le lancement.</h2><p>Lokky transforme un scan de sécurité en une réponse simple : <strong>ce qui va bien, ce qui ne va pas et ce que tu dois faire ensuite.</strong></p><Link href="/register" className="lk-button">Scanner mon SaaS gratuitement →</Link></div>
        <div className="lk-report"><div className="lk-report-head"><div><span className="lk-mini-label">SECURITY SCORE</span><strong>72 / 100</strong></div><span className="lk-score">B</span></div><div className="lk-report-row ok"><span>✓</span> HTTPS & certificat <b>OK</b></div><div className="lk-report-row warn"><span>!</span> Security headers <b>À corriger</b></div><div className="lk-report-row danger"><span>!</span> Configuration exposée <b>Risque</b></div><div className="lk-fix">→ Comprendre le problème &nbsp; → Voir comment corriger</div></div>
      </section>

      <section className="lk-section lk-how"><div className="lk-kicker">COMMENT ÇA MARCHE</div><h2>De ton SaaS à <em>“ship it”</em>.</h2><div className="lk-steps">{steps.map(([number, title, text]) => <article key={number} className="lk-step"><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>

      <section className="lk-final-cta"><div className="lk-kicker">AVANT DE SHIPPER</div><h2>Ton SaaS fonctionne.<br /><em>Mais est-il safe ?</em></h2><p>Commence gratuitement et lance ton premier scan depuis ton dashboard.</p><Link href="/register" className="lk-button">Créer mon compte →</Link></section>
      <footer className="lk-footer"><Link href="/" className="lk-logo"><span className="lk-logo-mark">◈</span>LOKKY</Link><span>Security for the vibe coding era.</span></footer>

      <style jsx global>{`
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#07050b}.lk-page{min-height:100vh;overflow:hidden;color:#fff;background:radial-gradient(circle at 50% 0%,#1a0d2c 0%,#0b0710 32%,#07050b 70%);font-family:var(--font-sans),Inter,Arial,sans-serif;position:relative}.lk-glow{position:absolute;width:520px;height:520px;border-radius:50%;filter:blur(120px);opacity:.16;pointer-events:none}.lk-glow-one{background:#8b5cf6;top:80px;left:-280px}.lk-glow-two{background:#6366f1;top:500px;right:-300px}.lk-nav{height:68px;max-width:1120px;margin:0 auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:5;border-bottom:1px solid rgba(255,255,255,.07)}.lk-logo{color:#fff;text-decoration:none;font-weight:700;letter-spacing:.14em;font-size:14px;display:flex;align-items:center;gap:9px}.lk-logo-mark{color:#a855f7;font-size:18px}.lk-nav-links{display:flex;align-items:center;gap:24px}.lk-nav-links a{color:rgba(255,255,255,.58);text-decoration:none;font-size:13px}.lk-nav-links a:hover{color:#fff}.lk-nav-cta{color:#fff!important;background:#8b5cf6;padding:9px 15px;border-radius:8px}.lk-hero{max-width:980px;margin:0 auto;padding:105px 24px 70px;text-align:center;position:relative;z-index:1}.lk-badge{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(168,85,247,.28);background:rgba(168,85,247,.08);color:#c4b5fd;border-radius:999px;padding:7px 13px;font-size:12px;margin-bottom:28px}.lk-badge span{width:6px;height:6px;border-radius:50%;background:#a855f7;box-shadow:0 0 12px #a855f7}.lk-hero h1{font-size:clamp(44px,7vw,76px);line-height:1.02;letter-spacing:-.045em;font-weight:600;margin:0 auto 25px;max-width:900px}.lk-hero h1 em,.lk-section h2 em,.lk-final-cta h2 em{color:#a855f7;font-style:normal}.lk-hero-copy{max-width:690px;margin:0 auto 40px;color:rgba(255,255,255,.55);font-size:16px;line-height:1.75}.lk-hero-card{max-width:620px;margin:0 auto;padding:12px;background:rgba(16,10,24,.92);border:1px solid rgba(168,85,247,.18);border-radius:16px;box-shadow:0 30px 100px rgba(0,0,0,.35);text-align:left}.lk-card-top{height:28px;display:flex;align-items:center;gap:6px;padding:0 7px;color:rgba(255,255,255,.28);font:11px ui-monospace,SFMono-Regular,Menlo,monospace}.dot{width:7px;height:7px;border-radius:50%;display:inline-block}.dot.red{background:#ef4444}.dot.yellow{background:#f59e0b}.dot.green{background:#22c55e}.lk-card-top span:last-child{margin-left:5px}.lk-scanner-placeholder{padding:22px 16px 14px}.lk-input-row{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.04);border:1px solid rgba(168,85,247,.18);border-radius:9px;padding:7px 8px 7px 13px;font:13px ui-monospace;color:#a855f7}.lk-placeholder{flex:1;color:rgba(255,255,255,.28)}.lk-scanner-placeholder p{text-align:center;color:rgba(255,255,255,.25);font-size:10px;margin:12px 0 0}.lk-trust{display:flex;justify-content:center;flex-wrap:wrap;gap:22px;margin-top:18px;color:rgba(255,255,255,.3);font-size:11px}.lk-section{max-width:980px;margin:0 auto;padding:125px 24px;position:relative;z-index:1}.lk-kicker{color:#a855f7;font:600 11px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em;margin-bottom:18px}.lk-section h2,.lk-final-cta h2{font-size:clamp(34px,5vw,54px);line-height:1.08;letter-spacing:-.035em;margin:0 0 22px;font-weight:600}.lk-section-copy{max-width:650px;color:rgba(255,255,255,.48);font-size:16px;line-height:1.8;margin-bottom:42px}.lk-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.lk-problem-card{padding:25px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);border-radius:14px}.lk-icon{font-size:21px;margin-bottom:28px}.lk-problem-card h3,.lk-step h3{font-size:15px;margin:0 0 9px}.lk-problem-card p,.lk-step p{color:rgba(255,255,255,.4);font-size:13px;line-height:1.7;margin:0}.lk-solution{display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center;border-top:1px solid rgba(255,255,255,.07);border-bottom:1px solid rgba(255,255,255,.07)}.lk-solution-copy p{color:rgba(255,255,255,.45);line-height:1.8;font-size:15px;max-width:480px;margin-bottom:30px}.lk-solution-copy strong{color:rgba(255,255,255,.8)}.lk-button{display:inline-block;text-decoration:none;color:#fff;background:#8b5cf6;border-radius:8px;padding:12px 17px;font-size:13px;font-weight:600}.lk-report{background:#0d0913;border:1px solid rgba(168,85,247,.2);border-radius:14px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.3)}.lk-report-head{padding:22px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.07)}.lk-report-head strong{display:block;font-size:30px;margin-top:4px}.lk-mini-label{font:10px ui-monospace;color:rgba(255,255,255,.3)}.lk-score{display:grid;place-items:center;width:52px;height:52px;border-radius:12px;color:#f59e0b;border:1px solid #f59e0b;background:rgba(245,158,11,.08);font-size:24px;font-weight:700}.lk-report-row{padding:15px 22px;border-bottom:1px solid rgba(255,255,255,.055);display:flex;align-items:center;gap:10px;font-size:13px;color:rgba(255,255,255,.65)}.lk-report-row b{margin-left:auto;font-size:11px}.ok span,.ok b{color:#22c55e}.warn span,.warn b{color:#f59e0b}.danger span,.danger b{color:#ef4444}.lk-fix{padding:15px 22px;color:#c4b5fd;font-size:11px;background:rgba(168,85,247,.06)}.lk-how{text-align:center}.lk-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;text-align:left;margin-top:48px}.lk-step{padding:25px;border-top:1px solid rgba(168,85,247,.35);background:rgba(255,255,255,.02)}.lk-step>span{font:11px ui-monospace;color:#a855f7}.lk-step h3{margin-top:28px}.lk-final-cta{max-width:980px;margin:0 auto 80px;padding:90px 24px;text-align:center;border:1px solid rgba(168,85,247,.16);border-radius:20px;background:radial-gradient(circle at 50% 0%,rgba(168,85,247,.12),rgba(255,255,255,.02) 55%);position:relative;z-index:1}.lk-final-cta p{color:rgba(255,255,255,.4);font-size:14px;margin-bottom:35px}.lk-footer{max-width:1120px;margin:0 auto;padding:30px 24px 45px;border-top:1px solid rgba(255,255,255,.07);display:flex;justify-content:space-between;color:rgba(255,255,255,.25);font-size:11px;position:relative;z-index:1}@media(max-width:760px){.lk-nav{padding:0 18px}.lk-nav-links{gap:12px}.lk-nav-links a:first-child{display:none}.lk-nav-links a{font-size:12px}.lk-hero{padding-top:75px}.desktop{display:none}.lk-grid,.lk-steps,.lk-solution{grid-template-columns:1fr}.lk-solution{gap:40px}.lk-section{padding:90px 20px}.lk-final-cta{margin:0 15px 50px;padding:65px 15px}.lk-footer{flex-direction:column;gap:15px}.lk-trust{gap:10px 16px}.lk-hero-card{padding:7px}.lk-input-row{flex-wrap:wrap}.lk-input-row .lk-button{width:100%;text-align:center}.lk-scanner-placeholder{padding:16px 8px 10px}}
      `}</style>
    </main>
  );
}
