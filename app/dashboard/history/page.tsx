"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Scan = {
  id: string;
  domain: string;
  ssl_valid: boolean;
  score: string;
  created_at: string;
  https_redirect: boolean;
};

const scoreColors: Record<string, string> = {
  A: "bg-green-100 text-green-700",
  B: "bg-green-100 text-green-700",
  C: "bg-yellow-100 text-yellow-700",
  D: "bg-orange-100 text-orange-700",
  F: "bg-red-100 text-red-700",
};

export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) loadScans(data.user.id);
    });
  }, []);

  async function loadScans(uid: string) {
    const { data } = await supabase
      .from("scans")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    if (data) setScans(data);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historique des scans</h1>
        <p className="text-gray-500 mt-1">Tous vos scans passés</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <p className="text-center text-gray-500 py-12 text-sm">Chargement...</p>
        ) : scans.length === 0 ? (
          <p className="text-center text-gray-500 py-12 text-sm">Aucun scan effectué pour l'instant</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Domaine</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Score</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">SSL</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">HTTPS</th>
                <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr key={scan.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{scan.domain}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${scoreColors[scan.score] ?? "bg-gray-100 text-gray-700"}`}>
                      {scan.score ?? "?"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={scan.ssl_valid ? "text-green-700" : "text-red-700"}>
                      {scan.ssl_valid ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={scan.https_redirect ? "text-green-700" : "text-red-700"}>
                      {scan.https_redirect ? "✓" : "✗"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(scan.created_at).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}