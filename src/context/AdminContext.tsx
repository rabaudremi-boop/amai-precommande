import { createContext, useContext, useState, ReactNode } from 'react';
import type { Order, OrderStatus, Product } from '../types';
import { MOCK_ORDERS } from '../data/orders';
import { PRODUCTS } from '../data/products';

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
  const [settings, setSettings] = useState<RestaurantSettings>({
    openingHours: '11h30 – 14h30 · Lundi au vendredi',
    minPrepTime: 20,
    maxPerSlot: 6,
    closedMessage:
      'Les commandes sont temporairement en pause. Revenez d’ici quelques minutes.',
  });

  const login = (_email: string, _pwd: string) => {
    // Pas de vraie auth — toute combinaison non vide passe.
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
