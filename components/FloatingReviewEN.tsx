"use client";

import { useState, useEffect } from "react";

const reviews = [
  {
    quote: "I scanned my site with Lokky and discovered vulnerabilities I had completely missed. Easy to use and the fix guides are really clear.",
    name: "Founder",
    company: "govibecoding.ai",
  },
  {
    quote: "Lokky showed me in 5 seconds that my site was losing visitors due to security issues. Fixed it in 10 minutes thanks to the included guides.",
    name: "Founder",
    company: "freshty.fr",
  },
];

export default function FloatingReviewEN() {
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
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 50, maxWidth: "400px", background: "#fff", borderRadius: "12px", padding: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.15)", transition: "opacity 0.3s ease", opacity: animate ? 1 : 0 }}>
      <button onClick={() => setVisible(false)} style={{ position: "absolute", top: "10px", right: "12px", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: "16px" }}>×</button>
      <div style={{ display: "flex", gap: "2px", marginBottom: "10px" }}>
        {[1,2,3,4,5].map((s) => <span key={s} style={{ color: "#a855f7", fontSize: "14px" }}>★</span>)}
      </div>
      <p style={{ fontSize: "12px", color: "#374151", lineHeight: "1.6", marginBottom: "12px", fontStyle: "italic" }}>"{review.quote}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#faf5ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <i className="ti ti-user" style={{ fontSize: "14px", color: "#a855f7" }}></i>
        </div>
        <div>
          <p style={{ fontSize: "12px", fontWeight: "600", color: "#111827", margin: 0 }}>{review.name}</p>
          <p style={{ fontSize: "11px", color: "#a855f7", margin: 0 }}>{review.company}</p>
        </div>
      </div>
      <div style={{ display: "flex", gap: "4px", justifyContent: "center", marginTop: "12px" }}>
        {reviews.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? "16px" : "6px", height: "6px", borderRadius: "3px", background: i === current ? "#a855f7" : "#e5e7eb", cursor: "pointer", transition: "all 0.3s" }} />
        ))}
      </div>
    </div>
  );
}