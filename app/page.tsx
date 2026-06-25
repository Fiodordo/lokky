import Link from "next/link";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#0a1929", fontFamily: "var(--font-sans)" }}>

      {/* Header */}
      <header style={{ borderBottom: "0.5px solid #1a3a4a", padding: "0 40px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0a1929", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="ti ti-shield-check" style={{ fontSize: "18px", color: "#00d4aa" }}></i>
          <span style={{ fontSize: "16px", fontWeight: "500", color: "#00d4aa", letterSpacing: "1px" }}>LOKKY</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/login" style={{ fontSize: "13px", color: "#5a8a9f", textDecoration: "none" }}>Connexion</Link>
          <Link href="/register" style={{ background: "#00d4aa", color: "#0a1929", fontSize: "13px", fontWeight: "600", padding: "8px 18px", borderRadius: "6px", textDecoration: "none" }}>Essai gratuit</Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "100px 40px 80px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(0,212,170,0.08)", border: "0.5px solid rgba(0,212,170,0.2)", borderRadius: "20px", padding: "5px 14px", marginBottom: "24px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#00d4aa" }}></div>
          <span style={{ fontSize: "11px", color: "#00d4aa" }}>Sécurité simplifiée pour makers & créateurs de SaaS</span>
        </div>
        <h1 style={{ fontSize: "52px", fontWeight: "500", color: "#e0f0f8", lineHeight: "1.15", marginBottom: "20px" }}>
          Votre projet est-il<br /><span style={{ color: "#00d4aa" }}>vraiment sécurisé ?</span>
        </h1>
        <p style={{ fontSize: "16px", color: "#5a8a9f", lineHeight: "1.7", marginBottom: "40px", maxWidth: "540px", margin: "0 auto 40px" }}>
          Lokky scanne votre site ou application en quelques secondes — SSL, headers, cookies — et détecte les failles avant que vos clients ne les trouvent.
        </p>
        <div style={{ background: "#0d1f2d", border: "0.5px solid #1a3a4a", borderRadius: "10px", padding: "16px 20px", maxWidth: "480px", margin: "0 auto 24px", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></div>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00d4aa" }}></div>
          </div>
          <p style={{ fontSize: "12px", color: "#5a8a9f", fontFamily: "monospace", marginBottom: "6px" }}>$ lokky scan --target monprojet.com</p>
          <p style={{ fontSize: "12px", color: "#00d4aa", fontFamily: "monospace", marginBottom: "2px" }}>✓ SSL valide — expire dans 120 jours</p>
          <p style={{ fontSize: "12px", color: "#ef4444", fontFamily: "monospace", marginBottom: "2px" }}>✗ Headers de sécurité manquants</p>
          <p style={{ fontSize: "12px", color: "#f59e0b", fontFamily: "monospace" }}>⚠ Cookie non sécurisé détecté</p>
        </div>
        <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#00d4aa", color: "#0a1929", fontSize: "14px", fontWeight: "600", padding: "14px 28px", borderRadius: "8px", textDecoration: "none" }}>
          Scanner mon projet gratuitement
        </Link>
        <p style={{ fontSize: "11px", color: "#5a8a9f", marginTop: "10px" }}>Sans carte bancaire • Résultat en 5 secondes</p>
      </section>

      {/* Stats */}
      <section style={{ borderTop: "0.5px solid #1a3a4a", borderBottom: "0.5px solid #1a3a4a", padding: "24px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "60px" }}>
          {[
            { value: "500+", label: "Projets scannés" },
            { value: "3s", label: "Temps de scan moyen" },
            { value: "100%", label: "Gratuit pour commencer" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "22px", fontWeight: "700", color: "#00d4aa" }}>{stat.value}</p>
              <p style={{ fontSize: "11px", color: "#5a8a9f", marginTop: "2px" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problèmes */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "500", color: "#e0f0f8", marginBottom: "10px" }}>Construire vite, c'est bien.<br />Sécuriser aussi.</h2>
          <p style={{ fontSize: "13px", color: "#5a8a9f" }}>Avec le vibe coding et le no-code, on lance vite — souvent trop vite pour penser à la sécurité</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { icon: "ti-robot", title: "Code généré par IA", desc: "L'IA va vite, mais ne pense pas toujours à la sécurité par défaut", color: "#ef4444" },
            { icon: "ti-lock-open", title: "Données exposées", desc: "Une mauvaise config peut exposer les données de vos utilisateurs sans que vous le sachiez", color: "#f59e0b" },
            { icon: "ti-trending-down", title: "Confiance perdue", desc: "Une faille découverte par un utilisateur peut couler la réputation de votre projet", color: "#ef4444" },
          ].map((item) => (
            <div key={item.title} style={{ background: "#0d1f2d", border: "0.5px solid #1a3a4a", borderRadius: "10px", padding: "20px" }}>
              <i className={`ti ${item.icon}`} style={{ fontSize: "20px", color: item.color, display: "block", marginBottom: "12px" }}></i>
              <p style={{ fontSize: "13px", fontWeight: "500", color: "#e0f0f8", marginBottom: "8px" }}>{item.title}</p>
              <p style={{ fontSize: "12px", color: "#5a8a9f", lineHeight: "1.6" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ borderTop: "0.5px solid #1a3a4a", padding: "80px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "500", color: "#e0f0f8", marginBottom: "10px" }}>Tout ce dont vous avez besoin</h2>
            <p style={{ fontSize: "13px", color: "#5a8a9f" }}>Simple, rapide, pensé pour les non-experts en sécurité</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {[
              { icon: "ti-search", title: "Scan complet instantané", desc: "SSL, headers de sécurité, cookies, redirection HTTPS — tout vérifié en quelques secondes" },
              { icon: "ti-shield-check", title: "Score clair A à F", desc: "Comprenez immédiatement votre niveau de sécurité, sans jargon technique" },
              { icon: "ti-bell", title: "Alertes email automatiques", desc: "Recevez un email 7 jours avant que votre certificat SSL expire" },
              { icon: "ti-book", title: "Guides de correction", desc: "Des instructions claires par plateforme pour corriger chaque faille détectée" },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", gap: "16px", background: "#0d1f2d", border: "0.5px solid #1a3a4a", borderRadius: "10px", padding: "20px" }}>
                <i className={`ti ${item.icon}`} style={{ fontSize: "20px", color: "#00d4aa", flexShrink: 0, marginTop: "2px" }}></i>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: "500", color: "#e0f0f8", marginBottom: "6px" }}>{item.title}</p>
                  <p style={{ fontSize: "12px", color: "#5a8a9f", lineHeight: "1.6" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ borderTop: "0.5px solid #1a3a4a", padding: "80px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <h2 style={{ fontSize: "28px", fontWeight: "500", color: "#e0f0f8", marginBottom: "10px" }}>Tarifs simples et transparents</h2>
            <p style={{ fontSize: "13px", color: "#5a8a9f" }}>Commencez gratuitement, évoluez selon vos besoins</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { name: "Starter", price: "Gratuit", desc: "Pour découvrir", features: ["1 projet", "Scan manuel", "Score de sécurité"] },
              { name: "Builder", price: "29€/mois", desc: "Pour les makers actifs", features: ["5 projets", "Scan hebdomadaire", "Alertes email", "Historique complet"], highlight: true },
              { name: "Agence", price: "99€/mois", desc: "Pour les pros", features: ["Projets illimités", "Scan quotidien", "Rapports exportables", "Support prioritaire"] },
            ].map((plan) => (
              <div key={plan.name} style={{ background: plan.highlight ? "rgba(0,212,170,0.05)" : "#0d1f2d", border: plan.highlight ? "0.5px solid rgba(0,212,170,0.4)" : "0.5px solid #1a3a4a", borderRadius: "12px", padding: "24px", position: "relative" }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: "#00d4aa", color: "#0a1929", fontSize: "10px", fontWeight: "700", padding: "3px 12px", borderRadius: "20px", whiteSpace: "nowrap" }}>Recommandé</div>
                )}
                <p style={{ fontSize: "14px", fontWeight: "500", color: plan.highlight ? "#00d4aa" : "#e0f0f8", marginBottom: "4px" }}>{plan.name}</p>
                <p style={{ fontSize: "11px", color: "#5a8a9f", marginBottom: "16px" }}>{plan.desc}</p>
                <p style={{ fontSize: "24px", fontWeight: "700", color: "#e0f0f8", marginBottom: "20px" }}>{plan.price}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#5a8a9f" }}>
                      <i className="ti ti-check" style={{ fontSize: "12px", color: "#00d4aa" }}></i>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" style={{ display: "block", textAlign: "center", background: plan.highlight ? "#00d4aa" : "transparent", color: plan.highlight ? "#0a1929" : "#e0f0f8", border: plan.highlight ? "none" : "0.5px solid #1a3a4a", borderRadius: "6px", padding: "10px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ borderTop: "0.5px solid #1a3a4a", padding: "80px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "500", color: "#e0f0f8", marginBottom: "10px" }}>Prêt à sécuriser votre projet ?</h2>
          <p style={{ fontSize: "13px", color: "#5a8a9f", marginBottom: "28px" }}>Rejoignez les makers et créateurs de SaaS qui protègent leur travail avec Lokky</p>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#00d4aa", color: "#0a1929", fontSize: "14px", fontWeight: "600", padding: "14px 28px", borderRadius: "8px", textDecoration: "none" }}>
            Scanner mon projet gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "0.5px solid #1a3a4a", padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <i className="ti ti-shield-check" style={{ fontSize: "14px", color: "#00d4aa" }}></i>
          <span style={{ fontSize: "12px", color: "#5a8a9f" }}>LOKKY</span>
        </div>
        <p style={{ fontSize: "11px", color: "#5a8a9f" }}>© 2026 Lokky — Sécurité simplifiée pour makers et créateurs</p>
        <Link href="/pricing" style={{ fontSize: "12px", color: "#5a8a9f", textDecoration: "none" }}>Tarifs</Link>
      </footer>

    </div>
  );
}