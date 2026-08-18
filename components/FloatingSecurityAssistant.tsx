"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Message = { role: "user" | "assistant"; text: string };
type Scan = { domain: string; score: string; security_headers?: Record<string, boolean>; ssl_valid?: boolean; https_redirect?: boolean };

export default function FloatingSecurityAssistant({ locale }: { locale: "fr" | "en" }) {
  const [open, setOpen] = useState(false);
  const [scan, setScan] = useState<Scan | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const fr = locale === "fr";

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      supabase.from("scans").select("domain, score, security_headers, ssl_valid, https_redirect").eq("user_id", data.user.id).order("created_at", { ascending: false }).limit(1).maybeSingle().then(({ data: latest }) => {
        if (latest) {
          setScan(latest);
          setMessages([{ role: "assistant", text: fr ? `Je connais ton dernier scan de ${latest.domain}. Demande-moi ce que tu veux comprendre ou corriger.` : `I know your latest scan for ${latest.domain}. Ask me what you want to understand or fix.` }]);
        } else {
          setMessages([{ role: "assistant", text: fr ? "Je suis là pour t'aider à sécuriser ton SaaS. Lance d'abord un scan, puis demande-moi quoi corriger." : "I'm here to help you secure your SaaS. Run a scan first, then ask me what to fix." }]);
        }
      });
    });
  }, [fr]);

  async function send(text = input) {
    const value = text.trim();
    if (!value || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, text: value }];
    setMessages(next);
    setLoading(true);
    const issues = scan ? [
      ...(scan.ssl_valid === false ? [{ label: fr ? "Certificat SSL" : "SSL certificate", impact: fr ? "Le certificat SSL doit être vérifié." : "The SSL certificate should be checked." }] : []),
      ...(scan.https_redirect === false ? [{ label: fr ? "Redirection HTTPS" : "HTTPS redirect", impact: fr ? "Les visiteurs devraient être redirigés vers HTTPS." : "Visitors should be redirected to HTTPS." }] : []),
      ...Object.entries(scan.security_headers || {}).filter(([, ok]) => !ok).map(([key]) => ({ label: key, impact: fr ? "Protection navigateur manquante." : "Missing browser protection." })),
    ] : [];
    try {
      const res = await fetch("/api/security-chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain: scan?.domain || "", score: scan?.score || "", issues, message: value, history: next.slice(-8), locale }) });
      const data = await res.json();
      setMessages(current => [...current, { role: "assistant", text: data.reply || (fr ? "Je n'ai pas réussi à préparer une réponse." : "I couldn't prepare a response.") }]);
    } catch {
      setMessages(current => [...current, { role: "assistant", text: fr ? "Je n'arrive pas à répondre pour le moment." : "I can't answer right now." }]);
    } finally { setLoading(false); }
  }

  return <>
    <button className={`lk-float-ai ${open ? "open" : ""}`} onClick={() => setOpen(v => !v)} aria-label={fr ? "Ouvrir Lokky Assistant" : "Open Lokky Assistant"}>
      <span>✦</span>{!open && <i>{fr ? "Lokky Assistant" : "Lokky Assistant"}</i>}
    </button>
    {open && <section className="lk-float-panel">
      <header><div><span>LOKKY ASSISTANT</span><strong>{fr ? "Ton copilote sécurité" : "Your security copilot"}</strong></div><button onClick={() => setOpen(false)}>×</button></header>
      {scan && <div className="lk-float-context">{fr ? "Dernier scan" : "Latest scan"}: <b>{scan.domain}</b> · {scan.score}</div>}
      <div className="lk-float-chat">{messages.map((m, i) => <div key={i} className={`lk-float-msg ${m.role}`}>{m.text}</div>)}{loading && <div className="lk-float-msg assistant">{fr ? "Je réfléchis…" : "Thinking…"}</div>}</div>
      <div className="lk-float-suggestions">{[fr ? "Explique-moi mon score" : "Explain my score", fr ? "Que dois-je corriger ?" : "What should I fix?", "Prompt Cursor"].map(s => <button key={s} onClick={() => send(s)}>{s}</button>)}</div>
      <form onSubmit={e => { e.preventDefault(); send(); }}><input value={input} onChange={e => setInput(e.target.value)} placeholder={fr ? "Pose ta question…" : "Ask your question…"} /><button disabled={loading || !input.trim()}>→</button></form>
    </section>}
    <style jsx>{`.lk-float-ai{position:fixed;right:24px;bottom:24px;z-index:60;width:auto;height:48px;padding:0 15px;border:1px solid rgba(168,85,247,.4);border-radius:999px;background:linear-gradient(135deg,#8b5cf6,#6d28d9);color:#fff;display:flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 12px 40px rgba(88,28,135,.35);font-weight:600}.lk-float-ai span{font-size:17px}.lk-float-ai i{font-style:normal;font-size:11px}.lk-float-ai.open{width:48px;padding:0;justify-content:center}.lk-float-panel{position:fixed;right:24px;bottom:84px;width:min(390px,calc(100vw - 28px));z-index:59;background:#0d0a13;border:1px solid rgba(168,85,247,.28);border-radius:16px;box-shadow:0 25px 80px rgba(0,0,0,.5);overflow:hidden;color:#fff}.lk-float-panel header{display:flex;align-items:center;justify-content:space-between;padding:16px 17px;border-bottom:1px solid rgba(255,255,255,.07)}.lk-float-panel header span{display:block;font:600 9px ui-monospace;color:#a855f7;letter-spacing:.13em}.lk-float-panel header strong{display:block;font-size:14px;margin-top:4px}.lk-float-panel header button{border:0;background:none;color:#64748b;font-size:22px;cursor:pointer}.lk-float-context{padding:9px 17px;font-size:10px;color:#64748b;border-bottom:1px solid rgba(255,255,255,.05)}.lk-float-chat{height:245px;overflow:auto;padding:13px;display:flex;flex-direction:column;gap:9px}.lk-float-msg{max-width:88%;padding:9px 11px;border-radius:10px;font-size:11px;line-height:1.6;white-space:pre-wrap}.lk-float-msg.assistant{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.06);color:#cbd5e1;align-self:flex-start}.lk-float-msg.user{background:#8b5cf6;color:#fff;align-self:flex-end}.lk-float-suggestions{display:flex;gap:6px;padding:0 13px 10px;overflow:auto}.lk-float-suggestions button{white-space:nowrap;border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.035);color:#aeb4c0;border-radius:999px;padding:7px 9px;font-size:9px;cursor:pointer}.lk-float-panel form{display:flex;gap:7px;padding:12px;border-top:1px solid rgba(255,255,255,.07)}.lk-float-panel input{flex:1;min-width:0;border:1px solid rgba(255,255,255,.09);background:#09070d;color:#fff;border-radius:9px;padding:10px;font-size:11px;outline:none}.lk-float-panel form>button{width:36px;border:0;border-radius:9px;background:#8b5cf6;color:#fff;cursor:pointer}.lk-float-panel form>button:disabled{opacity:.4}@media(max-width:600px){.lk-float-ai{right:14px;bottom:14px}.lk-float-panel{right:14px;bottom:72px}}`}</style>
  </>;
}
