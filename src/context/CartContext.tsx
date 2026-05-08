import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import type { CartItem } from '../types';
import { uid } from '../utils/format';

interface CheckoutInfo {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  slot?: string;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'lineId'>) => void;
  removeItem: (lineId: string) => void;
  setQuantity: (lineId: string, q: number) => void;
  clear: () => void;
  subtotal: number;
  serviceFee: number;
  total: number;
  itemCount: number;
  checkout: CheckoutInfo;
  setCheckout: (info: Partial<CheckoutInfo>) => void;
  selectedSlot?: string;
  setSelectedSlot: (slot: string | undefined) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkout, setCheckoutState] = useState<CheckoutInfo>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
  });
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>();

  const addItem = (item: Omit<CartItem, 'lineId'>) =>
    setItems((prev) => [...prev, { ...item, lineId: uid() }]);

  const removeItem = (lineId: string) =>
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));

  const setQuantity = (lineId: string, q: number) =>
    setItems((prev) =>
      prev
        .map((i) => (i.lineId === lineId ? { ...i, quantity: q } : i))
        .filter((i) => i.quantity > 0)
    );

  const clear = () => {
    setItems([]);
    setSelectedSlot(undefined);
    setCheckoutState({ customerName: '', customerPhone: '', customerEmail: '' });
  };

  const setCheckout = (info: Partial<CheckoutInfo>) =>
    setCheckoutState((prev) => ({ ...prev, ...info }));

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const supTotal = item.supplements.reduce((s, sup) => s + sup.price, 0);
        return sum + (item.unitPrice + supTotal) * item.quantity;
      }, 0),
    [items]
  );

  const serviceFee = 0;
  const total = subtotal + serviceFee;
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setQuantity,
        clear,
        subtotal,
        serviceFee,
        total,
        itemCount,
        checkout,
        setCheckout,
        selectedSlot,
        setSelectedSlot,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}
