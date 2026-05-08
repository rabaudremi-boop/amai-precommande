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
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(true);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [lastLiveOrderId, setLastLiveOrderId] = useState<string | null>(null);
  const [settings, setSettings] = useState<RestaurantSettings>({
    openingHours: '11h30 – 14h30 · Lundi au vendredi',
    minPrepTime: 20,
    maxPerSlot: 6,
    closedMessage:
      'Les commandes sont temporairement en pause. Revenez d’ici quelques minutes.',
  });

  // We need ref-style access to isLoggedIn inside the broadcast handler so the
  // listener callback (memoized once) reads the latest value.
  const loggedInRef = useRef(isLoggedIn);
  useEffect(() => {
    loggedInRef.current = isLoggedIn;
  }, [isLoggedIn]);

  const handleEvent = useCallback(
    (ev: ReturnType<typeof Object> | unknown) => {
      // Type narrowed by useOrderEvents
      const e = ev as
        | { type: 'new-order'; order: Order }
        | { type: 'status-change'; orderId: string; status: OrderStatus };
      if (e.type === 'new-order') {
        setOrders((prev) => {
          if (prev.some((o) => o.id === e.order.id)) return prev;
          return [e.order, ...prev];
        });
        // Side effects only when an admin is "logged in" on this tab
        if (loggedInRef.current) {
          setLastLiveOrderId(e.order.id);
          playDing();
          vibrate();
          sendNotification(
            `Nouvelle commande ${e.order.number}`,
            `${e.order.customerName} · Retrait à ${e.order.slot} · ${e.order.total.toFixed(2)} €`,
            e.order.id
          );
          // Auto-clear highlight after 6s
          setTimeout(() => {
            setLastLiveOrderId((cur) => (cur === e.order.id ? null : cur));
          }, 6000);
        }
      } else if (e.type === 'status-change') {
        setOrders((prev) =>
          prev.map((o) => (o.id === e.orderId ? { ...o, status: e.status } : o))
        );
      }
    },
    []
  );

  useOrderEvents(handleEvent);

  const login = (_email: string, _pwd: string) => {
    setIsLoggedIn(true);
    return true;
  };
  const logout = () => setIsLoggedIn(false);

  const toggleOrders = () => setOrdersOpen((v) => !v);

  const updateOrderStatus = (id: string, status: OrderStatus) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));

  const addOrder = (order: Order) => setOrders((prev) => [order, ...prev]);

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
