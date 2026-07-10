"use client";

import Link from "next/link";
import FloatingReviewEN from "@/components/FloatingReviewEN";
import PublicScanner from "@/components/PublicScanner";
import ScrollingBanner from "@/components/ScrollingBanner";
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
    const step = target / (2000 / 16);
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
    { text: "$ lokky scan --target myproject.com", color: "rgba(255,255,255,0.3)", delay: 0 },
    { text: "✓ Your site is properly encrypted", color: "#a855f7", delay: 800 },
    { text: "✗ Your site can be blocked by Chrome", color: "#ef4444", delay: 1600 },
    { text: "⚠ Your customers' data can be intercepted", color: "#f59e0b", delay: 2400 },
  ];
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const fullText = lines[0].text;
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i <= fullText.length) { setTypedText(fullText.slice(0, i)); i++; }
      else {
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
  const [particles, setParticles] = useState<Array<{ width: number; height: number; opacity: number; left: number; top: number; duration: number; delay: number; }>>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 20 }).map(() => ({
      width: Math.random() * 3 + 1, height: Math.random() * 3 + 1,
      opacity: Math.random() * 0.3 + 0.05, left: Math.random() * 100,
      top: Math.random() * 100, duration: Math.random() * 10 + 10, delay: Math.random() * 10,
    })));
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {particles.map((p, i) => (
        <div key={i} style={{ position: "absolute", width: `${p.width}px`, height: `${p.height}px`, borderRadius: "50%", background: "#a855f7", opacity: p.opacity, left: `${p.left}%`, top: `${p.top}%`, animation: `float ${p.duration}s infinite ease-in-out`, animationDelay: `${p.delay}s` }} />
      ))}
      <style>{`@keyframes float { 0%, 100% { transform: translateY(0px) translateX(0px); } 25% { transform: translateY(-30px) translateX(10px); } 50% { transform: translateY(-10px) translateX(-15px); } 75% { transform: translateY(-25px) translateX(5px); } }`}</style>
    </div>
  );
}

