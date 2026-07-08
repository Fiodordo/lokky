import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const headerLabels: Record<string, string> = {
  "strict-transport-security": "Force HTTPS (HSTS)",
  "x-content-type-options": "Protection contre le sniffing",
  "x-frame-options": "Protection contre le clickjacking",
  "content-security-policy": "Protection contre les scripts malveillants",
};

export async function POST(request: NextRequest) {
  try {
    const { email, domain, score, sslValid, httpsRedirect, headers } = await request.json();

    if (!email || !domain) {
      return NextResponse.json({ error: "Email et domaine requis" }, { status: 400 });
    }

    const issuesList = [
      !sslValid && "Certificat SSL invalide ou expiré",
      !httpsRedirect && "Redirection HTTPS manquante",
      ...Object.entries(headers as Record<string, boolean>)
        .filter(([, v]) => !v)
        .map(([k]) => headerLabels[k] ?? k),
    ].filter(Boolean);

    const okList = [
      sslValid && "Certificat SSL valide",
      httpsRedirect && "Redirection HTTPS active",
      ...Object.entries(headers as Record<string, boolean>)
        .filter(([, v]) => v)
        .map(([k]) => headerLabels[k] ?? k),
    ].filter(Boolean);

    const scoreEmoji = score === "A" ? "🟢" : score === "B" ? "🟡" : score === "C" ? "🟠" : "🔴";

    await resend.emails.send({
      from: "Lokky <onboarding@resend.dev>",
      to: email,
      subject: `Rapport de sécurité de ${domain} — Score ${score}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #0a1929; color: #e0f0f8;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #00d4aa; font-size: 24px; margin-bottom: 4px;">LOKKY</h1>
            <p style="color: #5a8a9f; font-size: 13px;">Rapport de sécurité</p>
          </div>

          <div style="background: #0d1f2d; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
            <p style="color: #5a8a9f; font-size: 12px; margin-bottom: 8px;">Score de sécurité pour</p>
            <p style="color: #e0f0f8; font-size: 20px; font-weight: 600; margin-bottom: 16px;">${domain}</p>
            <div style="display: inline-block; background: rgba(0,212,170,0.1); border-radius: 10px; padding: 12px 24px;">
              <p style="font-size: 48px; font-weight: 700; color: ${score === "A" || score === "B" ? "#00d4aa" : score === "C" ? "#f59e0b" : "#ef4444"}; margin: 0;">${scoreEmoji} ${score}</p>
            </div>
          </div>

          ${issuesList.length > 0 ? `
          <div style="background: #0d1f2d; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
            <h2 style="color: #ef4444; font-size: 14px; margin-bottom: 16px;">⚠ ${issuesList.length} problème${issuesList.length > 1 ? "s" : ""} détecté${issuesList.length > 1 ? "s" : ""}</h2>
            ${issuesList.map(issue => `
              <div style="display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 0.5px solid #1a3a4a;">
                <span style="color: #ef4444;">✗</span>
                <span style="color: #e0f0f8; font-size: 13px;">${issue}</span>
              </div>
            `).join("")}
          </div>
          ` : ""}

          ${okList.length > 0 ? `
          <div style="background: #0d1f2d; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #00d4aa; font-size: 14px; margin-bottom: 16px;">✓ Points positifs</h2>
            ${okList.map(ok => `
              <div style="display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 0.5px solid #1a3a4a;">
                <span style="color: #00d4aa;">✓</span>
                <span style="color: #e0f0f8; font-size: 13px;">${ok}</span>
              </div>
            `).join("")}
          </div>
          ` : ""}

          <div style="text-align: center; background: #0d1f2d; border-radius: 12px; padding: 24px;">
            <p style="color: #e0f0f8; font-size: 14px; font-weight: 600; margin-bottom: 8px;">Corrigez ces problèmes en quelques minutes</p>
            <p style="color: #5a8a9f; font-size: 12px; margin-bottom: 20px;">Créez un compte gratuit pour accéder aux guides de correction adaptés à votre site</p>
            <a href="https://lokky-mu.vercel.app/register" style="display: inline-block; background: #00d4aa; color: #0a1929; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none;">
              Créer mon compte gratuit →
            </a>
          </div>

          <p style="text-align: center; color: #5a8a9f; font-size: 11px; margin-top: 24px;">
            Lokky — Sécurité simplifiée pour makers et créateurs<br/>
            <a href="https://lokky-mu.vercel.app" style="color: #5a8a9f;">lokky-mu.vercel.app</a>
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}