import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ShieldCheck } from 'lucide-react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { euro, uid } from '../utils/format';
import type { Order } from '../types';

export default function Payment() {
  const navigate = useNavigate();
  const { items, total, checkout, setCheckout, selectedSlot, clear } = useCart();
  const { addOrder } = useAdmin();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (items.length === 0) navigate('/carte', { replace: true });
    else if (!selectedSlot) navigate('/creneaux', { replace: true });
  }, [items.length, selectedSlot, navigate]);

  const canPay =
    checkout.customerName.trim() &&
    checkout.customerPhone.trim() &&
    checkout.customerEmail.trim();

  const handlePay = () => {
    if (!canPay) return;
    setProcessing(true);

    setTimeout(() => {
      const orderNumber = `#${1100 + Math.floor(Math.random() * 800)}`;
      const order: Order = {
        id: uid(),
        number: orderNumber,
        customerName: checkout.customerName,
        customerPhone: checkout.customerPhone,
        customerEmail: checkout.customerEmail,
        slot: selectedSlot ?? '',
        items,
        total,
        status: 'nouvelle',
        paid: true,
        createdAt: new Date().toISOString(),
      };
      addOrder(order);
      // We need to navigate before clearing cart so confirmation can read the order
      navigate('/confirmation', { state: { order }, replace: true });
      // Defer clear so React Router has finished navigating
      setTimeout(() => clear(), 50);
    }, 1100);
  };

  return (
    <Layout title="Paiement" showBack hideCart>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
        <Lock className="mr-1 inline" size={12} /> Maquette · Aucun paiement
        réel ne sera effectué.
      </div>

      <section className="mt-4 card p-5">
        <h2 className="font-display text-lg font-semibold">Vos coordonnées</h2>
        <div className="mt-3 space-y-3">
          <Field
            label="Nom complet"
            placeholder="Ex. Camille Martin"
            value={checkout.customerName}
            onChange={(v) => setCheckout({ customerName: v })}
          />
          <Field
            label="Téléphone"
            placeholder="06 12 34 56 78"
            value={checkout.customerPhone}
            onChange={(v) => setCheckout({ customerPhone: v })}
            type="tel"
          />
          <Field
            label="Email"
            placeholder="vous@email.fr"
            value={checkout.customerEmail}
            onChange={(v) => setCheckout({ customerEmail: v })}
            type="email"
          />
        </div>
      </section>

      <section className="mt-4 card p-5">
        <h2 className="font-display text-lg font-semibold">Récapitulatif</h2>
        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <div
              key={item.lineId}
              className="flex items-center justify-between text-[14px]"
            >
              <span className="truncate pr-2">
                {item.quantity} × {item.name}
              </span>
              <span className="shrink-0 font-semibold">
                {euro(
                  (item.unitPrice +
                    item.supplements.reduce((s, sup) => s + sup.price, 0)) *
                    item.quantity
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="my-3 border-t border-cream-200" />
        <div className="flex items-center justify-between text-[14px] text-ink-500">
          <span>Créneau</span>
          <span className="font-semibold text-ink-900">{selectedSlot}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-display text-lg font-semibold">À payer</span>
          <span className="font-display text-2xl font-bold text-sage-600">
            {euro(total)}
          </span>
        </div>
      </section>

      <section className="mt-4 card p-5">
        <h2 className="font-display text-lg font-semibold">Mode de paiement</h2>
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-sage-300 bg-sage-50 p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sage-600">
            <CreditCard size={18} />
          </span>
          <div>
            <div className="text-[14px] font-semibold">Carte bancaire (simulé)</div>
            <div className="text-[12px] text-ink-500">
              Pas de Stripe branché — démo uniquement.
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[12px] text-ink-500">
          <ShieldCheck size={14} className="text-sage-600" />
          Paiement sécurisé en production · 3D Secure prévu
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-cream-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={handlePay}
            disabled={!canPay || processing}
            className="btn-primary w-full"
          >
            {processing ? 'Paiement en cours…' : `Payer maintenant · ${euro(total)}`}
          </button>
        </div>
      </div>
    </Layout>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </span>
      <input
        type={type}
        className="input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
