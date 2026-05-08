import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import { CATEGORIES } from '../types';
import type { Category, Product } from '../types';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { euro } from '../utils/format';

export default function Catalog() {
  const { products } = useAdmin();
  const { itemCount, total } = useCart();
  const [activeCat, setActiveCat] = useState<Category>('salades-signatures');
  const [selected, setSelected] = useState<Product | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const grouped = useMemo(() => {
    const map = new Map<Category, Product[]>();
    CATEGORIES.forEach((c) => map.set(c.id, []));
    products.forEach((p) => map.get(p.category)?.push(p));
    return map;
  }, [products]);

  const handleSelect = (cat: Category) => {
    setActiveCat(cat);
    sectionRefs.current[cat]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const handleProductClick = (p: Product) => {
    if (p.customizable) {
      setSelected(p);
    } else {
      // Add directly without options
      setSelected(p);
    }
  };

  return (
    <Layout title="La carte">
      {/* Sticky category nav */}
      <div className="-mx-4 sticky top-16 z-20 bg-cream-50/95 px-4 py-2 backdrop-blur">
        <div className="scroll-hide -mx-1 flex gap-2 overflow-x-auto px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                activeCat === cat.id
                  ? 'bg-sage-600 text-white shadow-soft'
                  : 'bg-white text-ink-700 border border-sage-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 space-y-8">
        {CATEGORIES.map((cat) => {
          const list = grouped.get(cat.id) ?? [];
          if (list.length === 0) return null;
          return (
            <section
              key={cat.id}
              ref={(el) => {
                sectionRefs.current[cat.id] = el;
              }}
              className="scroll-mt-32"
            >
              <h2 className="font-display text-2xl font-semibold">{cat.label}</h2>
              <p className="mt-1 text-[13px] text-ink-500">
                {list.length} produit{list.length > 1 ? 's' : ''} disponible
                {list.length > 1 ? 's' : ''}
              </p>
              <div className="mt-3 space-y-3">
                {list.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onClick={() => handleProductClick(p)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}

      {itemCount > 0 && !selected && (
        <Link
          to="/panier"
          className="fixed inset-x-4 bottom-4 z-30 mx-auto flex max-w-xl items-center justify-between rounded-full bg-sage-600 px-5 py-4 text-white shadow-lift"
        >
          <span className="flex items-center gap-2">
            <ShoppingBag size={18} />
            <span className="text-[14px] font-semibold">
              Voir le panier · {itemCount} article{itemCount > 1 ? 's' : ''}
            </span>
          </span>
          <span className="font-display text-[16px] font-bold">{euro(total)}</span>
        </Link>
      )}
    </Layout>
  );
}
