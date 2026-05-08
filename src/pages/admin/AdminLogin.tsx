import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import Logo from '../../components/Logo';
import { useAdmin } from '../../context/AdminContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdmin();
  const [email, setEmail] = useState('admin@amai.fr');
  const [password, setPassword] = useState('demo');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="px-4 pt-6">
        <div className="mx-auto max-w-2xl">
          <Logo showTagline />
        </div>
      </header>
      <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
        <div className="w-full">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-600">
              <Lock size={20} />
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold">Espace pro</h1>
            <p className="mt-1 text-[14px] text-ink-500">
              Connectez-vous pour accéder au pilotage du restaurant.
            </p>
          </div>
          <form onSubmit={handleLogin} className="card mt-6 space-y-3 p-5">
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-ink-500">
                Email
              </span>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-ink-500">
                Mot de passe
              </span>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button type="submit" className="btn-primary w-full">
              Connexion
            </button>
            <p className="text-center text-[11px] text-ink-500">
              Maquette · n’importe quel identifiant fonctionne.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
