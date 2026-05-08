import type { Badge as BadgeType } from '../types';

const STYLES: Record<BadgeType, string> = {
  Populaire: 'bg-amber-100 text-amber-800',
  Végétarien: 'bg-sage-100 text-sage-700',
  Nouveau: 'bg-rose-100 text-rose-700',
};

export default function Badge({ kind }: { kind: BadgeType }) {
  return <span className={`chip ${STYLES[kind]}`}>{kind}</span>;
}
