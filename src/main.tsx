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
