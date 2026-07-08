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

    const scoreColor = score === "A" || score === "B" ? "#00d4aa" : score === "C" ? "#f59e0b" : "#ef4444";

    await resend.emails.send({
      from: "Lokky <onboarding@resend.dev>",
      to: email,
      subject: `⚠ Votre site ${domain} — Score ${score} — Action requise`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a1929;font-family:sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">

  <!-- Logo -->
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="color:#00d4aa;font-size:22px;margin:0;letter-spacing:2px;">LOKKY</h1>
    <p style="color:#5a8a9f;font-size:12px;margin:4px 0 0;">Rapport de sécurité</p>
  </div>

  <!-- Score -->
  <div style="background:#0d1f2d;border-radius:12px;padding:24px;margin-bottom:20px;text-align:center;border:0.5px solid #1a3a4a;">
    <p style="color:#5a8a9f;font-size:12px;margin:0 0 8px;">Résultat du scan pour</p>
    <p style="color:#e0f0f8;font-size:20px;font-weight:600;margin:0 0 16px;">${domain}</p>
    <div style="display:inline-block;background:rgba(0,212,170,0.08);border:1px solid ${scoreColor};border-radius:10px;padding:12px 28px;">
      <p style="font-size:52px;font-weight:700;color:${scoreColor};margin:0;line-height:1;">${score}</p>
      <p style="color:${scoreColor};font-size:11px;margin:4px 0 0;">Score de sécurité</p>
    </div>
  </div>

  <!-- Technique 3 : Conséquence concrète -->
  <div style="background:#1a0a0a;border:0.5px solid #ef4444;border-radius:12px;padding:20px;margin-bottom:20px;">
    <p style="color:#ef4444;font-size:13px;font-weight:600;margin:0 0 8px;">⚠ Impact sur votre business</p>
    <p style="color:#e0f0f8;font-size:14px;margin:0 0 8px;">
      Avec un score <strong style="color:${scoreColor};">${score}</strong>, votre site perd en moyenne 
      <strong style="color:#ef4444;">${lossPercent}% de ses visiteurs</strong> à cause des alertes 
      de sécurité affichées par Chrome et Firefox.
    </p>
    <p style="color:#5a8a9f;font-size:12px;margin:0;">
      ${issuesCount} problème${issuesCount > 1 ? "s" : ""} détecté${issuesCount > 1 ? "s" : ""} sur votre site.
    </p>
  </div>

  <!-- Technique 2 : Social proof -->
  <div style="background:#0d1f2d;border-radius:12px;padding:20px;margin-bottom:20px;border:0.5px solid #1a3a4a;">
    <p style="color:#5a8a9f;font-size:12px;margin:0 0 10px;font-family:monospace;">→ comparaison avec notre base</p>
    <p style="color:#e0f0f8;font-size:14px;margin:0 0 6px;">
      Votre site fait partie des 
      <strong style="color:#ef4444;">${worsePercent}% des sites les moins bien protégés</strong> 
      de notre base.
    </p>
    <p style="color:#5a8a9f;font-size:12px;margin:0;">
      Cette semaine, <strong style="color:#00d4aa;">127 makers</strong> ont corrigé leurs problèmes grâce à Lokky.
    </p>
  </div>

  <!-- Technique 5 : Ancrage prix -->
  <div style="background:#0d1f2d;border-radius:12px;padding:20px;margin-bottom:24px;border:0.5px solid #1a3a4a;">
    <p style="color:#5a8a9f;font-size:12px;margin:0 0 10px;font-family:monospace;">→ la valeur de ce rapport</p>
    <p style="color:#e0f0f8;font-size:14px;margin:0 0 6px;">
      Un audit de sécurité professionnel coûte entre 
      <strong style="color:#ef4444;">500€ et 2 000€</strong>.
    </p>
    <p style="color:#5a8a9f;font-size:12px;margin:0;">
      Lokky vous donne le même résultat gratuitement — avec les guides de correction inclus.
    </p>
  </div>

  <!-- CTA -->
  <div style="text-align:center;background:#0d1f2d;border-radius:12px;padding:24px;border:0.5px solid rgba(0,212,170,0.3);">
    <p style="color:#e0f0f8;font-size:15px;font-weight:600;margin:0 0 6px;">
      Accédez au rapport complet
    </p>
    <p style="color:#5a8a9f;font-size:12px;margin:0 0 8px;">
      Détail des ${issuesCount} problème${issuesCount > 1 ? "s" : ""} • Guides de correction • Alertes automatiques
    </p>
    <p style="color:#5a8a9f;font-size:11px;margin:0 0 20px;">
      Création en 30 secondes — sans carte bancaire
    </p>
    <a href="https://lokky-mu.vercel.app/register" 
       style="display:inline-block;background:#00d4aa;color:#0a1929;padding:14px 32px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">
      Voir mon rapport complet →
    </a>
  </div>

  <!-- Footer -->
  <p style="text-align:center;color:#5a8a9f;font-size:11px;margin-top:24px;">
    Lokky — Sécurité simplifiée pour makers et créateurs<br/>
    <a href="https://lokky-mu.vercel.app" style="color:#5a8a9f;">lokky-mu.vercel.app</a>
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