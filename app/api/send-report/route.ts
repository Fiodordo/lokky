import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, domain, score, sslValid, httpsRedirect, headers } = await request.json();

    if (!email || !domain) {
      return NextResponse.json({ error: "Email et domaine requis" }, { status: 400 });
    }

    const issuesCount = [
      !sslValid,
      !httpsRedirect,
      ...Object.values(headers as Record<string, boolean>).map(v => !v),
    ].filter(Boolean).length;

    const scorePercent = score === "A" ? 95 : score === "B" ? 80 : score === "C" ? 62 : score === "D" ? 42 : 20;
    const worsePercent = 100 - scorePercent;
    const lossPercent = score === "A" ? 5 : score === "B" ? 15 : score === "C" ? 34 : score === "D" ? 58 : 85;
    const scoreColor = score === "A" || score === "B" ? "#7c3aed" : score === "C" ? "#d97706" : "#dc2626";

    await resend.emails.send({
      from: "Lokky <onboarding@resend.dev>",
      to: email,
      subject: `⚠ Votre site ${domain} — Score ${score} — Action requise`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">

  <!-- Logo -->
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="color:#a855f7;font-size:22px;margin:0;letter-spacing:2px;">LOKKY</h1>
    <p style="color:#6b7280;font-size:12px;margin:4px 0 0;">Rapport de sécurité</p>
  </div>

  <!-- Score -->
  <div style="background:#ffffff;border-radius:12px;padding:24px;margin-bottom:20px;text-align:center;border:0.5px solid #e5e7eb;">
    <p style="color:#6b7280;font-size:12px;margin:0 0 8px;">Résultat du scan pour</p>
    <p style="color:#111827;font-size:20px;font-weight:600;margin:0 0 16px;">${domain}</p>
    <div style="display:inline-block;background:#faf5ff;border:2px solid ${scoreColor};border-radius:10px;padding:12px 28px;">
      <p style="font-size:52px;font-weight:700;color:${scoreColor};margin:0;line-height:1;">${score}</p>
      <p style="color:${scoreColor};font-size:11px;margin:4px 0 0;">Score de sécurité</p>
    </div>
  </div>

  <!-- Conséquence concrète -->
  <div style="background:#fff5f5;border:0.5px solid #fca5a5;border-radius:12px;padding:20px;margin-bottom:20px;">
    <p style="color:#dc2626;font-size:13px;font-weight:600;margin:0 0 8px;">⚠ Impact sur votre business</p>
    <p style="color:#111827;font-size:14px;margin:0 0 8px;">
      Avec un score <strong style="color:${scoreColor};">${score}</strong>, votre site perd en moyenne 
      <strong style="color:#dc2626;">${lossPercent}% de ses visiteurs</strong> à cause des alertes 
      de sécurité affichées par Chrome et Firefox.
    </p>
    <p style="color:#6b7280;font-size:12px;margin:0;">
      ${issuesCount} problème${issuesCount > 1 ? "s" : ""} détecté${issuesCount > 1 ? "s" : ""} sur votre site.
    </p>
  </div>

  <!-- Social proof -->
  <div style="background:#ffffff;border-radius:12px;padding:20px;margin-bottom:20px;border:0.5px solid #e5e7eb;">
    <p style="color:#6b7280;font-size:12px;margin:0 0 10px;">Comparaison avec notre base</p>
    <p style="color:#111827;font-size:14px;margin:0 0 6px;">
      Votre site fait partie des 
      <strong style="color:#dc2626;">${worsePercent}% des sites les moins bien protégés</strong> 
      de notre base.
    </p>
    <p style="color:#6b7280;font-size:12px;margin:0;">
      Cette semaine, <strong style="color:#a855f7;">127 makers</strong> ont corrigé leurs problèmes grâce à Lokky.
    </p>
  </div>

  <!-- Ancrage prix -->
  <div style="background:#ffffff;border-radius:12px;padding:20px;margin-bottom:24px;border:0.5px solid #e5e7eb;">
    <p style="color:#6b7280;font-size:12px;margin:0 0 10px;">La valeur de ce rapport</p>
    <p style="color:#111827;font-size:14px;margin:0 0 6px;">
      Un audit de sécurité professionnel coûte entre 
      <strong style="color:#dc2626;">500€ et 2 000€</strong>.
    </p>
    <p style="color:#6b7280;font-size:12px;margin:0;">
      Lokky vous donne le même résultat gratuitement — avec les guides de correction inclus.
    </p>
  </div>

  <!-- CTA -->
  <div style="text-align:center;background:#faf5ff;border-radius:12px;padding:24px;border:0.5px solid #d8b4fe;">
    <p style="color:#111827;font-size:15px;font-weight:600;margin:0 0 6px;">
      Accédez au rapport complet
    </p>
    <p style="color:#6b7280;font-size:12px;margin:0 0 6px;">
      Détail des ${issuesCount} problème${issuesCount > 1 ? "s" : ""} • Guides de correction • Alertes automatiques
    </p>
    <p style="color:#6b7280;font-size:11px;margin:0 0 20px;">
      Création en 30 secondes — sans carte bancaire
    </p>
    <a href="https://lokky-mu.vercel.app/register" 
       style="display:inline-block;background:#a855f7;color:#ffffff;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">
      Voir mon rapport complet →
    </a>
  </div>

  <!-- Footer -->
  <p style="text-align:center;color:#9ca3af;font-size:11px;margin-top:24px;">
    Lokky — Sécurité simplifiée pour makers et créateurs<br/>
    <a href="https://lokky-mu.vercel.app" style="color:#9ca3af;">lokky-mu.vercel.app</a>
  </p>

</div>
</body>
</html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}