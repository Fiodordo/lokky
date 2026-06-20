"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Scan = {
  id: string;
  domain: string;
  ssl_valid: boolean;
  expires_at: string | null;
  https_redirect: boolean;
  security_headers: Record<string, boolean>;
  score: string;
  created_at: string;
};

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

export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [scans, setScans] = useState<Scan[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setEmail(data.user.email ?? "");
        setUserId(data.user.id);
        loadScans(data.user.id);
      }
    });
  }, [router]);

  async function loadScans(uid: string) {
    const { data } = await supabase
      .from("scans")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setScans(data);
  }

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
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
        loadScans(userId);
      }
    } catch {
      setError("Erreur lors du scan");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
          Déconnexion
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <p className="text-gray-800">Connecté en tant que <span className="font-medium">{email}</span></p>

        {/* Scanner */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Scanner mon projet</h2>
          <p className="text-sm text-gray-700">Vérifiez la sécurité complète de votre site ou application.</p>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="monprojet
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          />
          <button
            onClick={handleScan}
            disabled={loading || !url}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Scan en cours (10-15s)..." : "Lancer le scan"}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {result && (
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-900">{result.domain}</p>
                <span className={`px-3 py-1 rounded-full text-lg font-bold ${scoreColors[result.score]}`}>
                  {result.score}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Certificat SSL</span>
                  <span className={result.sslValid ? "text-green-700" : "text-red-700"}>
                    {result.sslValid ? "✓ Valide" : "✗ Problème"}
                  </span>
                </div>
                {result.expiresAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Expiration SSL</span>
                    <span className="text-gray-900">{new Date(result.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Redirection HTTPS</span>
                  <span className={result.httpsRedirect ? "text-green-700" : "text-red-700"}>
                    {result.httpsRedirect ? "✓ Activée" : "✗ Manquante"}
                  </span>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Headers de sécurité</p>
                {Object.entries(result.securityHeaders).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-gray-700">{headerLabels[key] ?? key}</span>
                    <span className={value ? "text-green-700" : "text-red-700"}>
                      {value ? "✓" : "✗"}
                    </span>
                  </div>
                ))}
              </div>

              {result.cookies.found && (
                <div className="border-t pt-3 space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">Cookies</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Cookie sécurisé (Secure)</span>
                    <span className={result.cookies.secure ? "text-green-700" : "text-red-700"}>
                      {result.cookies.secure ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Protégé contre le vol (HttpOnly)</span>
                    <span className={result.cookies.httpOnly ? "text-green-700" : "text-red-700"}>
                      {result.cookies.httpOnly ? "✓" : "✗"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Historique */}
        {scans.length > 0 && (
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Historique des scans</h2>
            <div className="space-y-2">
              {scans.map((scan) => (
                <div key={scan.id} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
                  <span className="font-medium text-gray-900">{scan.domain}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${scoreColors[scan.score] ?? "bg-gray-100 text-gray-700"}`}>
                    {scan.score ?? "?"}
                  </span>
                  <span className="text-gray-600">{new Date(scan.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}