export default function HomeEN() {
  return (
    <div style={{ minHeight: "100vh", background: "#080010", fontFamily: "var(--font-sans)", position: "relative", overflowX: "hidden" }}>
      <FloatingParticles />

    {/* Header */}
        <header style={{ borderBottom: "0.5px solid rgba(168,85,247,0.2)", padding: "0 40px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(8,0,16,0.9)", backdropFilter: "blur(10px)", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <i className="ti ti-shield-check" style={{ fontSize: "18px", color: "#a855f7" }}></i>
                <span style={{ fontSize: "16px", fontWeight: "500", color: "#fff", letterSpacing: "1px" }}>LOKKY</span>
            </div>
            <Link href="/" style={{ fontSize: "11px", color: "#a855f7", textDecoration: "none", border: "0.5px solid rgba(168,85,247,0.3)", padding: "3px 10px", borderRadius: "20px" }}>🇫🇷 FR</Link>
            </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link href="/login" style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Login</Link>
          <Link href="/register" style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", fontSize: "13px", fontWeight: "600", padding: "8px 18px", borderRadius: "6px", textDecoration: "none" }}>Start for free</Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "120px 40px 80px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <AnimatedSection>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(168,85,247,0.1)", border: "0.5px solid rgba(168,85,247,0.3)", borderRadius: "20px", padding: "5px 14px", marginBottom: "32px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a855f7", animation: "pulse 2s infinite" }}></div>
            <span style={{ fontSize: "11px", color: "#c084fc" }}>Security made simple for makers & SaaS founders</span>
          </div>
          <h1 style={{ fontSize: "58px", fontWeight: "500", color: "#fff", lineHeight: "1.1", marginBottom: "24px" }}>
            One vulnerability can<br />
            <span style={{ color: "#a855f7", fontStyle: "italic" }}>cost you everything.</span>
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", marginBottom: "48px", maxWidth: "520px", margin: "0 auto 48px" }}>
            Lokky scans your website in 5 seconds and tells you exactly what to fix — no technical jargon.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={200}><TerminalAnimation /></AnimatedSection>
        <AnimatedSection delay={400}><PublicScanner /></AnimatedSection>
      </section>

      {/* Stats */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", borderBottom: "0.5px solid rgba(168,85,247,0.15)", padding: "28px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "80px" }}>
          {[
            { value: 500, suffix: "+", label: "Sites scanned" },
            { value: 5, suffix: "s", label: "Scan time" },
            { value: 100, suffix: "%", label: "Free to start" },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "28px", fontWeight: "500", color: "#a855f7" }}><AnimatedCounter target={stat.value} suffix={stat.suffix} /></p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <ScrollingBanner />

      {/* Problems */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "100px 40px", position: "relative", zIndex: 1 }}>
        <AnimatedSection>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff", marginBottom: "12px" }}>What happens when your site isn't secure</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Real problems that cost you money</p>
          </div>
        </AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { icon: "ti-alert-triangle", title: "Red warning on your site", desc: "Chrome and Firefox block your site and display \"This site is not secure\". Your visitors leave immediately.", color: "#ef4444", delay: 0 },
            { icon: "ti-lock-open", title: "Customer data exposed", desc: "Without protection, information your customers enter on your site can be intercepted by hackers.", color: "#f59e0b", delay: 150 },
            { icon: "ti-trending-down", title: "Lost sales", desc: "85% of visitors leave an unsecured site before even seeing your offer.", color: "#a855f7", delay: 300 },
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

      {/* How it works */}
      <section style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "100px 40px", position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff", marginBottom: "12px" }}>How does it work?</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>3 steps, 5 seconds</p>
            </div>
          </AnimatedSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { step: "01", title: "Enter your URL", desc: "Type your website address. Nothing to install.", icon: "ti-world", delay: 0 },
              { step: "02", title: "Lokky analyzes everything", desc: "In 5 seconds, all security points are checked automatically.", icon: "ti-search", delay: 150 },
              { step: "03", title: "Get your report", desc: "A to F score with clear instructions to fix every issue.", icon: "ti-shield-check", delay: 300 },
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
              <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff", marginBottom: "12px" }}>Everything Lokky checks for you</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>No jargon — just what it means for your business</p>
            </div>
          </AnimatedSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {[
              { icon: "ti-lock", title: "Is your site encrypted?", desc: "We check that the connection between your visitors and your site is secure. Without it, Chrome displays a red warning.", delay: 0 },
              { icon: "ti-shield-check", title: "Is your data protected?", desc: "We check that your site blocks the most common attacks that allow hackers to steal your customers' data.", delay: 150 },
              { icon: "ti-bell", title: "Alerts before expiry", desc: "Get an email 7 days before your SSL certificate expires — you'll never be caught off guard.", delay: 0 },
              { icon: "ti-book", title: "How to fix it?", desc: "For each issue, Lokky gives you exact steps based on your site type (Shopify, WordPress, Vercel...).", delay: 150 },
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
              <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff", marginBottom: "12px" }}>Simple pricing</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>Start for free — scale as you grow</p>
            </div>
          </AnimatedSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { name: "Starter", price: "Free", desc: "To get started", features: ["1 scan/month", "A to F score", "Basic report", "Fix guides"], cta: "Start for free", delay: 0 },
              { name: "Pro", price: "€9/mo", desc: "For active makers", features: ["20 scans/month", "Auto email alerts", "Full history", "Shareable report"], highlight: true, cta: "Choose Pro", delay: 150 },
              { name: "Agency", price: "€39/mo", desc: "For pros & agencies", features: ["Unlimited scans", "Daily auto scan", "Exportable reports", "Priority support"], cta: "Choose Agency", delay: 300 },
            ].map((plan) => (
              <AnimatedSection key={plan.name} delay={plan.delay}>
                <div style={{ background: plan.highlight ? "rgba(168,85,247,0.1)" : "#0d0018", border: plan.highlight ? "2px solid #a855f7" : "0.5px solid rgba(168,85,247,0.15)", borderRadius: "12px", padding: "24px", position: "relative", height: "100%" }}>
                  {plan.highlight && (
                    <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", fontSize: "10px", fontWeight: "700", padding: "3px 12px", borderRadius: "20px", whiteSpace: "nowrap" }}>Most popular</div>
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
              <h2 style={{ fontSize: "36px", fontWeight: "500", color: "#fff" }}>FAQ</h2>
            </div>
          </AnimatedSection>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { q: "Do I need to be a developer?", a: "Not at all! Lokky is built for creators and entrepreneurs. Everything is explained in plain English, no technical jargon." },
              { q: "Does Lokky access my website?", a: "No. Lokky only analyzes the public information of your site — what any visitor can already see." },
              { q: "How long does a scan take?", a: "Between 3 and 10 seconds. You get your report immediately after." },
              { q: "What if my score is bad?", a: "Lokky gives you exact steps to fix each issue, tailored to your type of site." },
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
              Is your site<br /><span style={{ color: "#a855f7", fontStyle: "italic" }}>really secure?</span>
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "32px" }}>
              Check now for free — results in 5 seconds.
            </p>
            <Link href="/register" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "linear-gradient(135deg, #a855f7, #6366f1)", color: "#fff", fontSize: "14px", fontWeight: "600", padding: "16px 36px", borderRadius: "8px", textDecoration: "none" }}>
              <i className="ti ti-search" style={{ fontSize: "15px" }}></i>
              Scan my site for free
            </Link>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "12px" }}>No credit card • No signup required • 100% free</p>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "0.5px solid rgba(168,85,247,0.15)", padding: "24px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <i className="ti ti-shield-check" style={{ fontSize: "14px", color: "#a855f7" }}></i>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>LOKKY</span>
        </div>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>© 2026 Lokky — Security made simple for makers</p>
        <Link href="/" style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none" }}>Français</Link>
      </footer>

      <FloatingReviewEN />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
}