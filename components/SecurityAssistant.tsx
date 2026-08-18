"use client";

import { useState } from "react";

type Props = { domain: string; score: string; issues: { label: string; impact: string }[] };

const suggestions = [
  "Explique-moi simplement",
  "Que dois-je faire maintenant ?",
  "Donne-moi un prompt Cursor",
];

export default function SecurityAssistant({ domain, score, issues }: Props) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: `Je connais le scan de ${domain}. Tu peux me donner ton stack (ex. Next.js + Supabase + Vercel), ton code ou simplement me dire ce que tu veux faire. Je t'expliquerai quoi corriger, sans jargon.` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text = input) {
    const value = text.trim();
    if (!value || loading) return;
    setInput("");
    const next = [...messages, { role: "user" as const, text: value }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/security-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, score, issues, message: value, history: next.slice(-8) }),
      });
      const data = await res.json();
      setMessages((current) => [...current, { role: "assistant", text: data.reply || "Je n'ai pas réussi à préparer une réponse. Réessaie." }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", text: "Je n'arrive pas à répondre pour le moment. Vérifie ta connexion puis réessaie." }]);
    } finally { setLoading(false); }
  }

  return <section className="security-assistant">
    <div className="assistant-inner">
      <div className="assistant-head">
        <div className="assistant-icon">✦</div>
        <div><span>LOKKY ASSISTANT</span><h2>Ton copilote pour corriger ton SaaS</h2><p>Explique-moi ton contexte. Je m'adapte à ton stack et à ton problème.</p></div>
      </div>
      <div className="assistant-suggestions">{suggestions.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}</div>
      <div className="assistant-chat">{messages.map((m, i) => <div key={i} className={`assistant-message ${m.role}`}><div>{m.text}</div></div>)}{loading && <div className="assistant-message assistant"><div className="typing">Lokky réfléchit…</div></div>}</div>
      <form className="assistant-input" onSubmit={(e) => { e.preventDefault(); send(); }}><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ex. Next.js + Supabase + Vercel, je fais quoi ?" /><button disabled={loading || !input.trim()}>Envoyer</button></form>
      <p className="assistant-context">Lokky utilise ton scan comme contexte. Tu peux préciser ton stack, ton hébergeur ou coller un extrait de code.</p>
    </div>
    <style jsx>{`.security-assistant{width:100%;max-width:720px;margin:30px auto 26px;border:1px solid rgba(168,85,247,.22);background:linear-gradient(145deg,rgba(168,85,247,.09),rgba(255,255,255,.025));border-radius:18px;padding:1px;box-shadow:0 20px 60px rgba(0,0,0,.18)}.assistant-inner{padding:26px}.assistant-head{display:flex;gap:14px;align-items:flex-start;text-align:left}.assistant-icon{width:38px;height:38px;border-radius:11px;background:rgba(168,85,247,.16);color:#c4b5fd;display:grid;place-items:center;flex-shrink:0;font-size:17px}.assistant-head span{font:600 9px ui-monospace;color:#a855f7;letter-spacing:.13em}.assistant-head h2{font-size:20px;letter-spacing:-.025em;margin:5px 0 5px;font-weight:600}.assistant-head p{font-size:12px;color:#64748b;margin:0;line-height:1.55}.assistant-suggestions{display:flex;flex-wrap:wrap;gap:7px;margin:20px 0 15px}.assistant-suggestions button{border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.035);color:#cbd5e1;border-radius:999px;padding:8px 11px;font-size:10px;cursor:pointer}.assistant-suggestions button:hover{border-color:rgba(168,85,247,.35);color:#fff;background:rgba(168,85,247,.07)}.assistant-chat{display:flex;flex-direction:column;gap:10px;max-height:280px;overflow:auto;margin-bottom:12px;padding:2px}.assistant-message{display:flex}.assistant-message>div{max-width:84%;padding:11px 13px;border-radius:11px;font-size:12px;line-height:1.65;white-space:pre-wrap}.assistant-message.user{justify-content:flex-end}.assistant-message.user>div{background:#8b5cf6;color:#fff}.assistant-message.assistant>div{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.06);color:#cbd5e1}.typing{color:#a78bfa!important}.assistant-input{display:flex;gap:8px}.assistant-input input{flex:1;min-width:0;border:1px solid rgba(255,255,255,.09);background:#0b0910;color:#fff;border-radius:10px;padding:12px 13px;font-size:11px;outline:none}.assistant-input input:focus{border-color:rgba(168,85,247,.5)}.assistant-input button{border:0;background:#8b5cf6;color:#fff;border-radius:10px;padding:0 17px;font-size:11px;font-weight:600;cursor:pointer}.assistant-input button:disabled{opacity:.45;cursor:not-allowed}.assistant-context{text-align:center;color:#475569;font-size:9px;margin:12px 0 0}@media(max-width:600px){.security-assistant{margin-top:24px}.assistant-inner{padding:18px}.assistant-head h2{font-size:17px}.assistant-message>div{max-width:94%}.assistant-input button{padding:0 12px}}`}</style>
  </section>;
}
