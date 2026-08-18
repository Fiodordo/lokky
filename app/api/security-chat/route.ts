import { NextRequest, NextResponse } from "next/server";

type Issue = { label: string; impact: string };

type ChatMessage = { role: "user" | "assistant"; text: string };

const extractStack = (message: string) => {
  const known = ["Next.js", "NextJS", "React", "Node.js", "Node", "Supabase", "Vercel", "Firebase", "Prisma", "PostgreSQL", "Postgres", "MongoDB", "Mongo", "Express", "Laravel", "Django", "Python", "TypeScript", "JavaScript", "Tailwind", "Cloudflare", "Netlify", "AWS", "Stripe", "Lovable", "Bolt", "Cursor", "Claude Code"];
  return known.filter((name) => message.toLowerCase().includes(name.toLowerCase())).filter((name, i, arr) => arr.indexOf(name) === i);
};

const fallback = (message: string, issues: Issue[], history: ChatMessage[]) => {
  const lower = message.toLowerCase();
  const issue = issues[0];
  const stack = extractStack(message);
  const previousStack = history.flatMap((m) => extractStack(m.text));
  const allStack = [...new Set([...previousStack, ...stack])];
  const stackText = allStack.length ? ` J'ai bien pris en compte ton stack : ${allStack.join(" + ")}.` : "";

  if (lower.includes("cursor") || lower.includes("prompt")) {
    return `Oui. Pour ${issue?.label ?? "le problème détecté"}, voici un prompt prêt à copier dans Cursor :\n\nTu es mon expert sécurité. Mon application utilise ${allStack.length ? allStack.join(" + ") : "mon stack actuel"}. Analyse le projet pour identifier la cause du problème « ${issue?.label ?? "problème de sécurité détecté par Lokky"} ». Explique-moi d'abord ce qui pose problème, puis applique la correction la plus simple et sûre. Ne casse aucune fonctionnalité existante. Vérifie aussi que la correction fonctionne.\n\nUne fois terminé, reviens dans Lokky et re-scanne mon SaaS.${stackText}`;
  }
  if (lower.includes("stack") || allStack.length > 0) {
    return `Parfait, je peux adapter la correction à ce stack.${stackText || " Donne-moi par exemple « Next.js + Supabase + Vercel »."}\n\nLe problème prioritaire est « ${issue?.label ?? "le premier problème détecté"} ». ${issue?.impact ?? "Il mérite d'être vérifié avant de mettre ton SaaS en production."}\n\nSi tu veux, je peux maintenant te donner le prompt Cursor exact pour ce stack.`;
  }
  if (lower.includes("quoi") || lower.includes("faire") || lower.includes("corriger")) {
    return `Commence par « ${issue?.label ?? "le premier problème détecté"} ». Tu n'as pas besoin de devenir expert en sécurité : ${allStack.length ? `avec ${allStack.join(" + ")}, ` : ""}ouvre ton projet dans Cursor et demande-lui d'appliquer une correction sûre. Ensuite, re-scanne.\n\n${stackText}`;
  }
  if (lower.includes("grave") || lower.includes("danger")) {
    return `Le score est un signal, pas une preuve d'attaque. Le point à surveiller en priorité est « ${issue?.label ?? "le problème détecté"} » : ${issue?.impact ?? "il peut augmenter le risque pour ton application"}. Je peux te montrer concrètement ce que ça change et comment le corriger.${stackText}`;
  }
  return `Je peux t'aider à corriger « ${issue?.label ?? "ton problème de sécurité"} » sans jargon. ${allStack.length ? `Je note ton stack ${allStack.join(" + ")} et j'adapterai la suite à celui-ci.` : "Donne-moi ton stack, par exemple Next.js + Supabase + Vercel, et je l'adapterai."}`;
};

export async function POST(request: NextRequest) {
  try {
    const { domain, score, issues = [], message, history = [] } = await request.json();
    if (!message) return NextResponse.json({ error: "Message manquant" }, { status: 400 });

    const key = process.env.OPENAI_API_KEY;
    if (!key) return NextResponse.json({ reply: fallback(message, issues, history) });

    const context = issues.map((i: Issue) => `- ${i.label}: ${i.impact}`).join("\n");
    const conversation = history.slice(-10).map((m: ChatMessage) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
    const system = `Tu es Lokky Assistant, un copilote de sécurité pour des SaaS makers et vibe coders non experts. Réponds en français, simplement, sans jargon inutile. Tu dois adapter chaque réponse au contexte fourni par l'utilisateur. Si l'utilisateur donne un stack (ex. Next.js + Supabase + Vercel), mémorise-le pendant toute la conversation, confirme-le brièvement et adapte les instructions à ce stack. Ne demande pas à nouveau une information déjà donnée. Si le stack est incomplet, dis ce qui manque seulement si c'est réellement nécessaire. Tu peux expliquer, proposer des étapes courtes et fournir un prompt prêt à copier dans Cursor/Claude Code. Ne prétends jamais avoir accès au code si ce n'est pas fourni. Ne donne pas de procédure offensive permettant d'attaquer un tiers. Contexte du scan: domaine=${domain}, score=${score}. Problèmes détectés:\n${context || "aucun problème détaillé"}`;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: 0.25, max_tokens: 900, messages: [{ role: "system", content: system }, ...conversation, { role: "user", content: message }] }),
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ reply: fallback(message, issues, history) });
    return NextResponse.json({ reply: data.choices?.[0]?.message?.content || fallback(message, issues, history) });
  } catch {
    return NextResponse.json({ reply: "Je peux t'aider à corriger ce problème. Donne-moi ton stack (Next.js, Vercel, Supabase, etc.) et ce que tu veux faire." });
  }
}
