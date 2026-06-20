import { NextRequest, NextResponse } from "next/server";
import * as tls from "tls";
import { createClient } from "@supabase/supabase-js";

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

async function checkHttpsRedirect(domain: string): Promise<boolean> {
  try {
    const res = await fetch(`http://${domain}`, { redirect: "manual" });
    const location = res.headers.get("location");
    return res.status >= 300 && res.status < 400 && !!location && location.startsWith("https://");
  } catch {
    return false;
  }
}

async function checkSecurityHeaders(domain: string): Promise<{ headers: Record<string, boolean>; cookies: { secure: boolean; httpOnly: boolean; found: boolean } }> {
  try {
    const res = await fetch(`https://${domain}`, { redirect: "follow" });
    const headers = res.headers;

    const setCookieHeader = headers.get("set-cookie");
    const found = !!setCookieHeader;
    const secure = found ? setCookieHeader!.toLowerCase().includes("secure") : false;
    const httpOnly = found ? setCookieHeader!.toLowerCase().includes("httponly") : false;

    return {
      headers: {
        "strict-transport-security": headers.has("strict-transport-security"),
        "x-content-type-options": headers.has("x-content-type-options"),
        "x-frame-options": headers.has("x-frame-options"),
        "content-security-policy": headers.has("content-security-policy"),
      },
      cookies: { secure, httpOnly, found },
    };
  } catch {
    return {
      headers: {
        "strict-transport-security": false,
        "x-content-type-options": false,
        "x-frame-options": false,
        "content-security-policy": false,
      },
      cookies: { secure: false, httpOnly: false, found: false },
    };
  }
}

function computeScore(sslValid: boolean, httpsRedirect: boolean, headers: Record<string, boolean>, cookies: { secure: boolean; httpOnly: boolean; found: boolean }): string {
  let points = 0;
  const total = 7;

  if (sslValid) points += 2;
  if (httpsRedirect) points += 1;
  points += Object.values(headers).filter(Boolean).length * 0.75;
  if (cookies.found) {
    if (cookies.secure) points += 0.5;
    if (cookies.httpOnly) points += 0.5;
  } else {
    points += 1;
  }

  const percentage = (points / total) * 100;

  if (percentage >= 90) return "A";
  if (percentage >= 75) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 40) return "D";
  return "F";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const domain = extractDomain(body.url ?? "");
    const userId = body.userId ?? null;

    if (!domain) {
      return NextResponse.json({ error: "URL invalide" }, { status: 400 });
    }

    const [sslResult, httpsRedirect, headersResult] = await Promise.all([
      checkSsl(domain),
      checkHttpsRedirect(domain),
      checkSecurityHeaders(domain),
    ]);

    const score = computeScore(sslResult.valid, httpsRedirect, headersResult.headers, headersResult.cookies);

    let insertError = null;
    if (userId && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      const { error } = await supabase.from("scans").insert({
        user_id: userId,
        domain,
        ssl_valid: sslResult.valid,
        expires_at: sslResult.expiresAt,
        https_redirect: httpsRedirect,
        security_headers: headersResult.headers,
        score,
      });
      if (error) insertError = error.message;
    }

    return NextResponse.json({
      domain,
      sslValid: sslResult.valid,
      expiresAt: sslResult.expiresAt,
      issuer: sslResult.issuer,
      httpsRedirect,
      securityHeaders: headersResult.headers,
      cookies: headersResult.cookies,
      score,
      insertError,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur scan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export const maxDuration = 30;