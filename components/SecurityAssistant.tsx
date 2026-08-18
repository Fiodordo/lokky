"use client";

import { useState } from "react";

type Props = { domain: string; score: string; issues: { label: string; impact: string }[] };

const suggestions = [
  "Explique-moi le problème simplement",
  "Qu'est-ce que je dois faire maintenant ?",
  "Donne-moi un prompt pour Cursor",
];

export default function SecurityAssistant({ domain, score, issues }: Props) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: `Je connais déjà le scan de ${domain}. Dis-moi ce que tu veux corriger et je te guide étape par étape, sans jargon.` },
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
    <div className="assistant-head">
      <div className="assistant-icon">✦</div>
      <div><span>LOKKY ASSISTANT</span><h2>Besoin d'aide pour corriger ?</h2><p>Pose ta question. Je m'adapte à ton scan et à ton niveau.</p></div>
    </div>
    <div className="assistant-suggestions">{suggestions.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}</div>
    <div className="assistant-chat">{messages.map((m, i) => <div key={i} className={`assistant-message ${m.role}`}><div>{m.text}</div></div>)}{loading && <div className="assistant-message assistant"><div className="typing">Lokky réfléchit…</div></div>}</div>
    <form className="assistant-input" onSubmit={(e) => { e.preventDefault(); send(); }}><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ex. Je suis sur Vercel, je fais quoi ?" /><button disabled={loading || !input.trim()}>Envoyer</button></form>
    <style jsx>{`.security-assistant{margin-bottom:18px;border:1px solid rgba(168,85,247,.18);background:linear-gradient(135deg,rgba(168,85,247,.08),rgba(255,255,255,.025));border-radius:14px;padding:24px}.assistant-head{display:flex;gap:13px;align-items:flex-start}.assistant-icon{width:34px;height:34px;border-radius:10px;background:rgba(168,85,247,.14);color:#c4b5fd;display:grid;place-items:center;flex-shrink:0}.assistant-head span{font:600 9px ui-monospace;color:#a855f7;letter-spacing:.13em}.assistant-head h2{font-size:17px;margin:5px 0}.assistant-head p{font-size:11px;color:#64748b;margin:0}.assistant-suggestions{display:flex;flex-wrap:wrap;gap:7px;margin:18px 0}.assistant-suggestions button{border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);color:#cbd5e1;border-radius:999px;padding:8px 11px;font-size:10px;cursor:pointer}.assistant-suggestions button:hover{border-color:rgba(168,85,247,.3);color:#fff}.assistant-chat{display:flex;flex-direction:column;gap:10px;max-height:300px;overflow:auto;margin-bottom:12px}.assistant-message{display:flex}.assistant-message>div{max-width:82%;padding:10px 12px;border-radius:10px;font-size:12px;line-height:1.65;white-space:pre-wrap}.assistant-message.user{justify-content:flex-end}.assistant-message.user>div{background:#8b5cf6;color:#fff}.assistant-message.assistant>div{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.06);color:#cbd5e1}.typing{color:#a78bfa!important}.assistant-input{display:flex;gap:8px}.assistant-input input{flex:1;min-width:0;border:1px solid rgba(255,255,255,.08);background:#0b0910;color:#fff;border-radius:9px;padding:11px 12px;font-size:11px;outline:none}.assistant-input input:focus{border-color:rgba(168,85,247,.45)}.assistant-input button{border:0;background:#8b5cf6;color:#fff;border-radius:9px;padding:0 15px;font-size:11px;font-weight:600;cursor:pointer}.assistant-input button:disabled{opacity:.45;cursor:not-allowed}@media(max-width:600px){.security-assistant{padding:18px}.assistant-message>div{max-width:94%}.assistant-input button{padding:0 12px}}`}</style>
  </section>;
}
