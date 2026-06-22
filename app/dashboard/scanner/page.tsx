"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ScanResult = {
  domain: string;
  sslValid: boolean;
  expiresAt: string | null;
  httpsRedirect: boolean;
  securityHeaders: Record<string, boolean>;
  cookies: { secure: boolean; httpOnly: boolean; found: boolean };
  score: string;
};

const headerLabels: Record<string, string> = {
  "strict-transport-security": "Force HTTPS (HSTS)",
  "x-content-type-options": "Protection contre le sniffing",
  "x-frame-options": "Protection contre le clickjacking",
  "content-security-policy": "Protection contre les scripts malveillants",
};

const scoreColors: Record<string, string> = {
  A: "bg-green-100 text-green-700",
  B: "bg-green-100 text-green-700",
  C: "bg-yellow-100 text-yellow-700",
  D: "bg-orange-100 text-orange-700",
  F: "bg-red-100 text-red-700",
};

export default function ScannerPage() {
  const [userId, setUserId] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  async function handleScan() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, userId }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch {
      setError("Erreur lors du scan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scanner mon projet</h1>
        <p className="text-gray-500 mt-1">Analysez la sécurité complète de votre site ou application</p>
      </div>

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="monprojet.com"
          className="w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
        />
        <button
          onClick={handleScan}
          disabled={loading || !url}
          className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium disabled:opacity-50 w-full"
        >
          {loading ? "Scan en cours..." : "🔍 Lancer le scan"}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {result && (
          <div className="border rounded-xl p-5 space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-900">{result.domain}</p>
              <span className={`px-3 py-1 rounded-full text-xl font-bold ${scoreColors[result.score]}`}>
                {result.score}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Certificat SSL</span>
                <span className={result.sslValid ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                  {result.sslValid ? "✓ Valide" : "✗ Problème"}
                </span>
              </div>
              {result.expiresAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expiration SSL</span>
                  <span className="text-gray-900">{new Date(result.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Redirection HTTPS</span>
                <span className={result.httpsRedirect ? "text-green-700 font-medium" : "text-red-700 font-medium"}>
                  {result.httpsRedirect ? "✓ Activée" : "✗ Manquante"}
                </span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Headers de sécurité</p>
              {Object.entries(result.securityHeaders).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{headerLabels[key] ?? key}</span>
                  <span className={value ? "text-green-700" : "text-red-700"}>{value ? "✓" : "✗"}</span>
                </div>
              ))}
            </div>

            {result.cookies.found && (
              <div className="border-t pt-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Cookies</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cookie sécurisé (Secure)</span>
                  <span className={result.cookies.secure ? "text-green-700" : "text-red-700"}>{result.cookies.secure ? "✓" : "✗"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Protégé contre le vol (HttpOnly)</span>
                  <span className={result.cookies.httpOnly ? "text-green-700" : "text-red-700"}>{result.cookies.httpOnly ? "✓" : "✗"}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}