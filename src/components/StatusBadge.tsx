import type { OrderStatus } from '../types';
import { ORDER_STATUS_LABELS } from '../types';

const STYLES: Record<OrderStatus, string> = {
  nouvelle: 'bg-blue-100 text-blue-700',
  'en-preparation': 'bg-amber-100 text-amber-800',
  prete: 'bg-sage-100 text-sage-700',
  recuperee: 'bg-ink-300/30 text-ink-700',
  annulee: 'bg-rose-100 text-rose-700',
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`chip ${STYLES[status]}`}>{ORDER_STATUS_LABELS[status]}</span>;
}
