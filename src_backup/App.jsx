import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSettingsStore, useAuthStore } from './store';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ChatBot from './components/ChatBot';
import WhatsAppButton from './components/WhatsAppButton';
import Loader from './components/ui/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Categories = lazy(() => import('./pages/Categories'));
const Offers = lazy(() => import('./pages/Offers'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOffers = lazy(() => import('./pages/admin/AdminOffers'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const NotFound = lazy(() => import('./pages/NotFound'));

const ADMIN_PATHS = ['/admin', '/admin/'];

export default function App() {
  const location = useLocation();
  const fetchSettings = useSettingsStore(s => s.fetchSettings);
  const { user, token } = useAuthStore();
  const isAdminPage = location.pathname.startsWith('/admin');

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      {!isAdminPage && <Header />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Suspense fallback={<Loader fullscreen />}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/offers" element={<AdminOffers />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <ChatBot />}
      {!isAdminPage && <WhatsAppButton />}
    </div>
  );
}
