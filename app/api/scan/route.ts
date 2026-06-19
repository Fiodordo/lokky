import { NextRequest, NextResponse } from "next/server";
import * as tls from "tls";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function extractDomain(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  try {
    const withProtocol = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
    const url = new URL(withProtocol);
    return url.hostname || null;
  } catch {
    return null;
  }
}

function checkSsl(domain: string): Promise<{ valid: boolean; expiresAt: string | null; issuer: string | null }> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, domain, { servername: domain, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate();
      socket.destroy();
      if (!cert || !cert.valid_to) {
        return resolve({ valid: false, expiresAt: null, issuer: null });
      }
      const expiresAt = new Date(cert.valid_to);
      const valid = expiresAt > new Date();
      const issuer = Array.isArray(cert.issuer?.O) ? cert.issuer.O[0] : (cert.issuer?.O ?? null);
      resolve({ valid, expiresAt: expiresAt.toISOString(), issuer });
    });
    socket.setTimeout(10000, () => {
      socket.destroy();
      reject(new Error("Timeout SSL"));
    });
    socket.on("error", reject);
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const domain = extractDomain(body.url ?? "");
    const userId = body.userId ?? null;

    if (!domain) {
      return NextResponse.json({ error: "URL invalide" }, { status: 400 });
    }

    const result = await checkSsl(domain);

    if (userId) {
      await supabase.from("scans").insert({
        user_id: userId,
        domain,
        ssl_valid: result.valid,
        expires_at: result.expiresAt,
      });
    }

    return NextResponse.json({
      domain,
      sslValid: result.valid,
      expiresAt: result.expiresAt,
      issuer: result.issuer,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur scan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const maxDuration = 30;