import { Plus } from 'lucide-react';
import type { Product } from '../types';
import Badge from './Badge';
import { euro } from '../utils/format';

interface Props {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: Props) {
  const disabled = !product.available;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-center gap-4 rounded-card bg-white p-3 text-left shadow-soft transition active:scale-[0.99] disabled:opacity-60 disabled:active:scale-100"
    >
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-cream-100 text-3xl">
        {product.image ?? '🥗'}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-display text-[17px] font-semibold leading-tight">
            {product.name}
          </h3>
          {product.badge && <Badge kind={product.badge} />}
        </div>
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-500">
          {product.description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-display text-[17px] font-semibold text-sage-600">
            {euro(product.price)}
          </span>
          {disabled ? (
            <span className="chip bg-ink-300/30 text-ink-700">Rupture</span>
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-500 text-white shadow-soft transition group-hover:bg-sage-600">
              <Plus size={18} />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
