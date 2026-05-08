import { useEffect, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import type { Product } from '../types';
import { SAUCES, REMOVABLE_INGREDIENTS, SUPPLEMENTS } from '../data/products';
import Badge from './Badge';
import { useCart } from '../context/CartContext';
import { euro } from '../utils/format';

interface Props {
  product: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [sauce, setSauce] = useState<string | undefined>(
    product.customizable ? SAUCES[0].name : undefined
  );
  const [removed, setRemoved] = useState<string[]>([]);
  const [supplements, setSupplements] = useState<string[]>([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const supTotal = supplements.reduce((sum, id) => {
    const sup = SUPPLEMENTS.find((s) => s.id === id);
    return sum + (sup?.price ?? 0);
  }, 0);
  const linePrice = (product.price + supTotal) * quantity;

  const toggle = (arr: string[], setArr: (a: string[]) => void, val: string) =>
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity,
      sauce,
      removedIngredients: removed,
      supplements: supplements
        .map((id) => SUPPLEMENTS.find((s) => s.id === id))
        .filter((s): s is typeof SUPPLEMENTS[number] => Boolean(s))
        .map((s) => ({ id: s.id, name: s.name, price: s.price })),
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <div
        className="absolute inset-0 bg-ink-900/40 animate-fade-in"
        onClick={onClose}
      />
      <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-card bg-white pb-32 shadow-lift sm:rounded-card animate-fade-up">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-soft hover:bg-sage-50"
        >
          <X size={18} />
        </button>

        <div className="flex h-52 items-center justify-center bg-gradient-to-br from-sage-100 via-cream-100 to-sage-200 text-7xl">
          {product.image ?? '🥗'}
        </div>

        <div className="px-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-2xl font-semibold leading-tight">
              {product.name}
            </h2>
            {product.badge && <Badge kind={product.badge} />}
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
            {product.description}
          </p>
          <p className="mt-3 font-display text-2xl font-bold text-sage-600">
            {euro(product.price)}
          </p>

          {product.customizable && (
            <>
              <Section title="Sauce" subtitle="Choisissez une sauce">
                <div className="grid grid-cols-2 gap-2">
                  {SAUCES.map((s) => (
                    <Choice
                      key={s.id}
                      label={s.name}
                      selected={sauce === s.name}
                      onSelect={() => setSauce(s.name)}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Sans" subtitle="Retirer un ingrédient">
                <div className="flex flex-wrap gap-2">
                  {REMOVABLE_INGREDIENTS.map((ing) => (
                    <Toggle
                      key={ing}
                      label={ing}
                      selected={removed.includes(ing)}
                      onToggle={() => toggle(removed, setRemoved, ing)}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Suppléments" subtitle="Personnalisez votre salade">
                <div className="space-y-2">
                  {SUPPLEMENTS.map((s) => {
                    const selected = supplements.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggle(supplements, setSupplements, s.id)}
                        className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                          selected
                            ? 'border-sage-500 bg-sage-50'
                            : 'border-sage-200 bg-white hover:border-sage-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                              selected
                                ? 'border-sage-500 bg-sage-500 text-white'
                                : 'border-sage-300'
                            }`}
                          >
                            {selected && <Plus size={14} className="rotate-45" />}
                          </span>
                          <span className="text-[15px] font-medium">{s.name}</span>
                        </div>
                        <span className="text-[14px] font-semibold text-sage-600">
                          + {euro(s.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Section>
            </>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-cream-200 bg-white/95 px-4 py-3 backdrop-blur sm:absolute sm:rounded-b-card">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-sage-200 bg-white p-1">
              <button
                aria-label="Retirer"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-ink-700 hover:bg-sage-50"
              >
                <Minus size={16} />
              </button>
              <span className="w-6 text-center font-semibold">{quantity}</span>
              <button
                aria-label="Ajouter"
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-500 text-white hover:bg-sage-600"
              >
                <Plus size={16} />
              </button>
            </div>
            <button onClick={handleAdd} className="btn-primary flex-1">
              Ajouter · {euro(linePrice)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h3 className="font-display text-[18px] font-semibold">{title}</h3>
      {subtitle && (
        <p className="mt-0.5 text-[13px] text-ink-500">{subtitle}</p>
      )}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Choice({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`rounded-2xl border px-4 py-3 text-[14px] font-medium transition ${
        selected
          ? 'border-sage-500 bg-sage-50 text-sage-700'
          : 'border-sage-200 bg-white text-ink-700 hover:border-sage-300'
      }`}
    >
      {label}
    </button>
  );
}

function Toggle({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition ${
        selected
          ? 'border-rose-300 bg-rose-50 text-rose-700 line-through'
          : 'border-sage-200 bg-white text-ink-700 hover:border-sage-300'
      }`}
    >
      {label}
    </button>
  );
}
