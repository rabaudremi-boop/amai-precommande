import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, Clock } from 'lucide-react';
import AdminLayout from './AdminLayout';
import StatusBadge from '../../components/StatusBadge';
import { useAdmin } from '../../context/AdminContext';
import { ORDER_STATUS_LABELS, type OrderStatus } from '../../types';
import { euro } from '../../utils/format';

const NEXT_STATUS: OrderStatus[] = [
  'nouvelle',
  'en-preparation',
  'prete',
  'recuperee',
];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useAdmin();
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <AdminLayout title="Commande introuvable">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          <ChevronLeft size={14} /> Retour
        </button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Commande ${order.number}`}>
      <button
        onClick={() => navigate('/admin/commandes')}
        className="btn-ghost -ml-2 mb-2"
      >
        <ChevronLeft size={14} /> Retour aux commandes
      </button>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-ink-500">
                Client
              </div>
              <h2 className="font-display text-2xl font-bold">{order.customerName}</h2>
              <div className="mt-2 flex flex-wrap gap-3 text-[13px] text-ink-700">
                <span className="inline-flex items-center gap-1">
                  <Phone size={14} className="text-ink-500" />
                  {order.customerPhone}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Mail size={14} className="text-ink-500" />
                  {order.customerEmail}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={14} className="text-ink-500" />
                  Retrait à {order.slot}
                </span>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div className="mt-5 space-y-3">
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
                    <ul className="mt-1 space-y-0.5 text-[12px] text-ink-500">
                      {item.sauce && <li>Sauce : {item.sauce}</li>}
                      {item.removedIngredients.length > 0 && (
                        <li>Sans : {item.removedIngredients.join(', ')}</li>
                      )}
                      {item.supplements.length > 0 && (
                        <li>
                          Suppl. : {item.supplements.map((s) => s.name).join(', ')}
                        </li>
                      )}
                    </ul>
                  </div>
                  <span className="shrink-0 font-semibold text-sage-600">
                    {euro(linePrice)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-2xl bg-cream-100 p-3">
            <span className="text-[13px] font-semibold uppercase tracking-wide text-ink-500">
              Total
            </span>
            <span className="font-display text-2xl font-bold">{euro(order.total)}</span>
          </div>
        </section>

        <section className="card p-5">
          <h3 className="font-display text-lg font-semibold">Statut de la commande</h3>
          <p className="mt-1 text-[13px] text-ink-500">
            Mettez à jour la progression au fur et à mesure.
          </p>
          <div className="mt-4 space-y-2">
            {NEXT_STATUS.map((s, i) => {
              const active = order.status === s;
              const done = NEXT_STATUS.indexOf(order.status) > i;
              return (
                <button
                  key={s}
                  onClick={() => updateOrderStatus(order.id, s)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-3 text-left transition ${
                    active
                      ? 'border-sage-500 bg-sage-50'
                      : done
                      ? 'border-sage-200 bg-white'
                      : 'border-cream-200 bg-white hover:border-sage-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
                        active
                          ? 'bg-sage-500 text-white'
                          : done
                          ? 'bg-sage-100 text-sage-700'
                          : 'bg-cream-100 text-ink-500'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-[14px] font-medium">
                      {ORDER_STATUS_LABELS[s]}
                    </span>
                  </div>
                  {active && (
                    <span className="text-[12px] font-semibold text-sage-700">
                      En cours
                    </span>
                  )}
                </button>
              );
            })}
            <button
              onClick={() => updateOrderStatus(order.id, 'annulee')}
              className="w-full rounded-2xl border border-rose-200 bg-white p-3 text-left text-[14px] font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              Annuler la commande
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
