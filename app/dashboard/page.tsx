"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Scan = { domain: string; score: string; created_at: string };

const scoreTone = (s: string | null) => {
  if (s === "A" || s === "B") return { color: "#22c55e", bg: "rgba(34,197,94,.10)", label: "Bon", value: 82 };
  if (s === "C") return { color: "#f59e0b", bg: "rgba(245,158,11,.10)", label: "À corriger", value: 68 };
  if (s === "D" || s === "F") return { color: "#ef4444", bg: "rgba(239,68,68,.10)", label: "Risque", value: 42 };
  return { color: "#a855f7", bg: "rgba(168,85,247,.10)", label: "Pas encore scanné", value: 0 };
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export default function DashboardHome() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) loadScans(data.user.id);
      else setLoading(false);
    });
  }, []);

  async function loadScans(uid: string) {
    const { data } = await supabase
      .from("scans")
      .select("domain, score, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(8);
    setScans(data ?? []);
    setLoading(false);
  }

  const latest = scans[0];
  const tone = scoreTone(latest?.score ?? null);
  const username = "Maker";

  return (
    <div className="lk-dashboard-home">
      <section className="lk-dashboard-head">
        <div>
          <div className="lk-welcome">Bienvenue, {username} 👋</div>
          <h1>Ton SaaS, <em>prêt pour la prod ?</em></h1>
          <p>Lokky analyse ton app et t'aide à corriger les failles avant qu'il ne soit trop tard.</p>
        </div>
        <Link href="/dashboard/scanner" className="lk-main-cta">+ Scanner un SaaS</Link>
      </section>

      {latest ? (
        <section className="lk-latest-card">
          <div className="lk-latest-domain">
            <span className="lk-overline">DERNIER SCAN · {formatDate(latest.created_at)}</span>
            <h2>{latest.domain} <span className="lk-external">↗</span></h2>
            <p>Scanné à {formatTime(latest.created_at)}</p>
          </div>

          <div className="lk-latest-metric">
            <span className="lk-overline">SCORE DE SÉCURITÉ</span>
            <div className="lk-score-ring" style={{ "--score-color": tone.color, "--score-angle": `${Math.max(tone.value, 8) * 3.6}deg` } as React.CSSProperties}>
              <strong>{latest.score}</strong>
              <span>/100</span>
            </div>
          </div>

          <div className="lk-latest-risk">
            <span className="lk-overline">NIVEAU DE RISQUE</span>
            <span className="lk-risk-badge" style={{ color: tone.color, borderColor: `${tone.color}44`, background: tone.bg }}>{tone.label}</span>
            <p>{latest.score === "A" || latest.score === "B" ? "Aucun risque majeur détecté" : "3 problèmes détectés"}</p>
          </div>

          <Link href="/dashboard/history" className="lk-report-btn">Voir le rapport <span>→</span></Link>
        </section>
      ) : (
        <section className="lk-latest-card lk-empty-card">
          <div className="lk-empty-icon">⌁</div>
          <div className="lk-latest-domain"><span className="lk-overline">PREMIER SCAN</span><h2>Ton SaaS n'a pas encore été scanné.</h2><p>Commence par vérifier ton application.</p></div>
          <Link href="/dashboard/scanner" className="lk-report-btn">Lancer le scan →</Link>
        </section>
      )}

      <div className="lk-content-grid">
        <section className="lk-panel">
          <div className="lk-panel-head">
            <div><h3>Scans récents</h3><p>Les dernières vérifications de tes projets</p></div>
            <Link href="/dashboard/history">Tout voir →</Link>
          </div>
          {loading ? (
            <div className="lk-panel-empty">Chargement...</div>
          ) : scans.length === 0 ? (
            <div className="lk-panel-empty">Aucun scan pour le moment.</div>
          ) : (
            <div className="lk-scan-table">
              {scans.slice(0, 5).map((scan, index) => {
                const t = scoreTone(scan.score);
                return (
                  <Link href="/dashboard/history" className="lk-scan-item" key={`${scan.domain}-${scan.created_at}-${index}`}>
                    <span className="lk-site-icon">◎</span>
                    <span className="lk-scan-info"><strong>{scan.domain}</strong><small>{formatDate(scan.created_at)} · {formatTime(scan.created_at)}</small></span>
                    <span className="lk-grade" style={{ color: t.color, background: t.bg, borderColor: `${t.color}33` }}>{scan.score}</span>
                    <span className="lk-score-number">{t.value}/100</span>
                    <span className="lk-row-arrow">›</span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="lk-panel lk-next-panel">
          <div className="lk-panel-head"><div><h3>À faire ensuite</h3><p>Le chemin le plus court vers un SaaS plus safe</p></div></div>
          <Link href="/dashboard/scanner" className="lk-next-item">
            <span className="lk-step-dot">1</span><span className="lk-step-copy"><strong>Scanner ton SaaS</strong><small>Découvre ton score et les risques détectés</small></span><span className="lk-step-action">Scanner →</span>
          </Link>
          <Link href="/dashboard/guides" className="lk-next-item">
            <span className="lk-step-dot">2</span><span className="lk-step-copy"><strong>Corriger un problème</strong><small>Suis nos guides ou copie le prompt pour ton IA</small></span><span className="lk-step-action">Guides →</span>
          </Link>
          <Link href="/dashboard/scanner" className="lk-next-item last">
            <span className="lk-step-dot">3</span><span className="lk-step-copy"><strong>Re-scanner après correction</strong><small>Vérifie que ton score s'améliore</small></span><span className="lk-step-action">Re-scanner →</span>
          </Link>
        </section>
      </div>

      <section className="lk-maker-tip">
        <div className="lk-tip-icon">✦</div>
        <div className="lk-tip-copy"><span>MAKER TIP</span><h3>Ne cherche pas la perfection avant de shipper.</h3><p>Commence par éliminer les risques critiques, puis améliore ton score petit à petit.</p></div>
        <Link href="/dashboard/guides" className="lk-tip-btn">Voir les guides →</Link>
      </section>

      <style jsx global>{`
        .lk-dashboard-home{width:100%;max-width:1180px;margin:0 auto;color:#f8fafc;font-family:var(--font-geist-sans),Geist,Inter,Arial,sans-serif;letter-spacing:-.01em}
        .lk-dashboard-home *{box-sizing:border-box}
        .lk-dashboard-head{display:flex;align-items:flex-end;justify-content:space-between;gap:32px;margin-bottom:30px}
        .lk-welcome{font-size:13px;color:#a7a2b2;margin-bottom:9px;font-weight:450}
        .lk-dashboard-head h1{font-size:38px;line-height:1.05;letter-spacing:-.045em;font-weight:650;margin:0 0 10px}
        .lk-dashboard-head h1 em{font-style:normal;color:#a855f7}
        .lk-dashboard-head p{font-size:14px;line-height:1.6;color:#858091;margin:0;max-width:680px}
        .lk-main-cta{display:inline-flex;align-items:center;justify-content:center;white-space:nowrap;background:linear-gradient(135deg,#9333ea,#7c3aed);color:#fff;text-decoration:none;padding:13px 18px;border-radius:10px;font-size:13px;font-weight:600;box-shadow:0 12px 34px rgba(124,58,237,.24)}
        .lk-latest-card{min-height:165px;display:grid;grid-template-columns:minmax(260px,1.4fr) 180px 210px auto;align-items:center;gap:26px;padding:26px 28px;background:linear-gradient(115deg,rgba(139,92,246,.09),rgba(255,255,255,.018));border:1px solid rgba(139,92,246,.22);border-radius:16px;margin-bottom:24px}
        .lk-latest-domain{min-width:0}.lk-overline{display:block;font:600 10px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.1em;color:#625d6e;text-transform:uppercase}.lk-latest-domain h2{font-size:25px;letter-spacing:-.035em;margin:10px 0 5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.lk-latest-domain p{font-size:12px;color:#6e687a;margin:0}.lk-external{font-size:15px;color:#777183;margin-left:5px}
        .lk-latest-metric,.lk-latest-risk{border-left:1px solid rgba(255,255,255,.07);padding-left:26px}.lk-score-ring{width:76px;height:76px;margin-top:8px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at center,#100d15 58%,transparent 59%),conic-gradient(var(--score-color) var(--score-angle),rgba(255,255,255,.07) 0deg);position:relative}.lk-score-ring:after{content:"";position:absolute;inset:-1px;border-radius:50%;background:inherit;z-index:-1}.lk-score-ring strong{font-size:24px;line-height:1;color:var(--score-color)}.lk-score-ring span{font-size:9px;color:#716b7b;margin-top:2px}
        .lk-risk-badge{display:inline-flex;margin-top:11px;padding:7px 15px;border:1px solid;border-radius:9px;font-size:12px;font-weight:600}.lk-latest-risk p{font-size:11px;color:#8b8594;margin:9px 0 0}.lk-report-btn{justify-self:end;white-space:nowrap;text-decoration:none;color:#e9e5ef;border:1px solid rgba(255,255,255,.1);padding:11px 15px;border-radius:9px;font-size:12px;font-weight:500;transition:.2s}.lk-report-btn:hover,.lk-tip-btn:hover{background:rgba(255,255,255,.04);border-color:rgba(168,85,247,.35)}.lk-report-btn span{color:#a855f7;margin-left:7px}
        .lk-empty-card{grid-template-columns:60px 1fr auto}.lk-empty-icon{width:54px;height:54px;border-radius:15px;background:rgba(168,85,247,.1);color:#a855f7;display:grid;place-items:center;font-size:25px}
        .lk-content-grid{display:grid;grid-template-columns:1.06fr .94fr;gap:20px}.lk-panel{background:rgba(13,10,18,.72);border:1px solid rgba(255,255,255,.075);border-radius:16px;overflow:hidden}.lk-panel-head{display:flex;align-items:center;justify-content:space-between;padding:21px 22px;border-bottom:1px solid rgba(255,255,255,.065)}.lk-panel-head h3{font-size:15px;letter-spacing:-.02em;margin:0 0 5px;font-weight:600}.lk-panel-head p{font-size:11px;color:#6f6978;margin:0}.lk-panel-head a{font-size:11px;color:#b16cff;text-decoration:none}.lk-panel-empty{padding:45px 22px;color:#6f6978;font-size:12px}
        .lk-scan-table{display:flex;flex-direction:column}.lk-scan-item{min-width:0;display:grid;grid-template-columns:25px minmax(0,1fr) 34px 62px 18px;align-items:center;column-gap:12px;padding:14px 20px;border-bottom:1px solid rgba(255,255,255,.05);text-decoration:none;transition:.16s}.lk-scan-item:last-child{border-bottom:0}.lk-scan-item:hover{background:rgba(255,255,255,.025)}.lk-site-icon{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;border:1px solid rgba(255,255,255,.12);color:#8d8797;font-size:12px}.lk-scan-info{min-width:0}.lk-scan-info strong{display:block;color:#e9e6ee;font-size:12px;font-weight:550;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.lk-scan-info small{display:block;color:#625d6d;font-size:9px;margin-top:4px}.lk-grade{width:29px;height:29px;display:grid;place-items:center;border:1px solid;border-radius:7px;font-size:12px;font-weight:700}.lk-score-number{font-size:10px;color:#8b8594;text-align:right}.lk-row-arrow{color:#625d6d;font-size:20px;text-align:right}
        .lk-next-item{position:relative;display:grid;grid-template-columns:38px minmax(0,1fr) auto;align-items:center;gap:13px;padding:18px 20px;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.05);transition:.16s}.lk-next-item:hover{background:rgba(255,255,255,.025)}.lk-next-item.last{border-bottom:0}.lk-step-dot{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#9333ea,#6d28d9);color:#fff;font-size:12px;font-weight:650;box-shadow:0 4px 15px rgba(124,58,237,.22)}.lk-step-copy{min-width:0}.lk-step-copy strong{display:block;color:#e9e6ee;font-size:12px;font-weight:600;margin-bottom:4px}.lk-step-copy small{display:block;color:#716b7b;font-size:10px;line-height:1.45}.lk-step-action{white-space:nowrap;color:#b9b0c7;border:1px solid rgba(255,255,255,.09);border-radius:8px;padding:8px 10px;font-size:9px}.lk-maker-tip{display:flex;align-items:center;gap:17px;margin-top:20px;padding:21px 22px;border:1px solid rgba(139,92,246,.22);background:linear-gradient(100deg,rgba(139,92,246,.08),rgba(255,255,255,.018));border-radius:16px}.lk-tip-icon{width:42px;height:42px;flex:0 0 42px;border-radius:50%;display:grid;place-items:center;color:#d8b4fe;background:rgba(139,92,246,.18);font-size:19px;box-shadow:0 0 25px rgba(139,92,246,.13)}.lk-tip-copy{min-width:0}.lk-tip-copy>span{display:block;color:#c084fc;font-size:10px;font-weight:600;letter-spacing:.08em}.lk-tip-copy h3{font-size:13px;margin:6px 0 4px;font-weight:550}.lk-tip-copy p{font-size:10px;color:#716b7b;margin:0}.lk-tip-btn{margin-left:auto;white-space:nowrap;text-decoration:none;color:#cfc8d6;border:1px solid rgba(255,255,255,.1);padding:10px 13px;border-radius:8px;font-size:10px}
        @media(max-width:1050px){.lk-latest-card{grid-template-columns:1.3fr 150px 180px}.lk-report-btn{grid-column:1/-1;justify-self:start}.lk-content-grid{grid-template-columns:1fr}.lk-dashboard-head h1{font-size:34px}}
        @media(max-width:700px){.lk-dashboard-head{align-items:flex-start;flex-direction:column}.lk-dashboard-head h1{font-size:29px}.lk-main-cta{width:100%}.lk-latest-card{grid-template-columns:1fr 1fr;gap:20px;padding:21px}.lk-latest-domain{grid-column:1/-1}.lk-latest-metric,.lk-latest-risk{border-left:0;padding-left:0}.lk-latest-risk{padding-left:18px;border-left:1px solid rgba(255,255,255,.07)}.lk-report-btn{grid-column:1/-1}.lk-scan-item{grid-template-columns:25px minmax(0,1fr) 32px 18px}.lk-score-number{display:none}.lk-step-action{display:none}.lk-maker-tip{align-items:flex-start;flex-wrap:wrap}.lk-tip-btn{margin-left:59px}}
        @media(max-width:430px){.lk-latest-card{grid-template-columns:1fr}.lk-latest-domain,.lk-report-btn{grid-column:auto}.lk-latest-risk{border-left:0;padding-left:0}.lk-scan-item{padding:13px 14px;column-gap:8px}.lk-panel-head{padding:18px 16px}.lk-dashboard-head p{font-size:13px}}
      `}</style>
    </div>
  );
}
