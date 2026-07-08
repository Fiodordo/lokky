"use client";

import ScrollingBanner from "@/components/ScrollingBanner";
import Link from "next/link";
import FloatingReview from "@/components/FloatingReview";
import PublicScanner from "@/components/PublicScanner";
import { useEffect, useRef, useState } from "react";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, inView };
}

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const { ref, inView } = useInView();
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

function TerminalAnimation() {
  const lines = [
    { text: "$ lokky scan --target monprojet.com", color: "rgba(255,255,255,0.3)", delay: 0 },
    { text: "✓ Votre site est bien chiffré", color: "#a855f7", delay: 800 },
    { text: "✗ Votre site peut être bloqué par Chrome", color: "#ef4444", delay: 1600 },
    { text: "⚠ Les données de vos clients peuvent être volées", color: "#f59e0b", delay: 2400 },
  ];
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const fullText = lines[0].text;
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typeTimer);
        lines.slice(1).forEach((_, idx) => {
          setTimeout(() => setVisibleLines(prev => [...prev, idx + 1]), lines[idx + 1].delay - lines[0].delay);
        });
      }
    }, 40);
    return () => clearInterval(typeTimer);
  }, []);

  return (
    <div style={{ background: "#0d0018", border: "0.5px solid rgba(168,85,247,0.2)", borderRadius: "12px", padding: "20px", maxWidth: "500px", margin: "0 auto 32px", textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "14px" }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }}></div>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f59e0b" }}></div>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#a855f7" }}></div>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginLeft: "8px", fontFamily: "monospace" }}>lokky — scanner</span>
      </div>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "10px", minHeight: "16px" }}>
        {typedText}<span style={{ animation: "blink 1s infinite" }}>|</span>
      </p>
      {lines.slice(1).map((line, i) => (
        <p key={i} style={{ fontSize: "12px", color: line.color, fontFamily: "monospace", marginBottom: "4px", opacity: visibleLines.includes(i + 1) ? 1 : 0, transform: visibleLines.includes(i + 1) ? "translateX(0)" : "translateX(-10px)", transition: "opacity 0.4s ease, transform 0.4s ease" }}>
          {line.text}
        </p>
      ))}
      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );
}

