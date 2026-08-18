import { NextRequest, NextResponse } from "next/server";

const fallback = (message: string, issues: { label: string; impact: string }[]) => {
  const lower = message.toLowerCase();
  const issue = issues[0];
  if (lower.includes("cursor") || lower.includes("prompt")) {
    return `Copie-colle ce prompt dans Cursor :\n\nAnalyse mon application et corrige le problème « ${issue?.label ?? "de sécurité détecté par Lokky"} ». Explique d'abord ce qui est vulnérable, puis applique la correction la plus simple et sûre sans casser les fonctionnalités existantes. Vérifie ensuite que la correction fonctionne.\n\nAprès ça, reviens dans Lokky et re-scanne ton SaaS.`;
  }
  if (lower.includes("quoi") || lower.includes("faire") || lower.includes("corriger")) {
    return `Commence par « ${issue?.label ?? "le premier problème détecté"} ». Tu n'as pas besoin de tout comprendre : ouvre ton projet dans Cursor, décris-lui ce problème et demande-lui de le corriger sans casser l'application. Ensuite, re-scanne. Si tu me dis si tu utilises Vercel, Supabase, Next.js ou autre, je peux te donner les étapes adaptées.`;
  }
  if (lower.includes("grave") || lower.includes("danger")) {
    return `Le score est un signal, pas une preuve d'attaque. Le point à surveiller en priorité est « ${issue?.label ?? "le problème détecté"} » : ${issue?.impact ?? "il peut augmenter le risque pour ton application"}. Je peux t'expliquer ce que ça signifie avec un exemple concret.`;
  }
  return `Pour ${issue?.label ?? "ton problème de sécurité"}, je peux te guider simplement. Dis-moi ton stack (par exemple Next.js + Supabase + Vercel) ou demande-moi directement « donne-moi le prompt Cursor ».`;
};

export async function POST(request: NextRequest) {
  try {
    const { domain, score, issues = [], message, history = [] } = await request.json();
    if (!message) return NextResponse.json({ error: "Message manquant" }, { status: 400 });

    const key = process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ reply: fallback(message, issues) });

    const context = issues.map((i: { label: string; impact: string }) => `- ${i.label}: ${i.impact}`).join("\n");
    const system = `Tu es Lokky Assistant, un copilote de sécurité pour des SaaS makers et vibe coders non experts en cybersécurité. Réponds en français, simplement, sans jargon. Tu aides à corriger les problèmes détectés sur leur SaaS. Ne prétends jamais avoir accès au code si ce n'est pas fourni. Donne des étapes courtes et concrètes. Quand utile, fournis un prompt prêt à copier dans Cursor/Claude Code. Ne donne pas de procédure offensive permettant d'attaquer un tiers. Contexte du scan: domaine=${domain}, score=${score}. Problèmes: ${context || "aucun problème détaillé"}.`;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: 0.3, max_tokens: 700, messages: [{ role: "system", content: system }, ...history.slice(-8).map((m: { role: string; text: string }) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text })), { role: "user", content: message }] }),
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ reply: fallback(message, issues) });
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || fallback(message, issues) });
  } catch {
    return NextResponse.json({ reply: "Je peux t'aider à corriger ce problème. Dis-moi simplement ton stack (Next.js, Vercel, Supabase, etc.) et ce que tu veux faire." });
  }
}
