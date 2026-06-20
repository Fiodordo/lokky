import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
        <span className="text-xl font-bold">Lokky</span>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
            Connexion
          </Link>
          <Link href="/register" className="bg-black text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-800">
            Commencer gratuitement
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
          🔒 Sécurité simplifiée pour makers et créateurs de SaaS
        </div>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
          Votre projet est-il<br />vraiment sécurisé ?
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Lokky scanne votre site ou application — qu'il soit codé à la main, en no-code, ou avec l'aide de l'IA — et détecte les failles de sécurité avant qu'elles ne deviennent un problème.
        </p>
        <Link href="/register" className="bg-black text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 inline-block">
          Scanner mon projet gratuitement →
        </Link>
        <p className="text-sm text-gray-400 mt-4">Sans carte bancaire • Résultat en quelques secondes</p>
      </section>

      {/* Problème */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Construire vite, c'est bien. Sécuriser aussi.</h2>
          <p className="text-gray-500 mb-12">Avec le vibe coding et le no-code, on lance vite — souvent trop vite pour penser à la sécurité</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: "🤖", title: "Code généré rapidement", desc: "L'IA va vite, mais ne pense pas toujours à la sécurité par défaut" },
              { emoji: "🔓", title: "Données exposées", desc: "Une mauvaise configuration peut exposer les données de vos utilisateurs sans que vous le sachiez" },
              { emoji: "📉", title: "Confiance perdue", desc: "Une faille découverte par un utilisateur peut couler la réputation de votre projet" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border text-left">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
          <p className="text-gray-500 mb-12">Simple, rapide, pensé pour les non-experts en sécurité</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {[
              { emoji: "🔍", title: "Scan complet instantané", desc: "SSL, headers de sécurité, cookies — tout vérifié en quelques secondes" },
              { emoji: "📊", title: "Score clair A à F", desc: "Comprenez immédiatement où vous en êtes, sans jargon technique" },
              { emoji: "🔔", title: "Alertes automatiques", desc: "Recevez un email avant que votre certificat SSL expire" },
              { emoji: "📈", title: "Historique des scans", desc: "Suivez l'évolution de la sécurité de votre projet dans le temps" },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 border rounded-xl">
                <div className="text-2xl">{item.emoji}</div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Tarifs simples et transparents</h2>
          <p className="text-gray-500 mb-12">Commencez gratuitement, évoluez selon vos besoins</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "Gratuit", desc: "Pour découvrir", features: ["1 projet", "Scan manuel", "Score de sécurité"] },
              { name: "Builder", price: "29€/mois", desc: "Pour les makers actifs", features: ["5 projets", "Scan hebdomadaire", "Alertes email", "Historique complet"], highlight: true },
              { name: "Agence", price: "99€/mois", desc: "Pour les pros", features: ["Projets illimités", "Scan quotidien", "Rapports exportables", "Support prioritaire"] },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-xl p-6 border text-left ${plan.highlight ? "bg-black text-white border-black" : "bg-white"}`}>
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}>{plan.desc}</p>
                <div className="text-3xl font-bold mb-6">{plan.price}</div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`text-sm flex gap-2 ${plan.highlight ? "text-gray-300" : "text-gray-600"}`}>
                      <span>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block text-center py-2 rounded-lg text-sm font-medium ${plan.highlight ? "bg-white text-black hover:bg-gray-100" : "bg-black text-white hover:bg-gray-800"}`}>
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à sécuriser votre projet ?</h2>
          <p className="text-gray-500 mb-8">Rejoignez les makers et créateurs de SaaS qui protègent leur travail avec Lokky</p>
          <Link href="/register" className="bg-black text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 inline-block">
            Scanner mon projet gratuitement →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 text-center text-sm text-gray-400">
        © 2026 Lokky — Sécurité simplifiée pour makers et créateurs
      </footer>
    </div>
  );
}