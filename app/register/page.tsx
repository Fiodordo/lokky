"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setSuccess("Compte créé ! Vérifiez votre email pour confirmer votre inscription.");
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a1929", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)" }}>

      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", marginBottom: "40px" }}>
        <i className="ti ti-shield-check" style={{ fontSize: "20px", color: "#00d4aa" }}></i>
        <span style={{ fontSize: "18px", fontWeight: "500", color: "#00d4aa", letterSpacing: "1px" }}>LOKKY</span>
      </Link>

      {/* Card */}
      <div style={{ background: "#0d1f2d", border: "0.5px solid #1a3a4a", borderRadius: "12px", padding: "32px", width: "100%", maxWidth: "400px" }}>

        {/* Terminal header */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "24px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00d4aa" }}></div>
          <span style={{ fontSize: "11px", color: "#5a8a9f", marginLeft: "8px", fontFamily: "monospace" }}>lokky — inscription</span>
        </div>

        <h1 style={{ fontSize: "18px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>Créer un compte</h1>
        <p style={{ fontSize: "12px", color: "#5a8a9f", marginBottom: "24px" }}>Commencez à sécuriser vos projets gratuitement</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "11px", color: "#5a8a9f", display: "block", marginBottom: "6px", fontFamily: "monospace" }}>→ email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "0.5px solid #1a3a4a", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#e0f0f8", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "11px", color: "#5a8a9f", display: "block", marginBottom: "6px", fontFamily: "monospace" }}>→ mot de passe</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractères"
              style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "0.5px solid #1a3a4a", borderRadius: "6px", padding: "10px 14px", fontSize: "13px", color: "#e0f0f8", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {error && (
            <p style={{ fontSize: "12px", color: "#ef4444", fontFamily: "monospace" }}>✗ {error}</p>
          )}

          {success && (
            <p style={{ fontSize: "12px", color: "#00d4aa", fontFamily: "monospace" }}>✓ {success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: "#00d4aa", color: "#0a1929", border: "none", borderRadius: "6px", padding: "12px", fontSize: "13px", fontWeight: "600", cursor: "pointer", opacity: loading ? 0.6 : 1, marginTop: "8px" }}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p style={{ fontSize: "12px", color: "#5a8a9f", textAlign: "center", marginTop: "20px" }}>
          Déjà un compte ?{" "}
          <Link href="/login" style={{ color: "#00d4aa", textDecoration: "none" }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}