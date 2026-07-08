"use client";

import { useState, useEffect } from "react";

const reviews = [
  {
    quote: "J'ai scanné mon site avec Lokky et j'ai découvert des failles que j'avais complètement ignorées. Simple à utiliser et les guides de correction sont vraiment clairs.",
    name: "Fondateur",
    company: "govibecoding.ai",
  },
  {
    quote: "Lokky m'a montré en 5 secondes que mon site perdait des visiteurs à cause de problèmes de sécurité. Je l'ai corrigé en 10 minutes grâce aux guides inclus.",
    name: "Fondateur",
    company: "freshty.fr",
  },
];

export default function FloatingReview() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % reviews.length);
        setAnimate(true);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  const review = reviews[current];

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      left: "24px",
      zIndex: 50,
      maxWidth: "300px",
      background: "#fff",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
      transition: "opacity 0.3s ease",
      opacity: animate ? 1 : 0,
    }}>
      {/* Fermer */}
      <button
        onClick={() => setVisible(false)}
        style={{ position: "absolute", top: "10px", right: "12px", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "16px" }}
      >
        ×
      </button>

      {/* Étoiles */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "10px" }}>
        {[1,2,3,4,5].map((s) => (
          <span key={s} style={{ color: "#a855f7", fontSize: "14px" }}>★</span>
        ))}
      </div>

      {/* Citation */}
      <p style={{ fontSize: "12px", color: "#374151", lineHeight: "1.6", marginBottom: "12px", fontStyle: "italic" }}>
        "{review.quote}"
      </p>

      {/* Auteur */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <i className="ti ti-user" style={{ fontSize: "14px", color: "#a855f7" }}></i>
        </div>
        <div>
          <p style={{ fontSize: "12px", fontWeight: "600", color: "#111827", margin: 0 }}>{review.name}</p>
          <p style={{ fontSize: "11px", color: "#a855f7", margin: 0 }}>{review.company}</p>
        </div>
      </div>

      {/* Indicateurs */}
      <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginTop: "12px" }}>
        {reviews.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{ width: i === current ? "16px" : "6px", height: "6px", borderRadius: "3px", background: i === current ? "#a855f7" : "#e5e7eb", cursor: "pointer", transition: "all 0.3s" }}
          />
        ))}
      </div>
    </div>
  );
}