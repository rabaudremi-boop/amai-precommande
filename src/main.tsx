import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import './index.css';

// On GitHub Pages the app lives at /<repo-name>/, locally at /.
// Vite exposes the base via import.meta.env.BASE_URL.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

// PWA service worker — only in production (skip in dev to avoid stale caches).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .catch(() => {});
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <AdminProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AdminProvider>
    </BrowserRouter>
  </React.StrictMode>
);
