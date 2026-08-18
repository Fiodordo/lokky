"use client";

import { FormEvent, useMemo, useState } from "react";

type Issue = { label: string; impact: string };
type Props = { domain: string; score: string; issues: Issue[]; locale?: "fr" | "en" };
type Message = { role: "user" | "assistant"; text: string };

const STACKS = [
  "Next.js", "React", "Node.js", "Supabase", "Vercel", "Firebase", "Prisma",
  "PostgreSQL", "MongoDB", "Express", "Laravel", "Django", "Python", "TypeScript",
  "JavaScript", "Tailwind", "Cloudflare", "Netlify", "AWS", "Stripe", "Lovable",
  "Bolt", "Cursor", "Claude Code",
];

function extractStack(text: string) {
  const lower = text.toLowerCase();
  return STACKS.filter((name) => lower.includes(name.toLowerCase()));
}

export default function SecurityAssistant({ domain, score, issues, locale = "fr" }: Props) {
  const en = locale === "en";
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: en
        ? `I have the scan context for ${domain}. Tell me your stack or what you want to fix. I'll adapt to your project without jargon.`
        : `J'ai le contexte du scan de ${domain}. Donne-moi ton stack ou décris ce que tu veux corriger. Je m'adapterai à ton projet, sans jargon.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const detected = useMemo(
    () => Array.from(new Set(messages.flatMap((message) => extractStack(message.text)))),
    [messages]
  );

  async function send(text = input) {
    const value = text.trim();
    if (!value || loading) return;

    const history = messages.slice(-8);
    setInput("");
    setMessages((current) => [...current, { role: "user", text: value }]);
    setLoading(true);

    try {
      const response = await fetch("/api/security-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          score,
          issues,
          message: value,
          history,
          locale,
        }),
      });
      const data = await response.json();
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            data.reply ||
            (en ? "I couldn't prepare a response. Try again." : "Je n'ai pas réussi à préparer une réponse. Réessaie."),
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: en
            ? "I can't answer right now. Check your connection and try again."
            : "Je n'arrive pas à répondre pour le moment. Vérifie ta connexion puis réessaie.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = en
    ? ["Explain it simply", "What should I do now?", "Give me a Cursor prompt"]
    : ["Explique-moi simplement", "Que dois-je faire maintenant ?", "Donne-moi un prompt Cursor"];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send();
  }

  return (
    <section className="security-assistant">
      <div className="assistant-inner">
        <div className="assistant-head">
          <div className="assistant-icon">✦</div>
          <div className="assistant-heading">
            <span>LOKKY ASSISTANT</span>
            <h2>{en ? "Fix your SaaS with Lokky" : "Corrige ton SaaS avec Lokky"}</h2>
            <p>
              {en
                ? "Describe your context. I'll adapt to your issue and stack."
                : "Décris ton contexte. Je m'adapte à ton problème et à ton stack."}
            </p>
          </div>
        </div>

        {detected.length > 0 && (
          <div className="assistant-stack">
            <span>{en ? "DETECTED STACK" : "STACK DÉTECTÉ"}</span>
            {detected.map((stack) => <b key={stack}>{stack}</b>)}
          </div>
        )}

        <div className="assistant-suggestions">
          {suggestions.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => void send(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>

        <div className="assistant-chat" aria-live="polite">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`assistant-message ${message.role}`}>
              <div>{message.text}</div>
            </div>
          ))}
          {loading && (
            <div className="assistant-message assistant">
              <div className="typing">{en ? "Lokky is thinking…" : "Lokky réfléchit…"}</div>
            </div>
          )}
        </div>

        <form className="assistant-input" onSubmit={submit}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={en ? "e.g. Next.js + Supabase + Vercel, what should I do?" : "Ex. Next.js + Supabase + Vercel, je fais quoi ?"}
            aria-label={en ? "Message to Lokky" : "Message à Lokky"}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            {loading ? "…" : en ? "Send" : "Envoyer"}
          </button>
        </form>

        <p className="assistant-context">
          {en ? "Never paste secrets, passwords or private keys here." : "Ne colle jamais de secret, mot de passe ou clé privée ici."}
        </p>
      </div>

      <style jsx>{`
        .security-assistant{width:100%;max-width:760px;margin:34px auto 30px;border:1px solid rgba(168,85,247,.22);background:linear-gradient(145deg,rgba(168,85,247,.09),rgba(255,255,255,.025));border-radius:18px;padding:1px;box-shadow:0 20px 60px rgba(0,0,0,.18)}
        .assistant-inner{padding:28px}.assistant-head{display:flex;gap:14px;align-items:flex-start}.assistant-icon{width:40px;height:40px;border-radius:12px;background:rgba(168,85,247,.16);color:#c4b5fd;display:grid;place-items:center;flex-shrink:0;font-size:18px}.assistant-heading span{font:600 9px ui-monospace;color:#a855f7;letter-spacing:.13em}.assistant-heading h2{font-size:22px;letter-spacing:-.03em;margin:5px 0;font-weight:600}.assistant-heading p{font-size:12px;color:#747080;margin:0;line-height:1.55}.assistant-stack{display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin:18px 0 2px;padding:10px 12px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);border-radius:10px}.assistant-stack span{font:600 8px ui-monospace;color:#716b7b;letter-spacing:.1em;margin-right:3px}.assistant-stack b{font-size:10px;font-weight:500;color:#d8c8ff;background:rgba(168,85,247,.09);border:1px solid rgba(168,85,247,.18);padding:4px 7px;border-radius:999px}.assistant-suggestions{display:flex;flex-wrap:wrap;gap:7px;margin:18px 0 15px}.assistant-suggestions button{border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.035);color:#cbd5e1;border-radius:999px;padding:8px 11px;font-size:10px;cursor:pointer}.assistant-chat{display:flex;flex-direction:column;gap:10px;max-height:320px;overflow:auto;margin-bottom:12px;padding:2px}.assistant-message{display:flex}.assistant-message>div{max-width:84%;padding:11px 13px;border-radius:11px;font-size:12px;line-height:1.65;white-space:pre-wrap}.assistant-message.user{justify-content:flex-end}.assistant-message.user>div{background:#8b5cf6;color:#fff}.assistant-message.assistant>div{background:rgba(255,255,255,.045);border:1px solid rgba(255,255,255,.06);color:#cbd5e1}.typing{color:#a78bfa!important}.assistant-input{display:flex;gap:8px}.assistant-input input{flex:1;min-width:0;border:1px solid rgba(255,255,255,.09);background:#0b0910;color:#fff;border-radius:10px;padding:12px 13px;font-size:11px;outline:none}.assistant-input button{border:0;background:#8b5cf6;color:#fff;border-radius:10px;padding:0 17px;font-size:11px;font-weight:600;cursor:pointer;min-width:74px}.assistant-input button:disabled{opacity:.45}.assistant-context{text-align:center;color:#4b4655;font-size:9px;margin:12px 0 0}@media(max-width:600px){.assistant-inner{padding:18px}.assistant-heading h2{font-size:18px}.assistant-message>div{max-width:94%}}
      `}</style>
    </section>
  );
}
