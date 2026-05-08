import { useNavigate } from 'react-router-dom';
import { Clock, Lock } from 'lucide-react';
import Layout from '../components/Layout';
import { TIME_SLOTS } from '../data/timeSlots';
import { useCart } from '../context/CartContext';
import type { TimeSlot } from '../types';

export default function TimeSlots() {
  const navigate = useNavigate();
  const { selectedSlot, setSelectedSlot } = useCart();

  const handleNext = () => {
    if (selectedSlot) navigate('/paiement');
  };

  return (
    <Layout title="Créneau de retrait" showBack hideCart>
      <div className="card p-5">
        <div className="flex items-center gap-2 text-[13px] text-ink-500">
          <Clock size={16} />
          <span>Aujourd’hui · Délai mini 20 min</span>
        </div>
        <h2 className="mt-2 font-display text-2xl font-semibold">
          Choisissez votre heure de retrait
        </h2>
        <p className="mt-1 text-[14px] text-ink-500">
          Présentez-vous au comptoir à l’heure choisie, votre commande sera prête.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {TIME_SLOTS.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            selected={selectedSlot === slot.time}
            onSelect={() => setSelectedSlot(slot.time)}
          />
        ))}
      </div>

      <Legend />

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-cream-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={handleNext}
            disabled={!selectedSlot}
            className="btn-primary w-full"
          >
            {selectedSlot ? `Continuer · ${selectedSlot}` : 'Sélectionnez un créneau'}
          </button>
        </div>
      </div>
    </Layout>
  );
}

function SlotCard({
  slot,
  selected,
  onSelect,
}: {
  slot: TimeSlot;
  selected: boolean;
  onSelect: () => void;
}) {
  const isFull = slot.status === 'full';
  const styles = selected
    ? 'border-sage-500 bg-sage-50 ring-4 ring-sage-200/60'
    : isFull
    ? 'border-cream-200 bg-cream-100 opacity-60 cursor-not-allowed'
    : slot.status === 'almost-full'
    ? 'border-amber-200 bg-white hover:border-amber-300'
    : 'border-sage-200 bg-white hover:border-sage-300';

  return (
    <button
      onClick={isFull ? undefined : onSelect}
      disabled={isFull}
      className={`flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition active:scale-[0.99] ${styles}`}
    >
      <div className="flex w-full items-center justify-between">
        <span className="font-display text-2xl font-bold">{slot.time}</span>
        {isFull && <Lock size={16} className="text-ink-500" />}
      </div>
      <SlotStatusLabel status={slot.status} />
    </button>
  );
}

function SlotStatusLabel({ status }: { status: TimeSlot['status'] }) {
  const map = {
    available: { label: 'Disponible', cls: 'text-sage-600' },
    'almost-full': { label: 'Presque complet', cls: 'text-amber-700' },
    full: { label: 'Complet', cls: 'text-ink-500' },
  } as const;
  const { label, cls } = map[status];
  return <span className={`text-[12px] font-semibold ${cls}`}>{label}</span>;
}

function Legend() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 text-[12px] text-ink-500">
      <Dot color="bg-sage-500" /> Disponible
      <Dot color="bg-amber-400" /> Presque complet
      <Dot color="bg-ink-300" /> Complet
    </div>
  );
}

function Dot({ color }: { color: string }) {
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color} mr-1`} />;
}
