import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store';
import CheckoutFlow from '../components/checkout/CheckoutFlow';

/** Full-page checkout for cart → /checkout (Buy Now uses modal). */
export default function Checkout() {
  const { items } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!items?.length) {
      navigate('/cart', { replace: true });
    }
  }, [items, navigate]);

  return (
    <>
      <Helmet>
        <title>Checkout | Jannat Rugs Co.</title>
      </Helmet>
      <div className="pt-24 pb-28 md:pb-16 min-h-screen bg-gradient-to-b from-[#FAF7F2] via-white to-[#F3EFE9]">
        <div className="px-4 sm:px-6 py-8">
          <CheckoutFlow variant="page" />
        </div>
      </div>
    </>
  );
}
