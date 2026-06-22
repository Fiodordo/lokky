"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const plans = [
  {
    id: "builder",
    name: "Builder",
    price: "29€/mois",
    desc: "Pour les makers actifs",
    features: ["5 projets", "Scan hebdomadaire", "Alertes email", "Historique complet"],
  },
  {
    id: "agence",
    name: "Agence",
    price: "99€/mois",
    desc: "Pour les pros",
    features: ["Projets illimités", "Scan quotidien", "Rapports exportables", "Support prioritaire"],
    highlight: true,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? "");
        setUserId(data.user.id);
      }
    });
  }, []);

  async function handleSubscribe(planId: string) {
    if (!userId) {
      router.push("/register");
      return;
    }

    setLoading(planId);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, userId, email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur lors de la création du paiement");
      }
    } catch {
      alert("Erreur réseau");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <span className="text-xl font-bold text-gray-900">Lokky</span>
        <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
          Dashboard →
        </a>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choisissez votre plan</h1>
        <p className="text-gray-500 mb-12">Commencez gratuitement, évoluez selon vos besoins</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl p-6 border text-left ${
                plan.highlight ? "bg-black text-white border-black" : "bg-white"
              }`}
            >
              <h2 className="font-bold text-xl mb-1">{plan.name}</h2>
              <p className={`text-sm mb-4 ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}>
                {plan.desc}
              </p>
              <div className="text-3xl font-bold mb-6">{plan.price}</div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`text-sm flex gap-2 ${plan.highlight ? "text-gray-300" : "text-gray-600"}`}
                  >
                    <span>✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-2 rounded-lg text-sm font-medium disabled:opacity-50 ${
                  plan.highlight
                    ? "bg-white text-black hover:bg-gray-100"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {loading === plan.id ? "Redirection..." : "Choisir ce plan"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}