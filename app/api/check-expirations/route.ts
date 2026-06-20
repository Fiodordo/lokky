import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Configuration manquante" }, { status: 500 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    const resend = new Resend(process.env.RESEND_API_KEY);

    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);

    const { data: scans, error } = await supabase
      .from("scans")
      .select("domain, expires_at, user_id")
      .lt("expires_at", in7Days.toISOString())
      .gt("expires_at", new Date().toISOString());

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!scans || scans.length === 0) {
      return NextResponse.json({ message: "Aucune expiration proche" });
    }

    const results = [];

    for (const scan of scans) {
      const { data: userData } = await supabase.auth.admin.getUserById(scan.user_id);
      const email = userData?.user?.email;

      if (!email) continue;

      const expiresDate = new Date(scan.expires_at).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      await resend.emails.send({
        from: "Lokky <onboarding@resend.dev>",
        to: email,
        subject: `⚠️ Le certificat SSL de ${scan.domain} expire bientôt`,
        html: `
          <h2>Alerte sécurité Lokky</h2>
          <p>Le certificat SSL de <strong>${scan.domain}</strong> expire le <strong>${expiresDate}</strong>.</p>
          <p>Pensez à le renouveler avant cette date pour éviter que vos visiteurs voient un message d'alerte de sécurité.</p>
          <p>— L'équipe Lokky</p>
        `,
      });

      results.push(scan.domain);
    }

    return NextResponse.json({ message: "Alertes envoyées", domains: results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}