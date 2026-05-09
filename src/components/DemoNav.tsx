import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  Home,
  Salad,
  FileText,
  Lock,
  LayoutDashboard,
  ChefHat,
  EyeOff,
} from 'lucide-react';

/**
 * Floating quick-nav for the live demo.
 *
 * Visible by default. The user can hide it for the current browser session
 * with the eye-off button or by appending `?demo=0` to the URL.
 *
 * Remove this component (and its mount in App.tsx) after the demo if it's
 * no longer wanted in production.
 */
const HIDDEN_KEY = 'amai_demo_nav_hidden';

export default function DemoNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Init visibility from URL or session storage
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get('demo') === '0') {
      sessionStorage.setItem(HIDDEN_KEY, '1');
      setHidden(true);
      return;
    }
    if (sessionStorage.getItem(HIDDEN_KEY) === '1') setHidden(true);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  if (hidden) return null;

  const items: { path: string; label: string; icon: React.ReactNode }[] = [
    { path: '/', label: 'Accueil client', icon: <Home size={15} /> },
    { path: '/carte', label: 'Carte', icon: <Salad size={15} /> },
    { path: '/offre', label: 'Page offre', icon: <FileText size={15} /> },
    { path: '/admin/login', label: 'Espace pro · Login', icon: <Lock size={15} /> },
    { path: '/admin', label: 'Dashboard admin', icon: <LayoutDashboard size={15} /> },
    { path: '/admin/cuisine', label: 'Écran cuisine', icon: <ChefHat size={15} /> },
  ];

  const hide = () => {
    sessionStorage.setItem(HIDDEN_KEY, '1');
    setHidden(true);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed right-3 top-3 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-ink-900/85 text-white shadow-lift backdrop-blur transition hover:bg-ink-700"
        aria-label={open ? 'Fermer la navigation démo' : 'Ouvrir la navigation démo'}
        title="Navigation démo"
      >
        {open ? <X size={16} /> : <Sparkles size={16} />}
      </button>

      {open && (
        <div className="fixed right-3 top-14 z-[60] w-[260px] overflow-hidden rounded-2xl bg-ink-900/95 shadow-lift backdrop-blur animate-fade-up">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
              Navigation démo
            </span>
            <button
              onClick={hide}
              title="Masquer pour la session"
              aria-label="Masquer"
              className="flex h-7 w-7 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
            >
              <EyeOff size={13} />
            </button>
          </div>
          <div className="p-1.5">
            {items.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] transition ${
                    active
                      ? 'bg-sage-500/25 text-sage-100 ring-1 ring-sage-400/40'
                      : 'text-white/85 hover:bg-white/8'
                  }`}
                >
                  <span className={active ? 'text-sage-200' : 'text-white/55'}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="border-t border-white/10 px-4 py-2.5 text-[10px] text-white/40">
            Astuce : <code className="rounded bg-white/10 px-1 py-0.5 text-white/70">?demo=0</code> pour masquer pendant la session
          </div>
        </div>
      )}
    </>
  );
}
