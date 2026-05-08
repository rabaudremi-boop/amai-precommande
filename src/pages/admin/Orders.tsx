import { Link } from 'react-router-dom';
import { Download, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import AdminLayout from './AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import { useAdmin } from '../../context/AdminContext';
import { ORDER_STATUS_LABELS, type OrderStatus } from '../../types';
import { euro } from '../../utils/format';

const STATUS_FILTERS: ('all' | OrderStatus)[] = [
  'all',
  'nouvelle',
  'en-preparation',
  'prete',
  'recuperee',
  'annulee',
];

export default function Orders() {
  const { orders, lastLiveOrderId } = useAdmin();
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof orders>();
    filtered.forEach((o) => {
      if (!map.has(o.slot)) map.set(o.slot, []);
      map.get(o.slot)!.push(o);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <AdminLayout title="Commandes">
      <div className="flex flex-wrap items-center gap-2">
        <div className="scroll-hide -mx-1 flex flex-1 gap-2 overflow-x-auto px-1">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-[12px] font-semibold transition ${
                filter === s
                  ? 'bg-sage-600 text-white shadow-soft'
                  : 'bg-white border border-sage-200 text-ink-700'
              }`}
            >
              {s === 'all' ? 'Toutes' : ORDER_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
        <button
          onClick={() => alert('Export simulé — un CSV serait généré ici.')}
          className="btn-secondary"
        >
          <Download size={14} />
          Exporter
        </button>
      </div>

      <div className="mt-5 space-y-6">
        {grouped.length === 0 && (
          <div className="card p-10 text-center text-[14px] text-ink-500">
            Aucune commande pour ce filtre.
          </div>
        )}
        {grouped.map(([slot, list]) => (
          <section key={slot}>
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl font-semibold">{slot}</h2>
              <span className="text-[12px] font-semibold text-ink-500">
                {list.length} commande{list.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {list.map((o) => {
                const isLive = lastLiveOrderId === o.id;
                return (
                <Link
                  key={o.id}
                  to={`/admin/commandes/${o.id}`}
                  className={`card flex items-center gap-3 p-4 transition hover:shadow-lift ${
                    isLive
                      ? 'ring-4 ring-amber-300/60 bg-amber-50/60 animate-fade-up'
                      : ''
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-[16px] font-bold">{o.number}</span>
                      <span className="text-[12px] text-ink-500">·</span>
                      <span className="truncate text-[14px] font-medium">
                        {o.customerName}
                      </span>
                      {o.paid && (
                        <span className="chip bg-sage-100 text-sage-700">Payée</span>
                      )}
                      {isLive && (
                        <span className="chip bg-amber-200 text-amber-900">Nouvelle ✨</span>
                      )}
                    </div>
                    <div className="mt-1 line-clamp-1 text-[12px] text-ink-500">
                      {o.items.map((i) => `${i.quantity}× ${i.name}`).join(' · ')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-display text-[14px] font-semibold">
                        {euro(o.total)}
                      </div>
                      <div className="mt-0.5">
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-ink-300" />
                  </div>
                </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </AdminLayout>
  );
}
