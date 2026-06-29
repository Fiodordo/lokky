"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
  }, []);

  async function handleReset() {
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit faire au moins 6 caractères");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Mot de passe mis à jour ! Redirection...");
      setTimeout(() => router.push("/dashboard"), 2000);
    }
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
          <span style={{ fontSize: "11px", color: "#5a8a9f", marginLeft: "8px", fontFamily: "monospace" }}>lokky — nouveau mot de passe</span>
        </div>

        <h1 style={{ fontSize: "18px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>Nouveau mot de passe</h1>
        <p style={{ fontSize: "12px", color: "#5a8a9f", marginBottom: "24px" }}>Choisissez un nouveau mot de passe pour votre compte</p>

        {!ready ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontSize: "12px", color: "#5a8a9f", fontFamily: "monospace" }}>→ Vérification du lien en cours...</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "#5a8a9f", display: "block", marginBottom: "6px", fontFamily: "monospace" }}>→ nouveau mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 caractères"
                style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "0.5px solid #1a3a4a", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#e0f0f8", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "#5a8a9f", display: "block", marginBottom: "6px", fontFamily: "monospace" }}>→ confirmer le mot de passe</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Répétez le mot de passe"
                style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "0.5px solid #1a3a4a", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#e0f0f8", outline: "none", boxSizing: "border-box" }}
              />
            </div>

            {error && <p style={{ fontSize: "12px", color: "#ef4444", fontFamily: "monospace" }}>✗ {error}</p>}
            {message && <p style={{ fontSize: "12px", color: "#00d4aa", fontFamily: "monospace" }}>✓ {message}</p>}

            <button
              onClick={handleReset}
              disabled={loading || !password || !confirm}
              style={{ background: "#00d4aa", color: "#0a1929", border: "none", borderRadius: "6px", padding: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", opacity: loading || !password || !confirm ? 0.6 : 1, marginTop: "8px" }}
            >
              {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </button>
          </div>
        )}

        <p style={{ fontSize: "12px", color: "#5a8a9f", textAlign: "center", marginTop: "20px" }}>
          <Link href="/login" style={{ color: "#00d4aa", textDecoration: "none" }}>← Retour à la connexion</Link>
        </p>
      </div>
    </div>
  );
}