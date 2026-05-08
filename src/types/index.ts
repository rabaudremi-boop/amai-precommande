export type Category =
  | 'salades-signatures'
  | 'salades-composer'
  | 'menus'
  | 'boissons'
  | 'desserts';

export type Badge = 'Populaire' | 'Végétarien' | 'Nouveau';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  badge?: Badge;
  image?: string;
  available: boolean;
  /** Whether this product offers sauce / supplement customization. */
  customizable?: boolean;
}

export interface Sauce {
  id: string;
  name: string;
}

export interface Supplement {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  /** Local id, used as React key & cart line identifier. */
  lineId: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  sauce?: string;
  removedIngredients: string[];
  supplements: { id: string; name: string; price: number }[];
}

export type SlotStatus = 'available' | 'almost-full' | 'full';

export interface TimeSlot {
  id: string;
  time: string;
  status: SlotStatus;
  capacity: number;
  taken: number;
}

export type OrderStatus =
  | 'nouvelle'
  | 'en-preparation'
  | 'prete'
  | 'recuperee'
  | 'annulee';

export interface Order {
  id: string;
  number: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  slot: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paid: boolean;
  createdAt: string;
}

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'salades-signatures', label: 'Salades signatures' },
  { id: 'salades-composer', label: 'À composer' },
  { id: 'menus', label: 'Menus' },
  { id: 'boissons', label: 'Boissons' },
  { id: 'desserts', label: 'Desserts' },
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  nouvelle: 'Nouvelle',
  'en-preparation': 'En préparation',
  prete: 'Prête',
  recuperee: 'Récupérée',
  annulee: 'Annulée',
};
