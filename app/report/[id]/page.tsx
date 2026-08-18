import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import SecurityAssistant from "@/components/SecurityAssistant";

const labels: Record<string, string> = {
  "strict-transport-security": "HTTPS forcé",
  "x-content-type-options": "Anti-sniffing",
  "x-frame-options": "Anti-clickjacking",
  "content-security-policy": "Protection XSS",
};
const scoreStyle = (s: string) => s === "A" || s === "B" ? { color: "#00d4aa", bg: "rgba(0,212,170,.1)" } : s === "C" ? { color: "#f59e0b", bg: "rgba(245,158,11,.1)" } : { color: "#ef4444", bg: "rgba(239,68,68,.1)" };

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data: scan } = await supabase.from("scans").select("*").eq("id", id).single();
  if (!scan) return <div style={{ minHeight:"100vh",display:"grid",placeItems:"center",background:"#07050b",color:"#fff" }}><div style={{textAlign:"center"}}><p>Rapport introuvable</p><Link href="/dashboard" style={{color:"#a855f7"}}>← Retour au dashboard</Link></div></div>;

  const headers = (scan.security_headers || {}) as Record<string, boolean>;
  const checks = [
    { label: "Certificat SSL", ok: scan.ssl_valid, impact: "Ton trafic est chiffré" },
    { label: "Redirection HTTPS", ok: scan.https_redirect, impact: "Les visiteurs sont forcés vers HTTPS" },
    ...Object.entries(headers).map(([key, ok]) => ({ label: labels[key] || key, ok, impact: key === "content-security-policy" ? "Réduit le risque de scripts injectés" : "Réduit un risque courant côté navigateur" })),
  ];
  const failed = checks.filter(c => !c.ok);
  const score = scoreStyle(scan.score);
  const assistantIssues = failed.map(item => ({ label: item.label, impact: item.impact }));

  return <main className="report-page">
    <header><Link href="/dashboard" className="logo"><span>◈</span> LOKKY</Link><Link href="/dashboard/scanner" className="cta">Scanner un autre SaaS →</Link></header>
    <div className="report-wrap">
      <div className="report-top"><div><span className="eyebrow">RAPPORT DE SÉCURITÉ</span><h1>{scan.domain}</h1><p>Scanné le {new Date(scan.created_at).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" })}</p></div><div className="score" style={{color:score.color,background:score.bg}}><b>{scan.score}</b><span>score</span></div></div>

      <section className={`verdict ${failed.length ? "danger" : "good"}`}><div className="verdict-icon">{failed.length ? "!" : "✓"}</div><div><b>{failed.length ? `${failed.length} point${failed.length > 1 ? "s" : ""} mérite${failed.length > 1 ? "nt" : ""} ton attention` : "Ton SaaS passe les vérifications visibles"}</b><p>{failed.length ? "Pas besoin de comprendre la cybersécurité. Commence par demander à Lokky quoi faire, puis re-scanne après ta correction." : "Aucun problème visible n'a été détecté par ce scan."}</p></div></section>

      {failed.length > 0 && <section className="issues-summary"><div className="issues-heading"><div><span className="eyebrow">À TRAITER EN PRIORITÉ</span><h2>Ce qui mérite ton attention</h2></div><span>{failed.length} problème{failed.length > 1 ? "s" : ""}</span></div><div className="issue-chips">{failed.slice(0,4).map((item,i)=><div className="issue-chip" key={item.label}><span>{String(i + 1).padStart(2,"0")}</span><strong>{item.label}</strong></div>)}</div></section>}

      <SecurityAssistant domain={scan.domain} score={scan.score} issues={assistantIssues} />

      <section className="checks"><div className="section-head"><div><span className="eyebrow">VÉRIFICATION</span><h2>Les checks du scan</h2></div><span>{checks.filter(c=>c.ok).length}/{checks.length} OK</span></div>{checks.map(item=><div className="check" key={item.label}><span className="check-icon">{item.ok ? "✓" : "!"}</span><div><b>{item.label}</b><p>{item.ok ? "Vérification réussie." : "Ce point mérite une correction ou une vérification dans ton code."}</p></div><strong className={item.ok ? "ok" : "bad"}>{item.ok ? "OK" : "À revoir"}</strong></div>)}</section>

      <section className="next"><span className="eyebrow">APRÈS LA CORRECTION</span><h2>Corrige. Puis re-scanne.</h2><p>Le but n'est pas d'obtenir un joli score. Le but est de vérifier que le risque que Lokky a détecté a réellement disparu.</p><Link href="/dashboard/scanner" className="cta">Re-scanner mon SaaS →</Link></section>
    </div>
    <footer><Link href="/dashboard">LOKKY</Link><span>Security for the vibe coding era.</span></footer>
    <style>{`*{box-sizing:border-box}body{margin:0;background:#07050b;color:#fff;font-family:var(--font-geist-sans),Inter,Arial,sans-serif;-webkit-font-smoothing:antialiased}.report-page{min-height:100vh;background:radial-gradient(circle at 50% 0%,#180d28 0%,#08060d 40%,#07050b 75%)}.report-page header{height:68px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;justify-content:space-between;padding:0 max(24px,calc((100% - 1040px)/2))}.logo{color:#fff;text-decoration:none;font-weight:700;letter-spacing:.14em;font-size:14px}.logo span{color:#a855f7;font-size:18px}.cta{display:inline-block;background:#8b5cf6;color:#fff;text-decoration:none;border-radius:8px;padding:10px 15px;font-size:12px;font-weight:600}.report-wrap{max-width:900px;margin:auto;padding:65px 24px}.eyebrow{font:600 10px ui-monospace;color:#a855f7;letter-spacing:.14em}.report-top{display:flex;justify-content:space-between;align-items:center;gap:30px;margin-bottom:30px}.report-top h1{font-size:32px;margin:12px 0 5px;letter-spacing:-.03em;font-weight:650}.report-top p{font-size:12px;color:rgba(255,255,255,.35);margin:0}.score{width:86px;height:86px;border-radius:18px;display:grid;place-items:center;align-content:center;flex-shrink:0}.score b{font-size:40px;line-height:1}.score span{font-size:9px;text-transform:uppercase;margin-top:4px;opacity:.7}.verdict{display:flex;gap:15px;padding:19px;border-radius:13px;border:1px solid;margin-bottom:22px}.verdict.danger{border-color:rgba(239,68,68,.25);background:rgba(239,68,68,.06)}.verdict.good{border-color:rgba(0,212,170,.25);background:rgba(0,212,170,.06)}.verdict-icon{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-weight:700;background:rgba(239,68,68,.12);color:#ef4444;flex-shrink:0}.good .verdict-icon{background:rgba(0,212,170,.12);color:#00d4aa}.verdict b{font-size:14px}.verdict p{font-size:12px;line-height:1.6;color:rgba(255,255,255,.42);margin:5px 0 0}.issues-summary{border:1px solid rgba(239,68,68,.14);background:rgba(239,68,68,.035);border-radius:14px;padding:20px;margin-bottom:2px}.issues-heading{display:flex;justify-content:space-between;align-items:flex-end}.issues-heading h2{font-size:19px;margin:8px 0 0;letter-spacing:-.02em}.issues-heading>span{font-size:10px;color:#ef8888}.issue-chips{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:16px}.issue-chip{display:flex;align-items:center;gap:9px;min-width:0;padding:12px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.05);border-radius:9px}.issue-chip span{width:22px;height:22px;border-radius:6px;background:rgba(239,68,68,.1);color:#ef8888;display:grid;place-items:center;font:600 8px ui-monospace;flex-shrink:0}.issue-chip strong{font-size:10px;line-height:1.4;overflow:hidden;text-overflow:ellipsis}.security-assistant{margin-top:26px}.checks{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);border-radius:14px;padding:24px;margin:0 0 18px}.section-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:15px}.section-head h2{font-size:22px;margin:9px 0 0;letter-spacing:-.02em}.section-head>span{font-size:11px;color:#00d4aa}.check{display:flex;align-items:center;gap:12px;padding:14px 0;border-top:1px solid rgba(255,255,255,.07)}.check-icon{width:27px;height:27px;border-radius:7px;display:grid;place-items:center;background:rgba(255,255,255,.05);color:#00d4aa;font-weight:700}.check:has(.bad) .check-icon{color:#ef4444;background:rgba(239,68,68,.08)}.check b{font-size:13px}.check p{font-size:11px;color:rgba(255,255,255,.35);margin:4px 0 0}.check>strong{margin-left:auto;font-size:10px}.ok{color:#00d4aa}.bad{color:#ef4444}.next{text-align:center;padding:38px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.025);border-radius:14px}.next h2{font-size:28px;margin:9px 0 0}.next p{color:rgba(255,255,255,.4);font-size:13px;line-height:1.7;max-width:550px;margin:10px auto 24px}.report-page footer{max-width:1040px;margin:auto;padding:30px 24px;border-top:1px solid rgba(255,255,255,.07);display:flex;justify-content:space-between;color:rgba(255,255,255,.25);font-size:11px}.report-page footer a{color:#fff;text-decoration:none}@media(max-width:700px){.report-top{align-items:flex-start}.report-top h1{font-size:25px}.score{width:70px;height:70px}.score b{font-size:32px}.report-wrap{padding:45px 18px}.report-page header{padding:0 18px}.issue-chips{grid-template-columns:1fr}.report-page footer{flex-direction:column;gap:12px}.check>strong{font-size:9px}.checks,.issues-summary,.next{padding:18px}}`}</style>
  </main>;
}
