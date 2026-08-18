import { NextRequest, NextResponse } from "next/server";

type Issue = { label: string; impact: string };
type ChatMessage = { role: "user" | "assistant"; text: string };

const knownStacks = ["Next.js", "NextJS", "React", "Node.js", "Node", "Supabase", "Vercel", "Firebase", "Prisma", "PostgreSQL", "Postgres", "MongoDB", "Mongo", "Express", "Laravel", "Django", "Python", "TypeScript", "JavaScript", "Tailwind", "Cloudflare", "Netlify", "AWS", "Stripe", "Lovable", "Bolt", "Cursor", "Claude Code"];

const extractStack = (text: string) => knownStacks.filter((name) => text.toLowerCase().includes(name.toLowerCase())).filter((name, i, arr) => arr.indexOf(name) === i);

const fallback = (message: string, issues: Issue[], history: ChatMessage[]) => {
  const lower = message.toLowerCase();
  const issue = issues[0];
  const allStack = [...new Set([...history.flatMap((m) => extractStack(m.text)), ...extractStack(message)])];
  const stack = allStack.length ? allStack.join(" + ") : "ton stack actuel";
  const context = allStack.length ? `Je garde ton stack en mémoire : ${stack}.` : "Donne-moi ton stack, par exemple Next.js + Supabase + Vercel.";

  if (lower.includes("cursor") || lower.includes("prompt")) {
    return `Voici un prompt prêt à copier dans Cursor pour ${stack} :\n\nTu travailles sur mon application ${stack}. Lokky a détecté « ${issue?.label ?? "un problème de sécurité"} ». Analyse mon projet pour trouver la cause exacte. Explique-moi brièvement le problème, puis applique la correction la plus simple et sûre. Ne casse aucune fonctionnalité existante. Vérifie la correction avant de terminer.\n\n${issue?.impact ? `Contexte : ${issue.impact}\n\n` : ""}Une fois terminé, reviens dans Lokky et re-scanne mon SaaS.`;
  }
  if (allStack.length > 0 || lower.includes("stack")) {
    return `Oui, j'ai compris ton environnement. ${context}\n\nLe problème prioritaire est « ${issue?.label ?? "le problème détecté"} ». ${issue?.impact ?? "Il mérite d'être corrigé avant la mise en production."}\n\nJe peux maintenant te donner les étapes exactes pour ce stack ou te générer le prompt Cursor.`;
  }
  if (lower.includes("quoi") || lower.includes("faire") || lower.includes("corriger")) {
    return `Commence par « ${issue?.label ?? "le premier problème détecté"} ». ${issue?.impact ?? "C'est le point que je traiterais en premier."}\n\n${context}\n\nJe peux te guider étape par étape ou préparer directement un prompt pour ton agent de code.`;
  }
  if (lower.includes("grave") || lower.includes("danger")) {
    return `Le score est un signal, pas une preuve d'attaque. Le point à surveiller en priorité est « ${issue?.label ?? "le problème détecté"} » : ${issue?.impact ?? "il peut augmenter le risque pour ton application"}. ${context}`;
  }
  return `Je peux t'aider à corriger « ${issue?.label ?? "ton problème de sécurité"} » sans jargon. ${context}`;
};

export async function POST(request: NextRequest) {
  try {
    const { domain, score, issues = [], message, history = [] } = await request.json();
    if (typeof message !== "string" || !message.trim()) return NextResponse.json({ error: "Message manquant" }, { status: 400 });

    const key = process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ reply: fallback(message, issues, history) });

    const context = issues.map((i: Issue) => `- ${i.label}: ${i.impact}`).join("\n");
    const conversation = history.slice(-10).map((m: ChatMessage) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
    const system = `Tu es Lokky Assistant, un copilote de sécurité pour des SaaS makers et vibe coders non experts. Réponds en français, simplement, sans jargon inutile. Adapte chaque réponse au contexte fourni. Si l'utilisateur donne un stack, mémorise-le pendant toute la conversation et adapte les instructions à celui-ci. Ne demande jamais à nouveau une information déjà donnée. Si l'utilisateur dit « mon stack est Next.js + Supabase + Vercel », considère cette information comme acquise même si elle n'est pas répétée dans les messages suivants. Tu peux expliquer, proposer des étapes courtes et fournir un prompt prêt à copier dans Cursor ou Claude Code. Ne prétends jamais avoir accès au code si ce n'est pas fourni. Ne donne pas de procédure offensive permettant d'attaquer un tiers. N'utilise jamais et ne demande jamais de secret, mot de passe ou clé privée. Contexte du scan: domaine=${domain}, score=${score}. Problèmes détectés:\n${context || "aucun problème détaillé"}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: 0.2, max_tokens: 900, messages: [{ role: "system", content: system }, ...conversation, { role: "user", content: message.trim() }] }),
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ reply: fallback(message, issues, history) });
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || fallback(message, issues, history) });
  } catch {
    return NextResponse.json({ reply: "Je peux t'aider à corriger ce problème. Donne-moi ton stack (Next.js, Vercel, Supabase, etc.) et ce que tu veux faire." });
  }
}
