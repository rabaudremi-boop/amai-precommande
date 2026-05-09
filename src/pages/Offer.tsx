import { Link } from 'react-router-dom';
import {
  Check,
  Smartphone,
  Bell,
  Monitor,
  CreditCard,
  Clock,
  Sparkles,
  ShieldCheck,
  Phone,
  Mail,
  ArrowRight,
  Zap,
  TrendingUp,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import Logo from '../components/Logo';

export default function Offer() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Top bar */}
      <header className="border-b border-cream-200 bg-cream-50/85 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Logo showTagline />
          <Link
            to="/"
            className="text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-500 hover:text-sage-600"
          >
            Voir la démo →
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-16 pt-8">
        {/* Hero */}
        <section className="overflow-hidden rounded-card bg-gradient-to-br from-sage-200 via-sage-100 to-cream-100 p-6 shadow-soft sm:p-10">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-700">
            <Sparkles size={14} />
            <span>Offre commerciale · Mai 2026</span>
          </div>
          <h1 className="mt-4 font-display text-[40px] font-bold leading-[1.05] text-ink-900 sm:text-[52px]">
            L'app de précommande
            <br />
            <span className="text-sage-600">faite sur mesure pour A Maï.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-700 sm:text-[17px]">
            Vos clients commandent depuis leur téléphone, paient en ligne,
            choisissent leur créneau et récupèrent au comptoir sans attendre.
            Vous recevez la commande sur un écran dédié et sur votre téléphone,
            en temps réel.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="chip bg-white text-sage-700">App client iOS + Android</span>
            <span className="chip bg-white text-sage-700">Dashboard restaurateur</span>
            <span className="chip bg-white text-sage-700">Écran cuisine live</span>
            <span className="chip bg-white text-sage-700">Paiement intégré</span>
          </div>
        </section>

        {/* Bénéfices */}
        <section className="mt-10">
          <h2 className="font-display text-3xl font-bold text-ink-900">
            Ce qui change pour vous
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Benefit
              icon={<TrendingUp size={18} />}
              title="+ de ventes"
              text="Vous servez plus de clients sur le créneau du midi sans embaucher : la queue se transforme en commandes pré-payées."
            />
            <Benefit
              icon={<Clock size={18} />}
              title="Zéro attente"
              text="Le client arrive, donne son nom, repart. Vous gagnez 3-5 min par client en moyenne."
            />
            <Benefit
              icon={<Zap size={18} />}
              title="Cash flow"
              text="Encaissé avant même de préparer. Plus de no-show non payés, plus d'hésitation au comptoir."
            />
          </div>
        </section>

        {/* Ce qui est inclus */}
        <section className="mt-10 rounded-card bg-white p-6 shadow-soft sm:p-8">
          <h2 className="font-display text-3xl font-bold text-ink-900">
            Tout ce qui est inclus
          </h2>
          <p className="mt-2 text-[14px] text-ink-500">
            Une plateforme complète, pas un site web.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Feature
              icon={<Smartphone size={20} />}
              title="App client mobile-first"
              points={[
                'Catalogue par catégories',
                'Personnalisation salades (sauces, sans, suppléments)',
                'Choix du créneau de retrait',
                'Paiement carte sécurisé',
                'Installable sur iPhone + Android (1 tap)',
              ]}
            />
            <Feature
              icon={<Monitor size={20} />}
              title="Dashboard restaurateur"
              points={[
                'Toutes les commandes du jour',
                'Regroupement par créneau',
                'Statuts : Nouvelle → En préparation → Prête',
                'Gestion produits et ruptures en 1 clic',
                'Pause des commandes si débordé',
              ]}
            />
            <Feature
              icon={<Bell size={20} />}
              title="Alertes temps réel"
              points={[
                'Sonnerie sur écran cuisine à chaque commande',
                'Notification push sur votre iPhone',
                'Aucune commande oubliée',
              ]}
            />
            <Feature
              icon={<CreditCard size={20} />}
              title="Paiement & encaissement"
              points={[
                'Apple Pay / Google Pay / carte',
                'Reversement automatique sur votre compte',
                'Pas de TPE physique nécessaire',
              ]}
            />
          </div>
        </section>

        {/* Cahier des charges */}
        <section className="mt-10 overflow-hidden rounded-card bg-white shadow-soft">
          <div className="border-l-4 border-sage-500 bg-cream-50 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-700">
              <FileText size={14} />
              Cahier des charges détaillé
            </div>
            <h2 className="mt-2 font-display text-3xl font-bold text-ink-900">
              Périmètre fonctionnel & technique
            </h2>
            <p className="mt-1 max-w-2xl text-[14px] text-ink-700">
              Ce que je m'engage à livrer, dans les moindres détails. Ce
              document fait partie intégrante du devis et du contrat.
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-7 p-6 sm:p-8 md:grid-cols-2">
            <SpecBlock
              title="1. Parcours client (mobile-first)"
              points={[
                'Page d’accueil avec accroche, horaires du jour et délai mini',
                'Catalogue par catégories : Signatures, À composer, Menus, Boissons, Desserts',
                'Fiche produit personnalisable (sauce, retrait d’ingrédients, suppléments)',
                'Panier modifiable avec quantités et options visibles',
                'Sélection de créneau (disponible / presque complet / complet)',
                'Paiement carte sécurisé + récapitulatif',
                'Confirmation avec numéro de commande et instructions de retrait',
              ]}
            />
            <SpecBlock
              title="2. Tableau de bord restaurateur"
              points={[
                'Connexion sécurisée par identifiant',
                'Vue jour : commandes, CA, panier moyen, prochain créneau',
                'Bouton « mettre en pause les commandes » en 1 clic',
                'Liste filtrable par statut, regroupée par créneau',
                'Fiche détail : client, produits, options, transitions de statut',
                'Gestion des produits (disponibilité, prix, rupture)',
                'Paramètres généraux du restaurant',
              ]}
            />
            <SpecBlock
              title="3. Écran cuisine"
              points={[
                'Vue plein écran adaptée écrans comptoir / tablettes',
                'Cartes XL par créneau, codage couleur des statuts',
                'Sonnerie audible à chaque nouvelle commande',
                'Boutons gros doigts pour faire avancer les statuts',
                'Horloge live et temps écoulé par commande',
              ]}
            />
            <SpecBlock
              title="4. Notifications temps réel"
              points={[
                'Notification push iOS / Android sur votre téléphone (PWA installée)',
                'Vibration haptique',
                'Synchronisation temps réel sans rafraîchissement manuel',
                'Email de confirmation client à chaque commande payée',
              ]}
            />
            <SpecBlock
              title="5. Paiement"
              points={[
                'Intégration Stripe ou SumUp (au choix selon vos préférences)',
                'Apple Pay, Google Pay, carte bancaire',
                '3D Secure inclus',
                'Reversement automatique sur votre compte bancaire (J+2 en moyenne)',
                'Gestion des remboursements depuis l’admin',
              ]}
            />
            <SpecBlock
              title="6. Hébergement & sécurité"
              points={[
                'Hébergement Firebase (Google Cloud), serveurs en Europe',
                'Base de données Firestore en europe-west',
                'Lien dédié à votre restaurant (sur notre infrastructure)',
                'HTTPS de bout en bout (certificat SSL auto-renouvelé)',
                'Sauvegardes automatiques quotidiennes',
                'Disponibilité visée 99,9% (SLA Google Cloud)',
              ]}
            />
            <SpecBlock
              title="7. Stack technique & conformité"
              points={[
                'Application web installable (PWA) iOS + Android',
                'Compatible iPhone 8+, Android 8+, navigateurs modernes',
                'Conformité RGPD : mentions légales, consentement cookies',
                'Données clients hébergées en Union Européenne',
                'Code source remis sur demande à la fin du contrat',
              ]}
            />
          </div>

          <div className="border-t border-cream-200 bg-rose-50/40 px-6 py-5 sm:px-8">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-700">
              <AlertTriangle size={14} />
              Hors périmètre
            </div>
            <p className="mt-2 max-w-2xl text-[13px] text-ink-700">
              Les éléments suivants ne sont pas inclus dans cette offre. Ils
              peuvent faire l’objet d’un avenant tarifé séparément si
              vous le souhaitez par la suite :
            </p>
            <ul className="mt-3 grid gap-1.5 text-[13px] text-ink-700 sm:grid-cols-2">
              {[
                'Intégration caisse physique (Tiller, Lightspeed, etc.)',
                'Module de fidélité / système de points',
                'Application mobile native (App Store / Play Store)',
                'Création site internet vitrine + référencement SEO Google',
                'Nom de domaine personnalisé (.fr / .com)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-200 px-6 py-4 text-[12px] text-ink-500 sm:px-8">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-sage-600" />
              Document contractuel · annexé au devis
            </span>
            <span>Version 1.0 · Mai 2026</span>
          </div>
        </section>

        {/* Tarif */}
        <section className="mt-10">
          <div className="overflow-hidden rounded-card bg-ink-900 p-1 shadow-lift">
            <div className="rounded-[1.4rem] bg-gradient-to-br from-sage-50 via-cream-50 to-sage-100 p-8 sm:p-10">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-700">
                <Sparkles size={14} />
                Tarif
              </div>
              <h2 className="mt-3 font-display text-4xl font-bold text-ink-900 sm:text-5xl">
                Une offre claire,
                <br />
                <span className="text-sage-600">sans surprise.</span>
              </h2>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <PricingCard
                  label="Mise en place"
                  amount="590 €"
                  unit="HT, payé une seule fois"
                  details={[
                    'Conception & design adaptés à votre marque',
                    'Configuration du catalogue (vos salades)',
                    'Hébergement sécurisé HTTPS inclus',
                    'Mise en ligne sur lien dédié à votre restaurant',
                    'Formation 1h sur Zoom ou en présentiel',
                  ]}
                />
                <PricingCard
                  label="Abonnement"
                  amount="39 €"
                  unit="HT / mois"
                  highlight
                  details={[
                    'Hébergement, sécurité, sauvegardes',
                    'Mises à jour automatiques iOS/Android',
                    'Support technique réactif',
                    'Évolutions mineures incluses',
                  ]}
                />
              </div>

              <div className="mt-7 rounded-2xl bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-[12px] font-semibold uppercase tracking-wide text-ink-500">
                      Total première année
                    </div>
                    <div className="mt-1 font-display text-3xl font-bold">
                      1 058 € HT
                    </div>
                    <div className="mt-1 text-[12px] text-ink-500">
                      soit 88 € / mois lissé sur 12 mois
                    </div>
                  </div>
                  <div className="rounded-full bg-sage-100 px-4 py-2 text-[13px] font-semibold text-sage-700">
                    Engagement 12 mois
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* L'argument du jour */}
        <section className="mt-8 rounded-card bg-sage-600 p-6 text-white shadow-lift sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur">
              <Sparkles size={22} />
            </div>
            <div>
              <h3 className="font-display text-2xl font-bold leading-tight">
                1,30 € par jour. Une salade en plus par jour, et c'est
                largement remboursé.
              </h3>
              <p className="mt-2 text-[15px] text-white/90">
                39 € / 30 jours = 1,30 €. Si l'app vous fait vendre ne
                serait-ce qu'<strong>une seule salade supplémentaire</strong> dans
                la journée, vous êtes déjà rentable. La plupart des restos
                équipés voient leur volume midi grimper de 15 à 25%.
              </p>
            </div>
          </div>
        </section>

        {/* Coûts paiement */}
        <section className="mt-10">
          <h2 className="font-display text-3xl font-bold text-ink-900">
            Côté paiement carte
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] text-ink-700">
            Le seul autre coût : la commission sur les paiements carte. C'est
            la même que sur votre TPE actuel. Souvent <strong>moins chère</strong>.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <ComparisonCard
              title="Votre TPE actuel"
              fee="1,7% – 2,5%"
              extra="+ 25 à 50 € / mois de location"
              tone="muted"
            />
            <ComparisonCard
              title="SumUp via l'app"
              fee="1,4%"
              extra="0 € de frais fixes"
              tone="primary"
              badge="Recommandé"
            />
            <ComparisonCard
              title="Stripe via l'app"
              fee="1,5% + 0,25 €"
              extra="0 € de frais fixes"
              tone="muted"
            />
          </div>
          <div className="mt-4 rounded-2xl border border-sage-200 bg-sage-50 p-4 text-[14px] text-sage-700">
            <ShieldCheck className="mr-1 inline" size={14} /> Avec SumUp, vous
            pouvez <strong>résilier votre TPE physique</strong> et récupérer
            l'abonnement mensuel — souvent supérieur aux 39 € de l'app.
            <br />
            <span className="font-semibold">Coût net mensuel : potentiellement 0 €.</span>
          </div>
        </section>

        {/* Timeline */}
        <section className="mt-10">
          <h2 className="font-display text-3xl font-bold text-ink-900">
            Mise en route en 15 jours
          </h2>
          <ol className="mt-5 space-y-3">
            <Step
              n="1"
              title="Validation de l'offre"
              text="Signature du devis, premier acompte de 290 €."
              when="J+0"
            />
            <Step
              n="2"
              title="Configuration & design"
              text="Vous m'envoyez votre menu, vos photos, votre identité. Je personnalise l'app à votre marque."
              when="J+1 à J+7"
            />
            <Step
              n="3"
              title="Mise en ligne & tests"
              text="L'app est mise en ligne sur votre lien dédié. Tests sur vos vrais appareils, ajustements en boucle."
              when="J+8 à J+12"
            />
            <Step
              n="4"
              title="Formation & lancement"
              text="1h ensemble : utilisation, écran cuisine, gestion produits. Premier service avec l'app."
              when="J+13 à J+15"
            />
          </ol>
        </section>

        {/* CTA */}
        <section className="mt-10 overflow-hidden rounded-card bg-cream-100 p-8 text-center sm:p-10">
          <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
            Prêt à lancer A Maï
            <br />
            sur précommande ?
          </h2>
          <p className="mt-3 text-[15px] text-ink-700">
            On valide ensemble, je m'occupe du reste.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="tel:+33000000000"
              className="btn-primary"
            >
              <Phone size={16} />
              On en parle
            </a>
            <Link to="/" className="btn-secondary">
              <ArrowRight size={16} />
              Revoir la démo
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[13px] text-ink-500">
            <span className="inline-flex items-center gap-1">
              <Mail size={14} />
              rabaudremi@gmail.com
            </span>
            <span>·</span>
            <span>Devis valable 30 jours</span>
          </div>
        </section>

        <footer className="mt-10 text-center text-[12px] text-ink-500">
          Document confidentiel · A Maï × Rémi Rabaud · Mai 2026
        </footer>
      </main>
    </div>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-600">
        {icon}
      </div>
      <div className="mt-3 font-display text-xl font-bold">{title}</div>
      <div className="mt-2 text-[14px] leading-relaxed text-ink-700">{text}</div>
    </div>
  );
}

