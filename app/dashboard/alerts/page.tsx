"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Scan = {
  id: string;
  domain: string;
  expires_at: string | null;
  ssl_valid: boolean;
};

export default function AlertsPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) loadAlerts(data.user.id);
    });
  }, []);

  async function loadAlerts(uid: string) {
    const { data } = await supabase
      .from("scans")
      .select("id, domain, expires_at, ssl_valid")
      .eq("user_id", uid)
      .order("expires_at", { ascending: true });
    if (data) setScans(data);
    setLoading(false);
  }

  function getDaysLeft(expiresAt: string | null): number | null {
    if (!expiresAt) return null;
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function getAlertLevel(days: number | null) {
    if (days === null) return null;
    if (days <= 7) return { color: "bg-red-100 text-red-700 border-red-200", label: "🔴 Critique" };
    if (days <= 30) return { color: "bg-orange-100 text-orange-700 border-orange-200", label: "🟠 Attention" };
    return { color: "bg-green-100 text-green-700 border-green-200", label: "🟢 OK" };
  }

  const alerts = scans.filter(s => {
    const days = getDaysLeft(s.expires_at);
    return days !== null && days <= 30;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alertes & Notifications</h1>
        <p className="text-gray-500 mt-1">Surveillez les expirations SSL de vos projets</p>
      </div>

      {/* Info card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        🔔 Vous recevez automatiquement un email 7 jours avant l'expiration de votre certificat SSL.
      </div>

      {/* Alerts */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Expirations dans les 30 prochains jours</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Chargement...</p>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-gray-700 font-medium">Aucune alerte pour le moment</p>
            <p className="text-gray-500 text-sm mt-1">Tous vos certificats SSL sont valides</p>
          </div>
        ) : (
          alerts.map((scan) => {
            const days = getDaysLeft(scan.expires_at);
            const level = getAlertLevel(days);
            return (
              <div key={scan.id} className={`rounded-xl border p-4 flex justify-between items-center ${level?.color}`}>
                <div>
                  <p className="font-medium">{scan.domain}</p>
                  <p className="text-sm mt-0.5">
                    Expire le {new Date(scan.expires_at!).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{days}j</p>
                  <p className="text-xs">{level?.label}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* All domains */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Tous vos projets surveillés</h2>
        {scans.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucun projet scanné pour l'instant</p>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            {scans.map((scan) => {
              const days = getDaysLeft(scan.expires_at);
              const level = getAlertLevel(days);
              return (
                <div key={scan.id} className="flex justify-between items-center px-5 py-3 border-b last:border-0">
                  <p className="text-sm font-medium text-gray-900">{scan.domain}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${level?.color ?? "bg-gray-100 text-gray-500"}`}>
                    {days !== null ? `${days}j` : "N/A"}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}