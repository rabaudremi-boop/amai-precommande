import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../context/CartContext';

interface LayoutProps {
  children: ReactNode;
  /** Show a back arrow in the header. */
  showBack?: boolean;
  title?: string;
  /** Hide cart icon (e.g. on payment / confirmation). */
  hideCart?: boolean;
}

export default function Layout({
  children,
  showBack = false,
  title,
  hideCart = false,
}: LayoutProps) {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-30 border-b border-cream-200 bg-cream-50/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <div className="flex min-w-0 items-center gap-2">
            {showBack ? (
              <button
                onClick={() => navigate(-1)}
                className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-sage-50"
                aria-label="Retour"
              >
                <ChevronLeft size={22} />
              </button>
            ) : null}
            {title ? (
              <h1 className="truncate font-display text-lg font-semibold">{title}</h1>
            ) : (
              <Link to="/">
                <Logo />
              </Link>
            )}
          </div>
          {!hideCart && !isHome && (
            <Link
              to="/panier"
              aria-label="Panier"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-soft transition hover:bg-sage-50"
            >
              <ShoppingBag size={18} className="text-sage-600" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sage-500 px-1 text-[11px] font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 pb-32 pt-4">{children}</main>
    </div>
  );
}
