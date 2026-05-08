import { ReactNode } from 'react';
import { Link, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Salad,
  Settings,
  LogOut,
  Pause,
  Play,
} from 'lucide-react';
import Logo from '../../components/Logo';
import { useAdmin } from '../../context/AdminContext';

interface Props {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: Props) {
  const { isLoggedIn, logout, ordersOpen, toggleOrders } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-30 border-b border-cream-200 bg-cream-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2">
              <Logo />
            </Link>
            <span className="hidden h-6 w-px bg-cream-200 sm:block" />
            <span className="hidden text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-500 sm:block">
              Espace pro
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleOrders}
              className={`hidden items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold sm:inline-flex ${
                ordersOpen
                  ? 'bg-sage-100 text-sage-700'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {ordersOpen ? <Pause size={14} /> : <Play size={14} />}
              {ordersOpen ? 'Mettre en pause' : 'Reprendre'}
            </button>
            <button
              onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-soft hover:bg-rose-50 hover:text-rose-700"
              aria-label="Se déconnecter"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 lg:flex-row">
        <aside className="lg:w-56 lg:shrink-0">
          <nav className="card overflow-hidden p-2">
            <SideLink to="/admin" icon={<LayoutDashboard size={16} />} label="Dashboard" exact />
            <SideLink to="/admin/commandes" icon={<Receipt size={16} />} label="Commandes" />
            <SideLink to="/admin/produits" icon={<Salad size={16} />} label="Produits" />
            <SideLink to="/admin/parametres" icon={<Settings size={16} />} label="Paramètres" />
          </nav>
          <button
            onClick={toggleOrders}
            className={`mt-3 flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-semibold sm:hidden ${
              ordersOpen
                ? 'bg-sage-100 text-sage-700'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {ordersOpen ? <Pause size={14} /> : <Play size={14} />}
            {ordersOpen ? 'Mettre les commandes en pause' : 'Reprendre les commandes'}
          </button>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
                {breadcrumb(location.pathname)}
              </div>
              <h1 className="font-display text-3xl font-bold leading-tight">{title}</h1>
            </div>
          </div>
          <div className="mt-5">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SideLink({
  to,
  icon,
  label,
  exact,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  exact?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[14px] font-medium transition ${
          isActive
            ? 'bg-sage-100 text-sage-700'
            : 'text-ink-700 hover:bg-cream-100'
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}

function breadcrumb(path: string) {
  if (path === '/admin') return 'Admin';
  if (path.startsWith('/admin/commandes')) return 'Admin · Commandes';
  if (path.startsWith('/admin/produits')) return 'Admin · Produits';
  if (path.startsWith('/admin/parametres')) return 'Admin · Paramètres';
  return 'Admin';
}
