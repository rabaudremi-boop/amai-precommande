import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  Pause,
  Play,
  Receipt,
  TrendingUp,
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { TIME_SLOTS } from '../../data/timeSlots';
import { euro } from '../../utils/format';
import StatusBadge from '../../components/StatusBadge';

export default function Dashboard() {
  const { orders, ordersOpen, toggleOrders } = useAdmin();

  const ordersToday = orders.length;
  const revenue = orders
    .filter((o) => o.status !== 'annulee')
    .reduce((sum, o) => sum + o.total, 0);
  const avg = ordersToday ? revenue / ordersToday : 0;
  const nextSlot = TIME_SLOTS.find((s) => s.status !== 'full')?.time ?? '—';

  const recent = orders.slice(0, 4);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={<Receipt size={16} />}
          label="Commandes du jour"
          value={String(ordersToday)}
          accent="sage"
        />
        <Stat
          icon={<TrendingUp size={16} />}
          label="CA du jour"
          value={euro(revenue)}
          accent="amber"
        />
        <Stat
          icon={<TrendingUp size={16} />}
          label="Panier moyen"
          value={euro(avg)}
          accent="sage"
        />
        <Stat
          icon={<Clock size={16} />}
          label="Prochain créneau"
          value={nextSlot}
          accent="cream"
        />
      </div>

      <div className="mt-5 card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                ordersOpen ? 'bg-sage-100 text-sage-700' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {ordersOpen ? <Play size={14} /> : <Pause size={14} />}
            </span>
            <h2 className="font-display text-xl font-semibold">
              Commandes {ordersOpen ? 'ouvertes' : 'en pause'}
            </h2>
          </div>
          <p className="mt-1 text-[13px] text-ink-500">
            {ordersOpen
              ? 'Les clients peuvent passer commande pour les créneaux disponibles.'
              : 'Les nouvelles commandes sont temporairement bloquées.'}
          </p>
        </div>
        <button
          onClick={toggleOrders}
          className={ordersOpen ? 'btn-secondary' : 'btn-primary'}
        >
          {ordersOpen ? 'Mettre en pause' : 'Reprendre les commandes'}
        </button>
      </div>

      <div className="mt-5 card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Dernières commandes</h2>
          <Link
            to="/admin/commandes"
            className="flex items-center gap-1 text-[13px] font-semibold text-sage-600 hover:text-sage-700"
          >
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-3 divide-y divide-cream-200">
          {recent.map((o) => (
            <Link
              key={o.id}
              to={`/admin/commandes/${o.id}`}
              className="flex items-center justify-between gap-3 py-3 hover:bg-cream-50/60"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-display text-[15px] font-bold">{o.number}</span>
                  <span className="text-[12px] text-ink-500">·</span>
                  <span className="truncate text-[13px] text-ink-700">{o.customerName}</span>
                </div>
                <div className="mt-0.5 text-[12px] text-ink-500">
                  Retrait à {o.slot} · {o.items.length} article{o.items.length > 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-display text-[14px] font-semibold">
                  {euro(o.total)}
                </span>
                <StatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: 'sage' | 'amber' | 'cream';
}) {
  const accentMap = {
    sage: 'bg-sage-100 text-sage-700',
    amber: 'bg-amber-100 text-amber-800',
    cream: 'bg-cream-100 text-ink-700',
  } as const;
  return (
    <div className="card p-4">
      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${accentMap[accent]}`}>
        {icon}
      </div>
      <div className="mt-3 text-[12px] font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </div>
      <div className="mt-1 font-display text-2xl font-bold">{value}</div>
    </div>
  );
}
