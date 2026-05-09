import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import type { Order, OrderStatus, Product } from '../types';
import { MOCK_ORDERS } from '../data/orders';
import { PRODUCTS } from '../data/products';
import { useOrderEvents } from '../utils/orderBroadcast';
import {
  playDing,
  sendNotification,
  vibrate,
} from '../utils/notifications';
import { firebaseEnabled } from '../firebase';
import { subscribeToOrders, pushStatus } from '../utils/orderSync';

interface RestaurantSettings {
  openingHours: string;
  minPrepTime: number;
  maxPerSlot: number;
  closedMessage: string;
}

interface AdminContextValue {
  isLoggedIn: boolean;
  login: (email: string, pwd: string) => boolean;
  logout: () => void;

  ordersOpen: boolean;
  toggleOrders: () => void;

  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  addOrder: (order: Order) => void;
  /** Most-recent live order received via broadcast — for animations. */
  lastLiveOrderId: string | null;

  products: Product[];
  toggleAvailability: (id: string) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;

  settings: RestaurantSettings;
  updateSettings: (patch: Partial<RestaurantSettings>) => void;

  /** True when Firebase Firestore is wired in (cross-device live sync). */
  liveSyncEnabled: boolean;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(true);
  // Live orders coming from Firestore (when enabled)
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  // Mock orders + status updates the user makes on them locally
  const [mockOrders, setMockOrders] = useState<Order[]>(MOCK_ORDERS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [lastLiveOrderId, setLastLiveOrderId] = useState<string | null>(null);
  const [settings, setSettings] = useState<RestaurantSettings>({
    openingHours: '11h30 – 14h30 · Lundi au vendredi',
    minPrepTime: 20,
    maxPerSlot: 6,
    closedMessage:
      'Les commandes sont temporairement en pause. Revenez d’ici quelques minutes.',
  });

  // Computed: live orders prepended (most recent), then mocks. De-dupe by id.
  const orders: Order[] = (() => {
    const seen = new Set<string>();
    const out: Order[] = [];
    for (const o of liveOrders) {
      if (!seen.has(o.id)) {
        seen.add(o.id);
        out.push(o);
      }
    }
    for (const o of mockOrders) {
      if (!seen.has(o.id)) {
        seen.add(o.id);
        out.push(o);
      }
    }
    return out;
  })();

  // ---------- Refs to read latest values inside callbacks ----------
  const loggedInRef = useRef(isLoggedIn);
  useEffect(() => {
    loggedInRef.current = isLoggedIn;
  }, [isLoggedIn]);

  // ---------- Firestore live subscription ----------
  useEffect(() => {
    if (!firebaseEnabled) return;
    const unsub = subscribeToOrders(
      // onChange — replace whole live list each snapshot
      (list) => setLiveOrders(list),
      // onNew — fire ding/notification only for fresh orders (not initial backlog)
      (order, isFresh) => {
        if (!isFresh) return;
        if (loggedInRef.current) {
          setLastLiveOrderId(order.id);
          playDing();
          vibrate();
          sendNotification(
            `Nouvelle commande ${order.number}`,
            `${order.customerName} · Retrait à ${order.slot} · ${order.total.toFixed(2)} €`,
            order.id
          );
          setTimeout(() => {
            setLastLiveOrderId((cur) => (cur === order.id ? null : cur));
          }, 6000);
        }
      }
    );
    return unsub;
  }, []);

  // ---------- BroadcastChannel fallback (same-device cross-tab) ----------
  // Still useful when Firebase is off, AND as a redundancy when on.
  const handleEvent = useCallback((ev: unknown) => {
    const e = ev as
      | { type: 'new-order'; order: Order }
      | { type: 'status-change'; orderId: string; status: OrderStatus };
    if (e.type === 'new-order') {
      // If Firebase is on, the snapshot will deliver this anyway — skip.
      if (firebaseEnabled) return;
      setMockOrders((prev) => {
        if (prev.some((o) => o.id === e.order.id)) return prev;
        return [e.order, ...prev];
      });
      if (loggedInRef.current) {
        setLastLiveOrderId(e.order.id);
        playDing();
        vibrate();
        sendNotification(
          `Nouvelle commande ${e.order.number}`,
          `${e.order.customerName} · Retrait à ${e.order.slot} · ${e.order.total.toFixed(2)} €`,
          e.order.id
        );
        setTimeout(() => {
          setLastLiveOrderId((cur) => (cur === e.order.id ? null : cur));
        }, 6000);
      }
    } else if (e.type === 'status-change') {
      setMockOrders((prev) =>
        prev.map((o) => (o.id === e.orderId ? { ...o, status: e.status } : o))
      );
    }
  }, []);
  useOrderEvents(handleEvent);

  const login = (_email: string, _pwd: string) => {
    setIsLoggedIn(true);
    return true;
  };
  const logout = () => setIsLoggedIn(false);

  const toggleOrders = () => setOrdersOpen((v) => !v);

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    // Update locally on whichever slice contains the order
    setMockOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    setLiveOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    // If it's a Firestore-backed order, push the change to the cloud too
    if (firebaseEnabled) {
      const live = liveOrders.find((o) => o.id === id);
      const firestoreId = (live as Order & { firestoreId?: string } | undefined)
        ?.firestoreId;
      if (firestoreId) pushStatus(firestoreId, status).catch(() => {});
    }
  };

  const addOrder = (order: Order) =>
    setMockOrders((prev) => [order, ...prev]);

  const toggleAvailability = (id: string) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    );

  const updateProduct = (id: string, patch: Partial<Product>) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );

  const updateSettings = (patch: Partial<RestaurantSettings>) =>
    setSettings((prev) => ({ ...prev, ...patch }));

  return (
    <AdminContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        ordersOpen,
        toggleOrders,
        orders,
        updateOrderStatus,
        addOrder,
        lastLiveOrderId,
        products,
        toggleAvailability,
        updateProduct,
        settings,
        updateSettings,
        liveSyncEnabled: firebaseEnabled,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be inside AdminProvider');
  return ctx;
}