function FloatingParticles() {
  const [particles, setParticles] = useState<Array<{
    width: number; height: number; opacity: number;
    left: number; top: number; duration: number; delay: number;
  }>>([]);

  useEffect(() => {
    setParticles(Array.from({ length: 20 }).map(() => ({
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      opacity: Math.random() * 0.3 + 0.05,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    })));
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p, i) => (
        <div key={i} style={{
          position: "absolute",
          width: `${p.width}px`,
          height: `${p.height}px`,
          borderRadius: "50%",
          background: "#a855f7",
          opacity: p.opacity,
          left: `${p.left}%`,
          top: `${p.top}%`,
          animation: `float ${p.duration}s infinite ease-in-out`,
          animationDelay: `${p.delay}s`,
        }} />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-30px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-15px); }
          75% { transform: translateY(-25px) translateX(5px); }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#080010", fontFamily: "var(--font-sans)", position: "relative" }}>
      <FloatingParticles />

      {/* Header */}
      <header style={{ borderBottom: "0.5px solid rgba(168,85,247,0.2)", padding: "0 40px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(8,0,16,0.9)", backdropFilter: "blur(10px)", zIndex: 10 }}>
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
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "120px 40px 80px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <AnimatedSection>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(168,85,247,0.1)", border: "0.5px solid rgba(168,85,247,0.3)", borderRadius: "20px", padding: "5px 14px", marginBottom: "32px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a855f7", animation: "pulse 2s infinite" }}></div>
            <span style={{ fontSize: "11px", color: "#c084fc" }}>Sécurité simplifiée pour makers et créateurs</span>
          </div>
          <h1 style={{ fontSize: "58px", fontWeight: "500", color: "#fff", lineHeight: "1.1", marginBottom: "24px" }}>
            Une faille peut<br />
            <span style={{ color: "#a855f7", fontStyle: "italic" }}>tout faire perdre.</span>
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", marginBottom: "48px", maxWidth: "520px", margin: "0 auto 48px" }}>
            Lokky vérifie votre site en 5 secondes et vous dit exactement quoi corriger — sans jargon technique.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <TerminalAnimation />
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <PublicScanner />
        </AnimatedSection>
      </section>

      {/* Stats */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", borderBottom: "0.5px solid rgba(168,85,247,0.15)", padding: "28px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "80px" }}>
          {[
            { value: 500, suffix: "+", label: "Sites vérifiés" },
            { value: 5, suffix: "s", label: "Temps de vérification" },
            { value: 100, suffix: "%", label: "Gratuit pour commencer" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "28px", fontWeight: "500", color: "#a855f7" }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      <ScrollingBanner />
      {/* Problèmes */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "100px 40px", position: "relative", zIndex: 1 }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff", marginBottom: "12px" }}>
              Ce qui arrive quand votre<br />site n'est pas sécurisé
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Des problèmes concrets qui coûtent de l'argent</p>
          </div>
        </AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { icon: "ti-alert-triangle", title: "Alerte rouge sur votre site", desc: "Chrome et Firefox bloquent votre site et affichent \"Ce site n'est pas sécurisé\". Vos visiteurs partent immédiatement.", color: "#ef4444", delay: 0 },
            { icon: "ti-lock-open", title: "Données clients exposées", desc: "Sans protection, les informations que vos clients saisissent sur votre site peuvent être interceptées.", color: "#f59e0b", delay: 150 },
            { icon: "ti-trending-down", title: "Ventes perdues", desc: "85% des visiteurs quittent un site non sécurisé avant même d'avoir vu votre offre.", color: "#a855f7", delay: 300 },
          ].map((item) => (
            <AnimatedSection key={item.title} delay={item.delay}>
              <div style={{ background: "#0d0018", border: "0.5px solid rgba(168,85,247,0.15)", borderRadius: "12px", padding: "24px", transition: "border-color 0.3s, transform 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.5)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.15)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
                <i className={`ti ${item.icon}`} style={{ fontSize: "22px", color: item.color, display: "block", marginBottom: "14px" }}></i>
                <p style={{ fontSize: "14px", fontWeight: "500", color: "#fff", marginBottom: "10px" }}>{item.title}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}>{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "100px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff", marginBottom: "12px" }}>Comment ça marche ?</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>3 étapes, 5 secondes</p>
            </div>
          </AnimatedSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { step: "01", title: "Entrez votre adresse", desc: "Tapez l'adresse de votre site. Rien à installer.", icon: "ti-world", delay: 0 },
              { step: "02", title: "Lokky analyse tout", desc: "En 5 secondes, tous les points de sécurité sont vérifiés.", icon: "ti-search", delay: 150 },
              { step: "03", title: "Recevez votre rapport", desc: "Score A à F et instructions claires pour corriger.", icon: "ti-shield-check", delay: 300 },
            ].map((item) => (
              <AnimatedSection key={item.step} delay={item.delay}>
                <div style={{ background: "#0d0018", border: "0.5px solid rgba(168,85,247,0.15)", borderRadius: "12px", padding: "24px", textAlign: "center", transition: "border-color 0.3s, transform 0.3s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.5)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.15)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
                  <p style={{ fontSize: "32px", fontWeight: "500", color: "rgba(168,85,247,0.3)", marginBottom: "12px", fontFamily: "monospace" }}>{item.step}</p>
                  <i className={`ti ${item.icon}`} style={{ fontSize: "22px", color: "#a855f7", display: "block", marginBottom: "12px" }}></i>
                  <p style={{ fontSize: "14px", fontWeight: "500", color: "#fff", marginBottom: "8px" }}>{item.title}</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}>{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "100px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff", marginBottom: "12px" }}>Tout ce que Lokky vérifie</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Sans jargon — juste ce que ça veut dire pour votre business</p>
            </div>
          </AnimatedSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {[
              { icon: "ti-lock", title: "Votre site est-il chiffré ?", desc: "On vérifie que la connexion entre vos visiteurs et votre site est sécurisée. Sans ça, Chrome affiche une alerte rouge.", delay: 0 },
              { icon: "ti-shield-check", title: "Vos données sont-elles protégées ?", desc: "On vérifie que votre site bloque les attaques les plus courantes qui permettent de voler les données de vos clients.", delay: 150 },
              { icon: "ti-bell", title: "Alertes avant que ça expire", desc: "Recevez un email 7 jours avant que votre protection expire — vous ne serez jamais pris par surprise.", delay: 0 },
              { icon: "ti-book", title: "Comment corriger ?", desc: "Pour chaque problème, Lokky vous donne les étapes exactes selon votre type de site (Shopify, WordPress, Vercel...).", delay: 150 },
            ].map((item) => (
              <AnimatedSection key={item.title} delay={item.delay}>
                <div style={{ display: "flex", gap: "16px", background: "#0d0018", border: "0.5px solid rgba(168,85,247,0.15)", borderRadius: "12px", padding: "24px", transition: "border-color 0.3s, transform 0.3s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.5)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.15)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}>
                  <i className={`ti ${item.icon}`} style={{ fontSize: "22px", color: "#a855f7", flexShrink: 0, marginTop: "2px" }}></i>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: "500", color: "#fff", marginBottom: "8px" }}>{item.title}</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}>{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "100px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff", marginBottom: "12px" }}>Tarifs simples</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Commencez gratuitement — évoluez selon vos besoins</p>
            </div>
          </AnimatedSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { name: "Starter", price: "Gratuit", desc: "Pour découvrir", features: ["1 scan/mois", "Score A à F", "Rapport de base", "Guides détaillés"], cta: "Commencer gratuitement", delay: 0 },
              { name: "Pro", price: "9€/mois", desc: "Pour les makers actifs", features: ["20 scans/mois", "Alertes email auto", "Historique complet", "Lien partageable"], highlight: true, cta: "Choisir Pro", delay: 150 },
              { name: "Agence", price: "39€/mois", desc: "Pour les pros", features: ["Scans illimités", "Scan auto quotidien", "Rapports exportables", "Support prioritaire"], cta: "Choisir Agence", delay: 300 },
            ].map((plan) => (
              <AnimatedSection key={plan.name} delay={plan.delay}>
                <div style={{ background: plan.highlight ? "rgba(168,85,247,0.1)" : "#0d0018", border: plan.highlight ? "2px solid #a855f7" : "0.5px solid rgba(168,85,247,0.15)", borderRadius: "12px", padding: "24px", position: "relative", height: "100%" }}>
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
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "100px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff" }}>Questions fréquentes</h2>
            </div>
          </AnimatedSection>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { q: "Est-ce que je dois être développeur ?", a: "Non ! Lokky est fait pour les créateurs et entrepreneurs. Tout est expliqué en français simple, sans jargon technique." },
              { q: "Est-ce que Lokky accède à mon site ?", a: "Non. Lokky analyse uniquement les informations publiques de votre site — celles que n'importe quel visiteur peut voir." },
              { q: "Combien de temps prend une vérification ?", a: "Entre 3 et 10 secondes. Vous recevez votre rapport immédiatement après." },
              { q: "Que faire si mon score est mauvais ?", a: "Lokky vous donne les étapes exactes pour corriger chaque problème, adaptées à votre type de site." },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <div style={{ background: "#0d0018", border: "0.5px solid rgba(168,85,247,0.15)", borderRadius: "10px", padding: "20px 24px", transition: "border-color 0.3s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.4)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(168,85,247,0.15)"}>
                  <p style={{ fontSize: "14px", fontWeight: "500", color: "#fff", marginBottom: "8px" }}>{item.q}</p>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7" }}>{item.a}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "120px 40px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <AnimatedSection>
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
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="ti ti-shield-check" style={{ fontSize: "14px", color: "#a855f7" }}></i>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>LOKKY</span>
        </div>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>© 2026 Lokky — Sécurité simplifiée pour tous</p>
        <Link href="/pricing" style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Tarifs</Link>
      </footer>

      <FloatingReview />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
      
    </div>
  );
}