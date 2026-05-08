import { useEffect, useState } from 'react';
import { Download, Share, Plus, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const isiOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);

const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // iOS-specific
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const STORAGE_KEY = 'amai_install_dismissed';

export default function InstallButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosSheet, setShowIosSheet] = useState(false);
  const [installed, setInstalled] = useState(isStandalone());
  const [dismissed, setDismissed] = useState(
    typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === '1'
  );

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed || dismissed) return null;

  const ios = isiOS();
  // If neither prompt available nor iOS, hide (browser doesn't support installation)
  if (!ios && !deferred) return null;

  const handleClick = async () => {
    if (ios) {
      setShowIosSheet(true);
      return;
    }
    if (deferred) {
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      setDeferred(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
    setShowIosSheet(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="group inline-flex items-center gap-2 rounded-full border border-sage-300 bg-white/80 px-4 py-2 text-[13px] font-semibold text-sage-700 backdrop-blur transition hover:border-sage-500 hover:bg-white"
      >
        <Download size={14} />
        Installer l'app
      </button>

      {showIosSheet && (
        <IosInstructions onClose={() => setShowIosSheet(false)} onDismiss={handleDismiss} />
      )}
    </>
  );
}

function IosInstructions({
  onClose,
  onDismiss,
}: {
  onClose: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
    >
      <div
        className="absolute inset-0 bg-ink-900/40 animate-fade-in"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-t-card bg-white shadow-lift sm:rounded-card animate-fade-up">
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-cream-100 hover:bg-sage-50"
        >
          <X size={16} />
        </button>

        <div className="px-6 pb-6 pt-7">
          <h2 className="font-display text-2xl font-bold leading-tight">
            Installer A Maï sur ton iPhone
          </h2>
          <p className="mt-1 text-[14px] text-ink-500">
            En 3 étapes — ton app s'ajoute à ton écran d'accueil comme une vraie app.
          </p>

          <ol className="mt-5 space-y-3">
            <Step n="1">
              Touche le bouton <strong>Partager</strong>{' '}
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-sage-100 align-middle text-sage-700">
                <Share size={14} />
              </span>{' '}
              en bas de Safari.
            </Step>
            <Step n="2">
              Fais défiler et touche <strong>« Sur l'écran d'accueil »</strong>{' '}
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-sage-100 align-middle text-sage-700">
                <Plus size={14} />
              </span>
              .
            </Step>
            <Step n="3">
              Touche <strong>Ajouter</strong> en haut à droite — c'est fait.
            </Step>
          </ol>

          <div className="mt-5 rounded-2xl bg-sage-50 p-3 text-[12px] text-sage-700">
            ⚠️ Important : ouvre ce site dans <strong>Safari</strong>. Depuis Chrome
            ou un lien Instagram, l'option n'apparaît pas.
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button onClick={onClose} className="btn-primary flex-1">
              J'ai compris
            </button>
            <button onClick={onDismiss} className="btn-ghost text-[12px]">
              Ne plus afficher
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[14px] text-ink-700">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-[12px] font-bold text-sage-700">
        {n}
      </span>
      <span className="leading-relaxed">{children}</span>
    </li>
  );
}
