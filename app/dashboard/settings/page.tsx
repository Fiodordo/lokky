"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email ?? "");
    });
  }, []);

  async function handlePasswordReset() {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://lokky-mu.vercel.app/reset-password",
    });
    if (error) setMessage("Erreur : " + error.message);
    else setMessage("Email de réinitialisation envoyé !");
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 mt-1">Gérez votre compte Lokky</p>
      </div>

      {/* Compte */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Mon compte</h2>
        <div>
          <p className="text-xs text-gray-500 mb-1">Adresse email</p>
          <p className="text-sm font-medium text-gray-900">{email}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2">Mot de passe</p>
          <button
            onClick={handlePasswordReset}
            disabled={loading}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Envoi..." : "Réinitialiser mon mot de passe"}
          </button>
          {message && <p className="text-sm text-green-700 mt-2">{message}</p>}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Notifications</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-900">Alertes SSL par email</p>
            <p className="text-xs text-gray-500">Reçois un email 7 jours avant l'expiration</p>
          </div>
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">Actif</span>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6 space-y-4">
        <h2 className="font-semibold text-red-700">Zone de danger</h2>
        <div>
          <p className="text-sm text-gray-600 mb-3">Se déconnecter de tous les appareils</p>
          <button
            onClick={handleLogout}
            className="border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}