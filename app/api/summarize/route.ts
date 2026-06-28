import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, score, sslValid, httpsRedirect, securityHeaders, cookies } = body;

    const issues: string[] = [];
    const strengths: string[] = [];

    if (sslValid) strengths.push("votre certificat SSL est valide");
    else issues.push("votre certificat SSL est invalide ou expiré");

    if (httpsRedirect) strengths.push("la redirection HTTPS est activée");
    else issues.push("votre site n'est pas redirigé automatiquement vers HTTPS");

    const missingHeaders = Object.entries(securityHeaders ?? {}).filter(([, v]) => !v).length;
    if (missingHeaders === 0) strengths.push("tous vos headers de sécurité sont en place");
    else issues.push(`${missingHeaders} protection${missingHeaders > 1 ? "s" : ""} HTTP manquante${missingHeaders > 1 ? "s" : ""}`);

    if (cookies?.found) {
      if (!cookies.secure || !cookies.httpOnly) issues.push("vos cookies ne sont pas entièrement sécurisés");
    }

    const scoreMessages: Record<string, string> = {
      A: "Excellent travail !",
      B: "Bonne sécurité globale.",
      C: "Sécurité correcte mais améliorable.",
      D: "Plusieurs problèmes à corriger rapidement.",
      F: "Votre site présente des risques sérieux.",
    };

    let summary = `${scoreMessages[score] ?? "Scan terminé."} `;

    if (strengths.length > 0) {
      summary += `Points positifs : ${strengths.join(" et ")}. `;
    }

    if (issues.length > 0) {
      summary += `À corriger : ${issues.join(", ")}. `;
      summary += "Consultez les guides de correction pour résoudre ces problèmes rapidement.";
    } else {
      summary += `${domain} est bien protégé — continuez à surveiller régulièrement.`;
    }

    return NextResponse.json({ summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}