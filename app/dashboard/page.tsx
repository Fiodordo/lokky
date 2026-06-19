"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Scan = {
  id: string;
  domain: string;
  ssl_valid: boolean;
  expires_at: string | null;
  created_at: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ domain: string; sslValid: boolean; expiresAt: string | null } | null>(null);
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
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">
          Déconnexion
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <p className="text-gray-600">Connecté en tant que <span className="font-medium">{email}</span></p>

        {/* Scanner */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold">Scanner ma boutique</h2>
          <p className="text-sm text-gray-500">Vérifiez le certificat SSL de votre boutique.</p>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="monshop.fr"
            className="w-full border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={handleScan}
            disabled={loading || !url}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Scan en cours..." : "Lancer le scan"}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {result && (
            <div className="border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">{result.domain}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Statut SSL</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${result.sslValid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {result.sslValid ? "✓ Valide" : "✗ Problème"}
                </span>
              </div>
              {result.expiresAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Expiration</span>
                  <span>{new Date(result.expiresAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Historique */}
        {scans.length > 0 && (
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="text-lg font-semibold">Historique des scans</h2>
            <div className="space-y-2">
              {scans.map((scan) => (
                <div key={scan.id} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
                  <span className="font-medium">{scan.domain}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${scan.ssl_valid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {scan.ssl_valid ? "✓ Valide" : "✗ Problème"}
                  </span>
                  <span className="text-gray-400">{new Date(scan.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}