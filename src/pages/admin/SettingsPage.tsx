import { Save } from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { useState } from 'react';

export default function SettingsPage() {
  const { settings, updateSettings, ordersOpen, toggleOrders } = useAdmin();
  const [draft, setDraft] = useState(settings);
  const [saved, setSaved] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(settings);

  const handleSave = () => {
    updateSettings(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AdminLayout title="Paramètres">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-display text-xl font-semibold">Restaurant</h2>
          <p className="mt-1 text-[13px] text-ink-500">
            Informations générales utilisées dans l’app cliente.
          </p>

          <div className="mt-4 space-y-4">
            <Field
              label="Horaires d’ouverture"
              value={draft.openingHours}
              onChange={(v) => setDraft({ ...draft, openingHours: v })}
            />
            <Field
              label="Délai minimum de préparation (minutes)"
              type="number"
              value={String(draft.minPrepTime)}
              onChange={(v) =>
                setDraft({ ...draft, minPrepTime: Number(v) || 0 })
              }
            />
            <Field
              label="Nombre maximum de commandes par créneau"
              type="number"
              value={String(draft.maxPerSlot)}
              onChange={(v) =>
                setDraft({ ...draft, maxPerSlot: Number(v) || 0 })
              }
            />
            <Textarea
              label="Message si commandes fermées"
              value={draft.closedMessage}
              onChange={(v) => setDraft({ ...draft, closedMessage: v })}
            />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!dirty}
              className="btn-primary"
            >
              <Save size={14} />
              Enregistrer
            </button>
            {saved && (
              <span className="text-[12px] font-semibold text-sage-700">
                Modifications enregistrées
              </span>
            )}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-display text-xl font-semibold">Commandes</h2>
          <p className="mt-1 text-[13px] text-ink-500">
            Mettre temporairement en pause si vous êtes débordé.
          </p>
          <div className="mt-4 flex items-center justify-between rounded-2xl border border-cream-200 bg-cream-50 p-4">
            <div>
              <div className="text-[14px] font-semibold">
                Statut : {ordersOpen ? 'Ouvertes' : 'En pause'}
              </div>
              <div className="text-[12px] text-ink-500">
                {ordersOpen
                  ? 'Les clients peuvent commander librement.'
                  : 'Les clients voient un message les invitant à patienter.'}
              </div>
            </div>
            <button
              onClick={toggleOrders}
              className={ordersOpen ? 'btn-secondary' : 'btn-primary'}
            >
              {ordersOpen ? 'Mettre en pause' : 'Reprendre'}
            </button>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
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
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-ink-500">
        {label}
      </span>
      <textarea
        className="input min-h-[100px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
