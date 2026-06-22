"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "Gratuit",
    desc: "Pour découvrir",
    features: ["1 projet", "Scan manuel", "Score de sécurité"],
    current: true,
  },
  {
    id: "builder",
    name: "Builder",
    price: "29€/mois",
    desc: "Pour les makers actifs",
    features: ["5 projets", "Scan hebdomadaire", "Alertes email", "Historique complet"],
    highlight: true,
  },
  {
    id: "agence",
    name: "Agence",
    price: "99€/mois",
    desc: "Pour les pros",
    features: ["Projets illimités", "Scan quotidien", "Rapports exportables", "Support prioritaire"],
  },
];

export default function UpgradePage() {
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
    if (planId === "starter") return;
    setLoading(planId);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, userId, email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Erreur lors de la création du paiement");
    } catch {
      alert("Erreur réseau");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon abonnement</h1>
        <p className="text-gray-500 mt-1">Choisissez le plan qui correspond à vos besoins</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl p-6 border text-left ${
              plan.highlight ? "bg-black text-white border-black" : "bg-white"
            }`}
          >
            {plan.current && (
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full mb-3">
                Plan actuel
              </span>
            )}
            <h2 className="font-bold text-xl mb-1">{plan.name}</h2>
            <p className={`text-sm mb-4 ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}>
              {plan.desc}
            </p>
            <div className="text-3xl font-bold mb-6">{plan.price}</div>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className={`text-sm flex gap-2 ${plan.highlight ? "text-gray-300" : "text-gray-600"}`}>
                  <span>✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={plan.current || loading === plan.id}
              className={`w-full py-2 rounded-lg text-sm font-medium disabled:opacity-50 ${
                plan.highlight
                  ? "bg-white text-black hover:bg-gray-100"
                  : plan.current
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {plan.current ? "Plan actuel" : loading === plan.id ? "Redirection..." : "Choisir ce plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}