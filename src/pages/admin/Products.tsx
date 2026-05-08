import { Pencil, Plus } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { CATEGORIES } from '../../types';
import { euro } from '../../utils/format';

export default function Products() {
  const { products, toggleAvailability, updateProduct } = useAdmin();

  const handleEditPrice = (id: string, current: number) => {
    const next = window.prompt('Nouveau prix (en €) :', current.toFixed(2));
    if (next == null) return;
    const parsed = parseFloat(next.replace(',', '.'));
    if (!Number.isNaN(parsed) && parsed > 0) {
      updateProduct(id, { price: parsed });
    }
  };

  return (
    <AdminLayout title="Produits">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-ink-500">
          {products.length} produits · {products.filter((p) => !p.available).length} en rupture
        </p>
        <button
          onClick={() => alert('Ajout de produit non implémenté dans la maquette.')}
          className="btn-primary"
        >
          <Plus size={16} />
          Nouveau produit
        </button>
      </div>

      <div className="mt-5 space-y-6">
        {CATEGORIES.map((cat) => {
          const list = products.filter((p) => p.category === cat.id);
          if (list.length === 0) return null;
          return (
            <section key={cat.id}>
              <h2 className="font-display text-xl font-semibold">{cat.label}</h2>
              <div className="mt-3 overflow-hidden rounded-card bg-white shadow-soft">
                {list.map((p, i) => (
                  <div
                    key={p.id}
                    className={`flex items-center gap-3 p-4 ${
                      i !== 0 ? 'border-t border-cream-200' : ''
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cream-100 text-2xl">
                      {p.image ?? '🥗'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-semibold">{p.name}</span>
                        {!p.available && (
                          <span className="chip bg-rose-100 text-rose-700">Rupture</span>
                        )}
                      </div>
                      <div className="mt-0.5 line-clamp-1 text-[12px] text-ink-500">
                        {p.description}
                      </div>
                    </div>
                    <button
                      onClick={() => handleEditPrice(p.id, p.price)}
                      className="hidden font-display text-[15px] font-bold text-sage-600 hover:text-sage-700 sm:block"
                    >
                      {euro(p.price)}
                    </button>
                    <button
                      onClick={() => handleEditPrice(p.id, p.price)}
                      aria-label="Modifier"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 text-ink-700 hover:bg-sage-50"
                    >
                      <Pencil size={14} />
                    </button>
                    <Switch
                      checked={p.available}
                      onChange={() => toggleAvailability(p.id)}
                      label={p.available ? 'Disponible' : 'Rupture'}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AdminLayout>
  );
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`relative h-7 w-12 shrink-0 rounded-full border transition ${
        checked
          ? 'border-sage-500 bg-sage-500'
          : 'border-cream-300 bg-cream-100'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </button>
  );
}
