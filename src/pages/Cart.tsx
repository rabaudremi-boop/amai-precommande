import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import { euro } from '../utils/format';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, setQuantity, subtotal, serviceFee, total } = useCart();

  if (items.length === 0) {
    return (
      <Layout title="Mon panier" showBack hideCart>
        <div className="card mt-8 px-6 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cream-100 text-3xl">
            🥗
          </div>
          <h2 className="mt-4 font-display text-xl font-semibold">
            Votre panier est vide
          </h2>
          <p className="mt-2 text-[14px] text-ink-500">
            Ajoutez quelques salades fraîches depuis la carte.
          </p>
          <Link to="/carte" className="btn-primary mt-6 inline-flex">
            Voir la carte
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Mon panier" showBack hideCart>
      <div className="space-y-3">
        {items.map((item) => {
          const supTotal = item.supplements.reduce((s, sup) => s + sup.price, 0);
          const linePrice = (item.unitPrice + supTotal) * item.quantity;
          return (
            <div key={item.lineId} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[16px] font-semibold leading-tight">
                    {item.name}
                  </h3>
                  {(item.sauce ||
                    item.removedIngredients.length > 0 ||
                    item.supplements.length > 0) && (
                    <ul className="mt-1.5 space-y-0.5 text-[12px] text-ink-500">
                      {item.sauce && <li>Sauce : {item.sauce}</li>}
                      {item.removedIngredients.length > 0 && (
                        <li>Sans : {item.removedIngredients.join(', ')}</li>
                      )}
                      {item.supplements.length > 0 && (
                        <li>
                          Supp. :{' '}
                          {item.supplements
                            .map((s) => `${s.name} (+${euro(s.price)})`)
                            .join(', ')}
                        </li>
                      )}
                    </ul>
                  )}
                </div>
                <button
                  onClick={() => removeItem(item.lineId)}
                  aria-label="Supprimer"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-100 text-ink-500 hover:bg-rose-100 hover:text-rose-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 rounded-full border border-sage-200 bg-white p-1">
                  <button
                    aria-label="Retirer"
                    onClick={() => setQuantity(item.lineId, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-100 text-ink-700 hover:bg-sage-50"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    aria-label="Ajouter"
                    onClick={() => setQuantity(item.lineId, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-500 text-white hover:bg-sage-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-display text-[16px] font-semibold text-sage-600">
                  {euro(linePrice)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 card p-5">
        <Row label="Sous-total" value={euro(subtotal)} />
        <Row label="Frais de service" value={euro(serviceFee)} muted />
        <div className="my-3 border-t border-cream-200" />
        <Row label="Total" value={euro(total)} bold />
      </div>

      <div className="mt-4 rounded-2xl border border-sage-200 bg-sage-50 p-4 text-[13px] text-sage-700">
        Délai minimum de préparation : 20 minutes. Vous choisirez votre créneau
        à l’étape suivante.
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-cream-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3">
          <div className="text-[13px] text-ink-500">
            <div>Total</div>
            <div className="font-display text-[18px] font-bold text-ink-900">
              {euro(total)}
            </div>
          </div>
          <button
            onClick={() => navigate('/creneaux')}
            className="btn-primary flex-1"
          >
            Choisir un créneau
          </button>
        </div>
      </div>
    </Layout>
  );
}

function Row({
  label,
  value,
  muted,
  bold,
}: {
  label: string;
  value: string;
  muted?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1 text-[14px]">
      <span className={muted ? 'text-ink-500' : 'text-ink-700'}>{label}</span>
      <span
        className={`${bold ? 'font-display text-[18px] font-bold text-ink-900' : 'font-semibold'}`}
      >
        {value}
      </span>
    </div>
  );
}
