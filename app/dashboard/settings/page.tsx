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
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password`});
    if (error) setMessage("Erreur : " + error.message);
    else setMessage("Email de réinitialisation envoyé !");
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div style={{ maxWidth: "560px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>Paramètres</h1>
        <p style={{ fontSize: "13px", color: "#5a8a9f" }}>Gérez votre compte Lokky</p>
      </div>
      {[
        { title: "→ compte", content: (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "10px", color: "#5a8a9f", marginBottom: "4px" }}>Adresse email</p>
              <p style={{ fontSize: "13px", color: "#e0f0f8", fontFamily: "monospace" }}>{email}</p>
            </div>
            <div>
              <p style={{ fontSize: "10px", color: "#5a8a9f", marginBottom: "8px" }}>Mot de passe</p>
              <button onClick={handlePasswordReset} disabled={loading} style={{ background: "transparent", border: "0.5px solid #1a3a4a", color: "#e0f0f8", borderRadius: "6px", padding: "8px 16px", fontSize: "12px", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Envoi..." : "Réinitialiser mon mot de passe"}
              </button>
              {message && <p style={{ fontSize: "12px", color: "#00d4aa", marginTop: "8px", fontFamily: "monospace" }}>✓ {message}</p>}
            </div>
          </div>
        )},
        { title: "→ notifications", content: (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "13px", color: "#e0f0f8", marginBottom: "4px" }}>Alertes SSL par email</p>
              <p style={{ fontSize: "11px", color: "#5a8a9f" }}>Email 7 jours avant l'expiration du certificat</p>
            </div>
            <span style={{ background: "rgba(0,212,170,0.1)", color: "#00d4aa", border: "0.5px solid rgba(0,212,170,0.3)", fontSize: "10px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px" }}>Actif</span>
          </div>
        )},
        { title: "→ danger zone", content: (
          <div>
            <p style={{ fontSize: "13px", color: "#e0f0f8", marginBottom: "4px" }}>Déconnexion</p>
            <p style={{ fontSize: "11px", color: "#5a8a9f", marginBottom: "12px" }}>Se déconnecter de tous les appareils</p>
            <button onClick={handleLogout} style={{ background: "rgba(239,68,68,0.08)", border: "0.5px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: "6px", padding: "8px 16px", fontSize: "12px", cursor: "pointer" }}>
              Se déconnecter
            </button>
          </div>
        )},
      ].map((section) => (
        <div key={section.title} style={{ background: "#0a1929", border: "0.5px solid #1a3a4a", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
          <div style={{ padding: "12px 18px", borderBottom: "0.5px solid #1a3a4a" }}>
            <p style={{ fontSize: "11px", color: "#5a8a9f", fontFamily: "monospace" }}>{section.title}</p>
          </div>
          <div style={{ padding: "18px" }}>{section.content}</div>
        </div>
      ))}
    </div>
  );
}