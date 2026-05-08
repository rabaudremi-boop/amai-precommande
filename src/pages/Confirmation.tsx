import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin } from 'lucide-react';
import Logo from '../components/Logo';
import type { Order } from '../types';
import { euro } from '../utils/format';

export default function Confirmation() {
  const location = useLocation();
  const order = (location.state as { order?: Order } | null)?.order;

  if (!order) return <Navigate to="/" replace />;

  const firstName = order.customerName.split(' ')[0];

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="px-4 pt-6">
        <div className="mx-auto max-w-2xl">
          <Logo showTagline />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-6">
        <div className="card relative overflow-hidden p-6">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-sage-100" />
          <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-cream-100" />
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-500 text-white">
              <CheckCircle2 size={28} />
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight">
              Merci {firstName} !
            </h1>
            <p className="mt-1 text-[15px] text-ink-500">
              Votre commande est confirmée.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="chip bg-sage-100 text-sage-700">
                Commande {order.number}
              </span>
              <span className="chip bg-amber-100 text-amber-800">Payée</span>
            </div>
          </div>
        </div>

        <section className="mt-4 card p-5">
          <h2 className="font-display text-lg font-semibold">Retrait</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Tile
              icon={<Clock size={16} />}
              label="Heure"
              value={order.slot}
            />
            <Tile
              icon={<MapPin size={16} />}
              label="Lieu"
              value="Au comptoir"
            />
          </div>
          <p className="mt-3 rounded-2xl bg-sage-50 p-3 text-[13px] text-sage-700">
            Présentez-vous au comptoir à l’heure choisie. Donnez votre numéro
            de commande, c’est prêt.
          </p>
        </section>

        <section className="mt-4 card p-5">
          <h2 className="font-display text-lg font-semibold">Détail de la commande</h2>
          <div className="mt-3 space-y-3">
            {order.items.map((item) => {
              const supTotal = item.supplements.reduce((s, sup) => s + sup.price, 0);
              const linePrice = (item.unitPrice + supTotal) * item.quantity;
              return (
                <div
                  key={item.lineId}
                  className="flex items-start justify-between gap-3 border-b border-cream-200 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold">
                      {item.quantity} × {item.name}
                    </div>
                    {(item.sauce ||
                      item.removedIngredients.length > 0 ||
                      item.supplements.length > 0) && (
                      <ul className="mt-1 space-y-0.5 text-[12px] text-ink-500">
                        {item.sauce && <li>Sauce : {item.sauce}</li>}
                        {item.removedIngredients.length > 0 && (
                          <li>Sans : {item.removedIngredients.join(', ')}</li>
                        )}
                        {item.supplements.length > 0 && (
                          <li>
                            Supp. : {item.supplements.map((s) => s.name).join(', ')}
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  <span className="shrink-0 font-semibold text-sage-600">
                    {euro(linePrice)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-cream-100 p-3">
            <span className="text-[13px] font-semibold uppercase tracking-wide text-ink-500">
              Montant payé
            </span>
            <span className="font-display text-xl font-bold">{euro(order.total)}</span>
          </div>
        </section>

        <Link to="/" className="btn-primary mt-6 w-full">
          Retour à l’accueil
        </Link>
      </main>
    </div>
  );
}

function Tile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-cream-200 bg-cream-50 p-3">
      <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-ink-500">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-display text-xl font-bold">{value}</div>
    </div>
  );
}
