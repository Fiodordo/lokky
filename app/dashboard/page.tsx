"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardHome() {
  const [scansCount, setScansCount] = useState(0);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        loadStats(data.user.id);
      }
    });
  }, []);

  async function loadStats(uid: string) {
    const { data } = await supabase
      .from("scans")
      .select("domain, created_at, score")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (data) {
      setScansCount(data.length);
      setLastScan(data[0]?.domain ?? null);
    }
  }

  const cards = [
    { label: "Scans effectués", value: scansCount, icon: "🔍", href: "/dashboard/history" },
    { label: "Dernier scan", value: lastScan ?? "Aucun", icon: "📊", href: "/dashboard/scanner" },
    { label: "Alertes actives", value: "SSL < 7j", icon: "🔔", href: "/dashboard/alerts" },
    { label: "Mon plan", value: "Starter", icon: "⚡", href: "/dashboard/upgrade" },
  ];

  const quickActions = [
    { label: "Scanner un projet", desc: "Analysez la sécurité de votre site", href: "/dashboard/scanner", icon: "🔍" },
    { label: "Voir l'historique", desc: "Consultez vos anciens scans", href: "/dashboard/history", icon: "📊" },
    { label: "Guides de correction", desc: "Apprenez à corriger les failles", href: "/dashboard/guides", icon: "📖" },
    { label: "Upgrader mon plan", desc: "Débloquez plus de fonctionnalités", href: "/dashboard/upgrade", icon: "⚡" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
        <p className="text-gray-500 mt-1">Bienvenue sur votre tableau de bord Lokky</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow">
            <div className="text-2xl mb-2">{card.icon}</div>
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className="text-lg font-bold text-gray-900 truncate">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href} className="bg-white rounded-xl border p-5 flex gap-4 items-start hover:shadow-sm transition-shadow">
              <span className="text-2xl">{action.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{action.label}</p>
                <p className="text-sm text-gray-500">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}