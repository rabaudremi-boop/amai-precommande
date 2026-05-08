import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChefHat,
  Clock,
  Maximize2,
  Sparkles,
  Volume2,
  VolumeX,
  BellOff,
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from '../../types';
import { euro, uid } from '../../utils/format';
import {
  isAudioUnlocked,
  notificationStatus,
  requestNotificationPermission,
  unlockAudio,
} from '../../utils/notifications';
import { broadcastNewOrder } from '../../utils/orderBroadcast';
import { MOCK_ORDERS } from '../../data/orders';

const ACTIVE_STATUSES: OrderStatus[] = ['nouvelle', 'en-preparation', 'prete'];

export default function Kitchen() {
  const { orders, updateOrderStatus, lastLiveOrderId } = useAdmin();
  const [now, setNow] = useState(new Date());
  const [audioOn, setAudioOn] = useState(isAudioUnlocked());
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | 'unsupported'>(
    notificationStatus()
  );

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setAudioOn(isAudioUnlocked());
      setNotifPerm(notificationStatus());
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const activeOrders = useMemo(
    () => orders.filter((o) => ACTIVE_STATUSES.includes(o.status)),
    [orders]
  );

  const grouped = useMemo(() => {
    const map = new Map<string, Order[]>();
    activeOrders.forEach((o) => {
      if (!map.has(o.slot)) map.set(o.slot, []);
      map.get(o.slot)!.push(o);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [activeOrders]);

  const handleAudio = () => {
    unlockAudio();
    setAudioOn(true);
  };
  const handleNotif = async () => {
    const ok = await requestNotificationPermission();
    setNotifPerm(ok ? 'granted' : notificationStatus());
  };

  const simulate = () => {
    const sample = MOCK_ORDERS[Math.floor(Math.random() * MOCK_ORDERS.length)];
    const slots = ['12h00', '12h15', '12h30', '12h45', '13h00'];
    const names = [
      'Léa Dupont',
      'Marc Bertrand',
      'Inès Petit',
      'Hugo Lambert',
      'Élise Morin',
    ];
    broadcastNewOrder({
      ...sample,
      id: uid(),
      number: `#${1100 + Math.floor(Math.random() * 800)}`,
      customerName: names[Math.floor(Math.random() * names.length)],
      slot: slots[Math.floor(Math.random() * slots.length)],
      status: 'nouvelle',
      createdAt: new Date().toISOString(),
    });
  };

  const goFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <AdminLayout title="Écran cuisine" bare>
      <div className="flex h-screen flex-col">
        {/* Top bar */}
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Retour admin"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-500/20 text-sage-300">
              <ChefHat size={20} />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Écran cuisine
              </div>
              <div className="font-display text-2xl font-bold">A Maï</div>
            </div>
          </div>

          <div className="hidden flex-col items-end leading-none sm:flex">
            <div className="font-display text-4xl font-bold tabular-nums">
              {now.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="mt-1 text-[12px] uppercase tracking-wider text-white/60">
              {activeOrders.length} commande{activeOrders.length > 1 ? 's' : ''} en cours
            </div>
          </div>

          <div className="flex items-center gap-2">
            <KitchenIconButton
              onClick={handleAudio}
              active={audioOn}
              icon={audioOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
              label="Son"
            />
            {notifPerm !== 'unsupported' && (
              <KitchenIconButton
                onClick={handleNotif}
                active={notifPerm === 'granted'}
                icon={notifPerm === 'granted' ? <Bell size={18} /> : <BellOff size={18} />}
                label="Notifs"
              />
            )}
            <KitchenIconButton
              onClick={goFullscreen}
              icon={<Maximize2 size={18} />}
              label="Plein écran"
            />
            <button
              onClick={simulate}
              className="ml-1 inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-[13px] font-bold text-ink-900 transition hover:bg-amber-300"
            >
              <Sparkles size={14} />
              Simuler
            </button>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {grouped.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {grouped.map(([slot, list]) => (
                <section key={slot}>
                  <div className="mb-3 flex items-baseline justify-between">
                    <h2 className="font-display text-3xl font-bold text-white">
                      {slot}
                    </h2>
                    <span className="text-[13px] font-semibold uppercase tracking-wider text-white/60">
                      {list.length} commande{list.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {list.map((o) => (
                      <KitchenCard
                        key={o.id}
                        order={o}
                        live={lastLiveOrderId === o.id}
                        onStatus={(s) => updateOrderStatus(o.id, s)}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function KitchenIconButton({
  onClick,
  icon,
  label,
  active,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
        active
          ? 'bg-sage-500/30 text-sage-200 ring-2 ring-sage-400/50'
          : 'bg-white/10 text-white hover:bg-white/20'
      }`}
    >
      {icon}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-white/40">
        <ChefHat size={36} />
      </div>
      <h2 className="mt-6 font-display text-3xl font-bold">
        Pas de commande en cours
      </h2>
      <p className="mt-2 max-w-sm text-[15px] text-white/60">
        Toutes les commandes sont récupérées. Le prochain ding signale une nouvelle commande.
      </p>
    </div>
  );
}

function KitchenCard({
  order,
  live,
  onStatus,
}: {
  order: Order;
  live: boolean;
  onStatus: (s: OrderStatus) => void;
}) {
  const minutesSince = Math.max(
    0,
    Math.round((Date.now() - new Date(order.createdAt).getTime()) / 60000)
  );

  const tone =
    order.status === 'nouvelle'
      ? 'bg-blue-500/15 text-blue-200 border-blue-400/40'
      : order.status === 'en-preparation'
      ? 'bg-amber-500/15 text-amber-200 border-amber-400/40'
      : 'bg-sage-500/15 text-sage-200 border-sage-400/40';

  return (
    <div
      className={`rounded-3xl border bg-white/5 p-5 backdrop-blur transition ${
        live
          ? 'border-amber-400 bg-amber-300/10 ring-4 ring-amber-300/30 animate-fade-up'
          : 'border-white/10'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-3xl font-bold tabular-nums text-white">
            {order.number}
          </div>
          <div className="mt-0.5 truncate text-[14px] font-medium text-white/80">
            {order.customerName}
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${tone}`}
        >
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <ul className="mt-3 space-y-1.5">
        {order.items.map((item) => (
          <li key={item.lineId} className="text-[14px] text-white/90">
            <span className="font-bold">{item.quantity}×</span>{' '}
            <span>{item.name}</span>
            {item.sauce && (
              <span className="text-white/50"> · sauce {item.sauce}</span>
            )}
            {item.removedIngredients.length > 0 && (
              <div className="ml-5 text-[12px] text-rose-300">
                sans {item.removedIngredients.join(', ')}
              </div>
            )}
            {item.supplements.length > 0 && (
              <div className="ml-5 text-[12px] text-amber-300">
                + {item.supplements.map((s) => s.name).join(', ')}
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between text-[12px] text-white/60">
        <span className="inline-flex items-center gap-1">
          <Clock size={12} />
          il y a {minutesSince} min
        </span>
        <span className="font-display text-[14px] font-bold text-white">
          {euro(order.total)}
        </span>
      </div>

      <div className="mt-4 grid gap-2">
        {order.status === 'nouvelle' && (
          <button
            onClick={() => onStatus('en-preparation')}
            className="w-full rounded-full bg-amber-400 px-4 py-3 text-[14px] font-bold text-ink-900 hover:bg-amber-300"
          >
            <ChefHat size={14} className="mr-1.5 inline" />
            En préparation
          </button>
        )}
        {order.status === 'en-preparation' && (
          <button
            onClick={() => onStatus('prete')}
            className="w-full rounded-full bg-sage-500 px-4 py-3 text-[14px] font-bold text-white hover:bg-sage-400"
          >
            <CheckCircle2 size={14} className="mr-1.5 inline" />
            Prête
          </button>
        )}
        {order.status === 'prete' && (
          <button
            onClick={() => onStatus('recuperee')}
            className="w-full rounded-full bg-white/20 px-4 py-3 text-[14px] font-bold text-white hover:bg-white/30"
          >
            <CheckCircle2 size={14} className="mr-1.5 inline" />
            Récupérée
          </button>
        )}
      </div>
    </div>
  );
}
