import { NextRequest, NextResponse } from "next/server";
import * as tls from "tls";

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

function checkSsl(domain: string): Promise<{ valid: boolean; expiresAt: string | null }> {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(443, domain, { servername: domain, rejectUnauthorized: false }, () => {
      const cert = socket.getPeerCertificate();
      socket.destroy();
      if (!cert || !cert.valid_to) return resolve({ valid: false, expiresAt: null });
      const expiresAt = new Date(cert.valid_to);
      resolve({ valid: expiresAt > new Date(), expiresAt: expiresAt.toISOString() });
    });
    socket.setTimeout(10000, () => { socket.destroy(); reject(new Error("Timeout")); });
    socket.on("error", reject);
  });
}

async function checkHttpsRedirect(domain: string): Promise<boolean> {
  try {
    const res = await fetch(`http://${domain}`, { redirect: "manual" });
    const location = res.headers.get("location");
    return res.status >= 300 && res.status < 400 && !!location && location.startsWith("https://");
  } catch { return false; }
}

async function checkHeaders(domain: string): Promise<Record<string, boolean>> {
  try {
    const res = await fetch(`https://${domain}`, { redirect: "follow" });
    return {
      "strict-transport-security": res.headers.has("strict-transport-security"),
      "x-content-type-options": res.headers.has("x-content-type-options"),
      "x-frame-options": res.headers.has("x-frame-options"),
      "content-security-policy": res.headers.has("content-security-policy"),
    };
  } catch {
    return {
      "strict-transport-security": false,
      "x-content-type-options": false,
      "x-frame-options": false,
      "content-security-policy": false,
    };
  }
}

function computeScore(sslValid: boolean, httpsRedirect: boolean, headers: Record<string, boolean>): string {
  let points = 0;
  if (sslValid) points += 2;
  if (httpsRedirect) points += 1;
  points += Object.values(headers).filter(Boolean).length * 0.75;
  const pct = (points / 6) * 100;
  if (pct >= 90) return "A";
  if (pct >= 75) return "B";
  if (pct >= 60) return "C";
  if (pct >= 40) return "D";
  return "F";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const domain = extractDomain(body.url ?? "");
    if (!domain) return NextResponse.json({ error: "URL invalide" }, { status: 400 });

    const [ssl, httpsRedirect, headers] = await Promise.all([
      checkSsl(domain),
      checkHttpsRedirect(domain),
      checkHeaders(domain),
    ]);

    const score = computeScore(ssl.valid, httpsRedirect, headers);

    return NextResponse.json({ domain, score, sslValid: ssl.valid, httpsRedirect, headers });
  } catch {
    return NextResponse.json({ error: "Erreur lors du scan" }, { status: 500 });
  }
}

export const maxDuration = 30;