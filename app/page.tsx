import Link from "next/link";
import PublicScanner from "@/components/PublicScanner";

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#080010", fontFamily: "var(--font-sans)" }}>

      {/* Header */}
      <header style={{ borderBottom: "0.5px solid rgba(168,85,247,0.2)", padding: "0 40px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#080010", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="ti ti-shield-check" style={{ fontSize: "18px", color: "#a855f7" }}></i>
          <span style={{ fontSize: "16px", fontWeight: "500", color: "#fff", letterSpacing: "1px" }}>LOKKY</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/login" style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Connexion</Link>
          <Link href="/register" style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", fontSize: "13px", fontWeight: "600", padding: "8px 18px", borderRadius: "6px", textDecoration: "none" }}>Essai gratuit</Link>
        </div>
      </header>

     {/* Hero */}
     <section style={{ maxWidth: "800px", margin: "0 auto", padding: "120px 40px 80px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(168,85,247,0.1)", border: "0.5px solid rgba(168,85,247,0.3)", borderRadius: "20px", padding: "5px 14px", marginBottom: "32px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a855f7" }}></div>
          <span style={{ fontSize: "11px", color: "#c084fc" }}>Sécurité simplifiée pour makers et créateurs</span>
        </div>

        <h1 style={{ fontSize: "58px", fontWeight: "500", color: "#fff", lineHeight: "1.1", marginBottom: "24px" }}>
          Une faille peut<br />
          <span style={{ color: "#a855f7", fontStyle: "italic" }}>tout faire perdre.</span>
        </h1>

        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", marginBottom: "48px", maxWidth: "520px", margin: "0 auto 48px" }}>
          Lokky vérifie votre site en 5 secondes et vous dit exactement quoi corriger — sans jargon technique.
        </p>

        <PublicScanner />
      </section>

        {/* Terminal */}
        <div style={{ background: "#0d0018", border: "0.5px solid rgba(168,85,247,0.2)", borderRadius: "12px", padding: "20px", maxWidth: "500px", margin: "0 auto 32px", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></div>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#a855f7" }}></div>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginLeft: "8px", fontFamily: "monospace" }}>lokky — scanner</span>
          </div>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "10px" }}>$ lokky scan --target monprojet.com</p>
          <p style={{ fontSize: "12px", color: "#a855f7", fontFamily: "monospace", marginBottom: "4px" }}>✓ Votre site est bien chiffré</p>
          <p style={{ fontSize: "12px", color: "#ef4444", fontFamily: "monospace", marginBottom: "4px" }}>✗ Votre site peut être bloqué par Chrome</p>
          <p style={{ fontSize: "12px", color: "#f59e0b", fontFamily: "monospace" }}>⚠ Les données de vos clients peuvent être volées</p>
        </div>


    

      {/* Stats */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", borderBottom: "0.5px solid rgba(168,85,247,0.15)", padding: "28px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "80px" }}>
          {[
            { value: "500+", label: "Sites vérifiés" },
            { value: "5s", label: "Temps de vérification" },
            { value: "100%", label: "Gratuit pour commencer" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "28px", fontWeight: "500", color: "#a855f7" }}>{stat.value}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Problèmes */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "100px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff", marginBottom: "12px" }}>
            Ce qui arrive quand votre<br />site n'est pas sécurisé
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Des problèmes concrets qui coûtent de l'argent</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { icon: "ti-alert-triangle", title: "Alerte rouge sur votre site", desc: "Chrome et Firefox bloquent votre site et affichent \"Ce site n'est pas sécurisé\". Vos visiteurs partent immédiatement.", color: "#ef4444" },
            { icon: "ti-lock-open", title: "Données clients exposées", desc: "Sans protection, les informations que vos clients saisissent sur votre site peuvent être interceptées.", color: "#f59e0b" },
            { icon: "ti-trending-down", title: "Ventes perdues", desc: "85% des visiteurs quittent un site non sécurisé avant même d'avoir vu votre offre.", color: "#a855f7" },
          ].map((item) => (
            <div key={item.title} style={{ background: "#0d0018", border: "0.5px solid rgba(168,85,247,0.15)", borderRadius: "12px", padding: "24px" }}>
              <i className={`ti ${item.icon}`} style={{ fontSize: "22px", color: item.color, display: "block", marginBottom: "14px" }}></i>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "#fff", marginBottom: "10px" }}>{item.title}</p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "100px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff", marginBottom: "12px" }}>Comment ça marche ?</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>3 étapes, 5 secondes</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { step: "01", title: "Entrez votre adresse", desc: "Tapez l'adresse de votre site. Rien à installer.", icon: "ti-world" },
              { step: "02", title: "Lokky analyse tout", desc: "En 5 secondes, tous les points de sécurité sont vérifiés.", icon: "ti-search" },
              { step: "03", title: "Recevez votre rapport", desc: "Score A à F et instructions claires pour corriger.", icon: "ti-shield-check" },
            ].map((item) => (
              <div key={item.step} style={{ background: "#0d0018", border: "0.5px solid rgba(168,85,247,0.15)", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
                <p style={{ fontSize: "32px", fontWeight: "500", color: "rgba(168,85,247,0.3)", marginBottom: "12px", fontFamily: "monospace" }}>{item.step}</p>
                <i className={`ti ${item.icon}`} style={{ fontSize: "22px", color: "#a855f7", display: "block", marginBottom: "12px" }}></i>
                <p style={{ fontSize: "14px", fontWeight: "500", color: "#fff", marginBottom: "8px" }}>{item.title}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "100px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff", marginBottom: "12px" }}>Tout ce que Lokky vérifie</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Sans jargon — juste ce que ça veut dire pour votre business</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {[
              { icon: "ti-lock", title: "Votre site est-il chiffré ?", desc: "On vérifie que la connexion entre vos visiteurs et votre site est sécurisée. Sans ça, Chrome affiche une alerte rouge." },
              { icon: "ti-shield-check", title: "Vos données sont-elles protégées ?", desc: "On vérifie que votre site bloque les attaques les plus courantes qui permettent de voler les données de vos clients." },
              { icon: "ti-bell", title: "Alertes avant que ça expire", desc: "Recevez un email 7 jours avant que votre protection expire — vous ne serez jamais pris par surprise." },
              { icon: "ti-book", title: "Comment corriger ?", desc: "Pour chaque problème, Lokky vous donne les étapes exactes selon votre type de site (Shopify, WordPress, Vercel...)." },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", gap: "16px", background: "#0d0018", border: "0.5px solid rgba(168,85,247,0.15)", borderRadius: "12px", padding: "24px" }}>
                <i className={`ti ${item.icon}`} style={{ fontSize: "22px", color: "#a855f7", flexShrink: 0, marginTop: "2px" }}></i>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "500", color: "#fff", marginBottom: "8px" }}>{item.title}</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "100px 40px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff", marginBottom: "12px" }}>Tarifs simples</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Commencez gratuitement — évoluez selon vos besoins</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { name: "Starter", price: "Gratuit", desc: "Pour découvrir", features: ["3 vérifications/mois", "Rapport complet", "Score A à F", "Guides de correction"], cta: "Commencer gratuitement" },
              { name: "Builder", price: "29€/mois", desc: "Pour les makers actifs", features: ["50 vérifications/mois", "Alertes email auto", "Historique complet", "Guides par plateforme"], highlight: true, cta: "Choisir Builder" },
              { name: "Agence", price: "99€/mois", desc: "Pour les pros", features: ["Vérifications illimitées", "Scan quotidien auto", "Rapports exportables", "Support prioritaire"], cta: "Choisir Agence" },
            ].map((plan) => (
              <div key={plan.name} style={{ background: plan.highlight ? "rgba(168,85,247,0.1)" : "#0d0018", border: plan.highlight ? "2px solid #a855f7" : "0.5px solid rgba(168,85,247,0.15)", borderRadius: "12px", padding: "24px", position: "relative" }}>
                {plan.highlight && (
                  <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", fontSize: "10px", fontWeight: "700", padding: "3px 12px", borderRadius: "20px", whiteSpace: "nowrap" }}>Le plus populaire</div>
                )}
                <p style={{ fontSize: "14px", fontWeight: "500", color: plan.highlight ? "#c084fc" : "#fff", marginBottom: "4px" }}>{plan.name}</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>{plan.desc}</p>
                <p style={{ fontSize: "26px", fontWeight: "500", color: "#fff", marginBottom: "20px" }}>{plan.price}</p>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                      <i className="ti ti-check" style={{ fontSize: "12px", color: "#a855f7" }}></i>{f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" style={{ display: "block", textAlign: "center", background: plan.highlight ? "linear-gradient(135deg, #a855f7, #6366f1)" : "transparent", color: "#fff", border: plan.highlight ? "none" : "0.5px solid rgba(168,85,247,0.3)", borderRadius: "6px", padding: "10px", fontSize: "13px", fontWeight: "600", textDecoration: "none" }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "100px 40px" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff" }}>Questions fréquentes</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { q: "Est-ce que je dois être développeur ?", a: "Non ! Lokky est fait pour les créateurs et entrepreneurs. Tout est expliqué en français simple, sans jargon technique." },
              { q: "Est-ce que Lokky accède à mon site ?", a: "Non. Lokky analyse uniquement les informations publiques de votre site — celles que n'importe quel visiteur peut voir." },
              { q: "Combien de temps prend une vérification ?", a: "Entre 3 et 10 secondes. Vous recevez votre rapport immédiatement après." },
              { q: "Que faire si mon score est mauvais ?", a: "Lokky vous donne les étapes exactes pour corriger chaque problème, adaptées à votre type de site." },
            ].map((item, i) => (
              <div key={i} style={{ background: "#0d0018", border: "0.5px solid rgba(168,85,247,0.15)", borderRadius: "10px", padding: "20px 24px" }}>
                <p style={{ fontSize: "14px", fontWeight: "500", color: "#fff", marginBottom: "8px" }}>{item.q}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "120px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "40px", fontWeight: "500", color: "#fff", marginBottom: "12px", lineHeight: "1.2" }}>
            Votre site est-il<br /><span style={{ color: "#a855f7", fontStyle: "italic" }}>vraiment protégé ?</span>
          </h2>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "32px" }}>
            Vérifiez maintenant gratuitement — résultat en 5 secondes.
          </p>
          <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "16px 36px", borderRadius: "8px", textDecoration: "none" }}>
            <i className="ti ti-search" style={{ fontSize: "15px" }}></i>
            Vérifier mon site gratuitement
          </Link>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "12px" }}>Sans carte bancaire • Sans inscription • 100% gratuit</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="ti ti-shield-check" style={{ fontSize: "14px", color: "#a855f7" }}></i>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>LOKKY</span>
        </div>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>© 2026 Lokky — Sécurité simplifiée pour tous</p>
        <Link href="/pricing" style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Tarifs</Link>
      </footer>

    </div>
  );
}