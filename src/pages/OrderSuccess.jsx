import { useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  FiCheck,
  FiDownload,
  FiShoppingBag,
  FiMessageCircle,
  FiPhone,
  FiMail,
  FiMapPin,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

const TIMELINE = [
  'Order Received',
  'Order Verification',
  'Customer Confirmation Call',
  'Payment Confirmation',
  'Quality Inspection',
  'Secure Packaging',
  'Shipment',
  'Delivered',
];

const WA =
  'https://wa.me/919235508422?text=Hello%20Jannat%20Rugs%20Co.%2C%20I%20need%20help%20with%20my%20order';

function formatOrderId(order) {
  if (!order) return 'JR-2026-00000';
  if (order.orderIdDisplay) return order.orderIdDisplay;
  const year = new Date(order.createdAt || Date.now()).getFullYear();
  const short = (order.trackingNumber || order._id || '')
    .toString()
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(-5)
    .toUpperCase()
    .padStart(5, '0');
  return `JR-${year}-${short}`;
}

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/dashboard?tab=orders', { replace: true });
    }
  }, [order, navigate]);

  const orderId = useMemo(() => formatOrderId(order), [order]);
  const delivery =
    order?.deliveryOption === 'express' ? '1–2 Business Days' : '4–7 Business Days';
  const flow = state?.flow;
  const timelineSteps =
    order?.timeline?.length > 0 ? order.timeline.map((t) => t.step) : TIMELINE;

  if (!order) return null;

  const downloadSummary = () => {
    const lines = [
      'Jannat Rugs Co. — Order Summary',
      `Order ID: ${orderId}`,
      `Tracking: ${order.trackingNumber || '—'}`,
      `Total: ₹${Number(order.totalPrice || 0).toLocaleString('en-IN')}`,
      `Payment: ${order.paymentMethod}`,
      `Status: ${order.orderStatus}`,
      '',
      'Items:',
      ...(order.orderItems || []).map(
        (i) =>
          `- ${i.name} × ${i.quantity}${i.size ? ` (${i.size})` : ''} — ₹${Number(
            (i.price || 0) * (i.quantity || 1)
          ).toLocaleString('en-IN')}`
      ),
      '',
      'Our team will contact you within 24 hours to verify your order.',
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${orderId}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Order Confirmed | Jannat Rugs Co.</title>
      </Helmet>

      <div className="pt-24 pb-28 md:pb-16 min-h-screen bg-gradient-to-b from-[#FAF7F2] via-white to-[#F3EFE9]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Success hero */}
          <div className="text-center pt-6 sm:pt-10 mb-10">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_12px_40px_rgba(16,185,129,0.45)] mb-6"
            >
              <motion.span
                initial={{ pathLength: 0 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                <FiCheck className="text-white" size={42} strokeWidth={3} />
              </motion.span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-luxury text-4xl sm:text-5xl text-[#1A1A1A] mb-2"
            >
              Thank You!
            </motion.h1>
            <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
              Your order request has been received successfully.
            </p>

            <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 rounded-2xl bg-white border border-black/[0.06] px-5 py-4 shadow-sm">
              <div className="text-center sm:text-left">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                  Order ID
                </p>
                <p className="font-semibold text-[#1A1A1A] text-lg tracking-wide">{orderId}</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-gray-100" />
              <div className="text-center sm:text-left">
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400 font-semibold">
                  Verification
                </p>
                <p className="font-semibold text-[#B69640] text-sm">Within 24 Hours</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="rounded-3xl bg-white border border-black/[0.06] p-5 sm:p-6 shadow-sm mb-6 text-center">
            <p className="text-sm text-gray-600 leading-relaxed max-w-lg mx-auto">
              {flow === 'awaiting_confirmation' || order.paymentMethod === 'PayAfterConfirm'
                ? 'Our team will call you shortly to confirm your order and share payment guidance.'
                : order.paymentMethod === 'BankTransfer'
                  ? 'After you upload payment proof, our team will verify and confirm your order.'
                  : 'Our customer support team will contact you shortly to confirm your order and guide you through the next steps.'}
            </p>
          </div>

          {/* Timeline */}
          <div className="rounded-3xl bg-white border border-black/[0.06] p-5 sm:p-6 shadow-sm mb-6">
            <h2 className="font-luxury text-2xl text-[#1A1A1A] mb-5 text-center">Order Timeline</h2>
            <ol className="relative space-y-0 max-w-md mx-auto">
              {timelineSteps.map((step, i) => {
                const completed = order?.timeline?.[i]?.completed || i === 0;
                return (
                <li key={step} className="flex gap-4 pb-6 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        completed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#FAF7F2] text-[#B69640] border border-[#C9A84C]/40'
                      }`}
                    >
                      {completed ? <FiCheck size={14} /> : i + 1}
                    </span>
                    {i < timelineSteps.length - 1 && (
                      <span className="w-px flex-1 min-h-[20px] bg-gradient-to-b from-[#C9A84C]/50 to-gray-100 mt-1" />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <p
                      className={`text-sm font-semibold ${
                        completed ? 'text-emerald-700' : 'text-[#1A1A1A]'
                      }`}
                    >
                      {step}
                    </p>
                  </div>
                </li>
              );})}
            </ol>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              `Est. Delivery: ${delivery}`,
              'Free Shipping*',
              '100% Handmade',
              'Premium Quality',
              'Easy Order Assistance',
              'Secure Checkout',
            ].map((b) => (
              <span
                key={b}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-white border border-[#C9A84C]/30 text-[#1A1A1A]"
              >
                {b}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
            <Link
              to="/order-tracking"
              className="h-12 rounded-xl bg-[#1A1A1A] text-white text-sm font-semibold flex items-center justify-center gap-2"
            >
              <FiMapPin size={16} /> Track Order
            </Link>
            <Link
              to="/shop"
              className="h-12 rounded-xl bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold flex items-center justify-center gap-2"
            >
              <FiShoppingBag size={16} /> Continue Shopping
            </Link>
            <button
              type="button"
              onClick={downloadSummary}
              className="h-12 rounded-xl border border-gray-200 bg-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <FiDownload size={16} /> Download Order Summary
            </button>
            <a
              href={WA}
              target="_blank"
              rel="noreferrer"
              className="h-12 rounded-xl border border-[#25D366]/40 bg-[#25D366]/10 text-[#128C7E] text-sm font-semibold flex items-center justify-center gap-2"
            >
              <FiMessageCircle size={16} /> Contact Support
            </a>
          </div>

          {/* Help */}
          <div className="rounded-3xl border border-black/[0.06] bg-white p-5 sm:p-6 shadow-sm text-center mb-8">
            <h3 className="font-luxury text-xl text-[#1A1A1A] mb-1">Need Assistance?</h3>
            <p className="text-xs text-gray-400 mb-5">
              Working Hours · Mon–Sat · 10 AM – 7 PM
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="tel:+919235508422"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-gray-200 text-sm font-medium text-[#1A1A1A]"
              >
                <FiPhone size={14} className="text-[#B69640]" /> Call Us
              </a>
              <a
                href={WA}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[#25D366]/30 text-sm font-medium text-[#128C7E]"
              >
                <FaWhatsapp size={15} /> WhatsApp
              </a>
              <a
                href="mailto:hello@jannatrugs.com"
                className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-gray-200 text-sm font-medium text-[#1A1A1A]"
              >
                <FiMail size={14} className="text-[#B69640]" /> Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
