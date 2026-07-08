"use client";

const sites = [
  "shopify.com", "wordpress.org", "webflow.io", "bubble.io", "vercel.app",
  "framer.com", "squarespace.com", "wix.com", "notion.so", "stripe.com",
  "shopify.com", "wordpress.org", "webflow.io", "bubble.io", "vercel.app",
  "framer.com", "squarespace.com", "wix.com", "notion.so", "stripe.com",
];

export default function ScrollingBanner() {
  return (
    <div style={{ overflow: "hidden", padding: "20px 0", borderTop: "0.5px solid rgba(168,85,247,0.15)", borderBottom: "0.5px solid rgba(168,85,247,0.15)" }}>
      <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.2)", marginBottom: "16px", letterSpacing: "2px" }}>SITES DÉJÀ VÉRIFIÉS PAR LOKKY</p>
      <div style={{ display: "flex", gap: "0", animation: "scroll 20s linear infinite" }}>
        {sites.map((site, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 24px", flexShrink: 0 }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a855f7", opacity: 0.5 }}></div>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", whiteSpace: "nowrap" }}>{site}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}