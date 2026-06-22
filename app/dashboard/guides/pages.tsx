"use client";

const guides = [
  {
    issue: "Certificat SSL invalide ou expiré",
    severity: "🔴 Critique",
    severityColor: "bg-red-100 text-red-700",
    what: "Votre site n'est pas chiffré. Les visiteurs voient un message d'alerte rouge et quittent immédiatement.",
    why: "Google pénalise les sites non sécurisés. Les paiements en ligne ne fonctionnent plus. Vous perdez des clients.",
    how: [
      "Connectez-vous à votre hébergeur (OVH, Hostinger, Infomaniak...)",
      "Allez dans Hébergement → SSL/TLS",
      "Cliquez sur 'Renouveler' ou 'Activer Let's Encrypt'",
      "Attendez 5-10 minutes et vérifiez que le cadenas 🔒 apparaît",
    ],
    cms: {
      Shopify: "Paramètres → Domaines → SSL actif automatiquement",
      WordPress: "Installez le plugin 'Really Simple SSL'",
      Bubble: "Settings → Domain → SSL activé automatiquement",
    },
  },
  {
    issue: "Redirection HTTPS manquante",
    severity: "🟠 Important",
    severityColor: "bg-orange-100 text-orange-700",
    what: "Votre site est accessible en HTTP (non sécurisé). Les visiteurs qui tapent votre URL sans 'https://' ne sont pas redirigés automatiquement.",
    why: "Les données échangées ne sont pas chiffrées. Google préfère les sites HTTPS dans ses résultats.",
    how: [
      "Dans votre hébergeur, activez la redirection HTTP → HTTPS",
      "Sur Cloudflare : SSL/TLS → Edge Certificates → Always Use HTTPS → ON",
      "Sur Apache : ajoutez 'Redirect permanent / https://votresite.com' dans .htaccess",
      "Sur Nginx : ajoutez 'return 301 https://$host$request_uri;'",
    ],
    cms: {
      Shopify: "Automatique — rien à faire",
      WordPress: "Paramètres → Général → Mettez https:// dans l'URL",
      Bubble: "Automatique si domaine connecté",
    },
  },
  {
    issue: "Headers de sécurité manquants",
    severity: "🟠 Important",
    severityColor: "bg-orange-100 text-orange-700",
    what: "Votre site n'a pas les protections HTTP recommandées. Cela expose vos utilisateurs à des attaques comme le clickjacking ou l'injection de scripts.",
    why: "Ces headers protègent contre des attaques courantes et améliorent votre score de sécurité.",
    how: [
      "Sur Vercel : créez un fichier vercel.json avec des headers de sécurité",
      "Sur Netlify : créez un fichier _headers à la racine",
      "Sur Cloudflare : utilisez les Transform Rules pour ajouter des headers",
    ],
    cms: {
      Vercel: "Ajoutez dans vercel.json : { \"headers\": [{ \"source\": \"/(.*)\", \"headers\": [{ \"key\": \"X-Frame-Options\", \"value\": \"DENY\" }] }] }",
      Netlify: "Créez _headers : /* X-Frame-Options: DENY",
      Cloudflare: "Rules → Transform Rules → Modify Response Header",
    },
  },
  {
    issue: "Cookies non sécurisés",
    severity: "🟡 Mineur",
    severityColor: "bg-yellow-100 text-yellow-700",
    what: "Vos cookies n'ont pas les attributs 'Secure' et 'HttpOnly'. Ils peuvent être volés via des attaques XSS.",
    why: "Les cookies de session sans protection peuvent être interceptés et utilisés pour usurper l'identité de vos utilisateurs.",
    how: [
      "Dans votre code, ajoutez 'Secure' et 'HttpOnly' lors de la création des cookies",
      "Exemple Node.js : res.cookie('session', value, { secure: true, httpOnly: true })",
      "Exemple Next.js : cookies().set('session', value, { secure: true, httpOnly: true })",
    ],
    cms: {
      Shopify: "Géré automatiquement par Shopify",
      WordPress: "Installez 'Wordfence Security' pour sécuriser les cookies",
      "Next.js": "Utilisez l'option { secure: true, httpOnly: true } dans vos API routes",
    },
  },
];

export default function GuidesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Guides de correction</h1>
        <p className="text-gray-500 mt-1">Comment corriger les failles détectées par Lokky</p>
      </div>

      <div className="space-y-6">
        {guides.map((guide) => (
          <div key={guide.issue} className="bg-white rounded-xl border p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-semibold text-gray-900">{guide.issue}</h2>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${guide.severityColor}`}>
                {guide.severity}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Ce que ça veut dire</p>
                <p className="text-sm text-gray-700">{guide.what}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Pourquoi c'est important</p>
                <p className="text-sm text-gray-700">{guide.why}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Comment corriger</p>
                <ol className="space-y-1">
                  {guide.how.map((step, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="font-medium text-gray-400">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Par plateforme</p>
                <div className="space-y-1">
                  {Object.entries(guide.cms).map(([platform, instruction]) => (
                    <div key={platform} className="flex gap-2 text-sm">
                      <span className="font-medium text-gray-700 min-w-20">{platform} :</span>
                      <span className="text-gray-600">{instruction}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}