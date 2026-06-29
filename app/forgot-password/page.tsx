"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!email) return;
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) setError(error.message);
    else setMessage("Email envoyé ! Vérifiez votre boîte mail.");
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a1929", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "40px" }}>
        <i className="ti ti-shield-check" style={{ fontSize: "20px", color: "#00d4aa" }}></i>
        <span style={{ fontSize: "18px", fontWeight: "500", color: "#00d4aa", letterSpacing: "1px" }}>LOKKY</span>
      </Link>

      <div style={{ background: "#0d1f2d", border: "0.5px solid #1a3a4a", borderRadius: "12px", padding: "32px", width: "100%", maxWidth: "400px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00d4aa" }}></div>
          <span style={{ fontSize: "11px", color: "#5a8a9f", marginLeft: "8px", fontFamily: "monospace" }}>lokky — mot de passe oublié</span>
        </div>

        <h1 style={{ fontSize: "18px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>Mot de passe oublié</h1>
        <p style={{ fontSize: "12px", color: "#5a8a9f", marginBottom: "24px" }}>Entrez votre email pour recevoir un lien de réinitialisation</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "11px", color: "#5a8a9f", display: "block", marginBottom: "6px", fontFamily: "monospace" }}>→ email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "0.5px solid #1a3a4a", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#e0f0f8", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {error && <p style={{ fontSize: "12px", color: "#ef4444", fontFamily: "monospace" }}>✗ {error}</p>}
          {message && <p style={{ fontSize: "12px", color: "#00d4aa", fontFamily: "monospace" }}>✓ {message}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || !email}
            style={{ background: "#00d4aa", color: "#0a1929", border: "none", borderRadius: "6px", padding: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", opacity: loading || !email ? 0.6 : 1 }}
          >
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </div>

        <p style={{ fontSize: "12px", color: "#5a8a9f", textAlign: "center", marginTop: "20px" }}>
          <Link href="/login" style={{ color: "#00d4aa", textDecoration: "none" }}>← Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}