function Feature({
  icon,
  title,
  points,
}: {
  icon: React.ReactNode;
  title: string;
  points: string[];
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-600">
          {icon}
        </div>
        <h3 className="font-display text-xl font-bold">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-[14px] text-ink-700">
            <Check size={16} className="mt-0.5 shrink-0 text-sage-600" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingCard({
  label,
  amount,
  unit,
  details,
  highlight,
}: {
  label: string;
  amount: string;
  unit: string;
  details: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl p-6 ${
        highlight
          ? 'bg-sage-600 text-white shadow-lift'
          : 'bg-white shadow-soft'
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 right-6 rounded-full bg-amber-300 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-900">
          Récurrent
        </div>
      )}
      <div
        className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
          highlight ? 'text-white/80' : 'text-ink-500'
        }`}
      >
        {label}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-5xl font-bold leading-none">
          {amount}
        </span>
      </div>
      <div
        className={`mt-1 text-[13px] ${
          highlight ? 'text-white/80' : 'text-ink-500'
        }`}
      >
        {unit}
      </div>
      <ul className="mt-5 space-y-2">
        {details.map((d) => (
          <li
            key={d}
            className={`flex items-start gap-2 text-[13px] ${
              highlight ? 'text-white/95' : 'text-ink-700'
            }`}
          >
            <Check
              size={14}
              className={`mt-0.5 shrink-0 ${
                highlight ? 'text-white' : 'text-sage-600'
              }`}
            />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ComparisonCard({
  title,
  fee,
  extra,
  tone,
  badge,
}: {
  title: string;
  fee: string;
  extra: string;
  tone: 'primary' | 'muted';
  badge?: string;
}) {
  return (
    <div
      className={`relative rounded-2xl p-5 ${
        tone === 'primary'
          ? 'border-2 border-sage-500 bg-white'
          : 'bg-white shadow-soft'
      }`}
    >
      {badge && (
        <div className="absolute -top-3 left-5 rounded-full bg-sage-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {badge}
        </div>
      )}
      <div className="text-[12px] font-semibold uppercase tracking-wide text-ink-500">
        {title}
      </div>
      <div className="mt-2 font-display text-3xl font-bold">{fee}</div>
      <div className="mt-1 text-[12px] text-ink-500">{extra}</div>
    </div>
  );
}

function SpecBlock({
  title,
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <div>
      <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
      <ul className="mt-2.5 space-y-1.5">
        {points.map((p) => (
          <li
            key={p}
            className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-700"
          >
            <Check size={14} className="mt-0.5 shrink-0 text-sage-600" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step({
  n,
  title,
  text,
  when,
}: {
  n: string;
  title: string;
  text: string;
  when: string;
}) {
  return (
    <li className="flex gap-4 rounded-2xl bg-white p-4 shadow-soft sm:p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-500 font-display text-lg font-bold text-white">
        {n}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-bold">{title}</h3>
          <span className="text-[11px] font-semibold uppercase tracking-wide text-sage-600">
            {when}
          </span>
        </div>
        <p className="mt-1 text-[14px] text-ink-700">{text}</p>
      </div>
    </li>
  );
}
