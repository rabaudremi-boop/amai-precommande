import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import TimeSlots from './pages/TimeSlots';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import Offer from './pages/Offer';

import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Orders from './pages/admin/Orders';
import OrderDetail from './pages/admin/OrderDetail';
import Products from './pages/admin/Products';
import SettingsPage from './pages/admin/SettingsPage';
import Kitchen from './pages/admin/Kitchen';

export default function App() {
  return (
    <Routes>
      {/* Parcours client */}
      <Route path="/" element={<Home />} />
      <Route path="/carte" element={<Catalog />} />
      <Route path="/panier" element={<Cart />} />
      <Route path="/creneaux" element={<TimeSlots />} />
      <Route path="/paiement" element={<Payment />} />
      <Route path="/confirmation" element={<Confirmation />} />

      {/* Page commerciale (présentation client) */}
      <Route path="/offre" element={<Offer />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/commandes" element={<Orders />} />
      <Route path="/admin/commandes/:id" element={<OrderDetail />} />
      <Route path="/admin/cuisine" element={<Kitchen />} />
      <Route path="/admin/produits" element={<Products />} />
      <Route path="/admin/parametres" element={<SettingsPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
