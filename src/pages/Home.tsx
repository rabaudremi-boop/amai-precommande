import { Link } from 'react-router-dom';
import { Clock, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import Logo from '../components/Logo';
import InstallButton from '../components/InstallButton';
import { useAdmin } from '../context/AdminContext';
import { todayLabel } from '../utils/format';

export default function Home() {
  const { ordersOpen, settings } = useAdmin();

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="px-4 pt-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <Logo showTagline />
          <div className="flex items-center gap-3">
            <InstallButton />
            <Link
              to="/admin/login"
              className="text-[12px] font-medium text-ink-500 hover:text-sage-600"
            >
              Espace pro
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-20 pt-6">
        <section className="overflow-hidden rounded-card bg-gradient-to-br from-sage-200 via-sage-100 to-cream-100 p-6 shadow-soft">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-700">
            <Sparkles size={14} />
            <span>{todayLabel()}</span>
          </div>
          <h1 className="mt-3 font-display text-[34px] font-bold leading-[1.05] text-ink-900">
            Précommandez votre salade,
            <br />
            <span className="text-sage-600">choisissez votre créneau</span>
            <br />
            et récupérez sans attendre.
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-700">
            Salades fraîches, poke bowls maison & desserts gourmands — préparés
            à la commande pour vos pauses déj.
          </p>

          <Link
            to="/carte"
            className="btn-primary mt-6 w-full sm:w-auto"
          >
            Commander maintenant
          </Link>

          {!ordersOpen && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[13px] text-amber-800">
              <strong className="block font-semibold">Commandes en pause</strong>
              {settings.closedMessage}
            </div>
          )}
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <InfoCard
            icon={<Clock size={18} />}
            title="Horaires du jour"
            text={settings.openingHours}
          />
          <InfoCard
            icon={<ShieldCheck size={18} />}
            title="Délai de prépa"
            text={`${settings.minPrepTime} min minimum`}
          />
          <InfoCard
            icon={<MapPin size={18} />}
            title="Retrait"
            text="Uniquement au restaurant"
          />
        </section>

        <section className="mt-6 card p-5">
          <h2 className="font-display text-lg font-semibold">Comment ça marche ?</h2>
          <ol className="mt-3 space-y-3">
            {[
              'Composez votre commande en quelques clics.',
              'Choisissez votre créneau de retrait.',
              'Réglez en ligne — paiement sécurisé.',
              'Présentez-vous au comptoir, c’est prêt.',
            ].map((step, i) => (
              <li key={i} className="flex gap-3 text-[14px] text-ink-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-[12px] font-bold text-sage-700">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-100 text-sage-600">
        {icon}
      </div>
      <div className="mt-3 text-[13px] font-semibold uppercase tracking-wide text-ink-500">
        {title}
      </div>
      <div className="mt-1 text-[14px] font-medium text-ink-900">{text}</div>
    </div>
  );
}
