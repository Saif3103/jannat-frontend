import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FiCheck,
  FiChevronRight,
  FiClock,
  FiDownload,
  FiPhone,
  FiShoppingBag,
  FiStar,
  FiTruck,
  FiUpload,
} from 'react-icons/fi';
import { BASE_URL } from '../../api/axios';

const TRACK_STEPS = ['Ordered', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

const PAYMENT_LABELS = {
  COD: 'Cash on Delivery',
  BankTransfer: 'Bank Transfer',
  PayAfterConfirm: 'Pay After Confirm',
  Razorpay: 'Online',
  UPI: 'UPI',
  Card: 'Card',
  Wallet: 'Wallet',
};

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'In Progress' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

function getImageUrl(url) {
  if (!url) return 'https://images.unsplash.com/photo-1600166898405-da9535204843?w=800';
  if (url.startsWith('http')) return url;
  return `${BASE_URL}/${url}`;
}

export function getFriendlyStatus(order) {
  const os = order.orderStatus || 'Pending';
  const ps = order.paymentStatus || '';
  const method = order.paymentMethod || '';

  if (os === 'Cancelled') {
    return {
      label: 'Cancelled',
      hint: 'This order was cancelled',
      tone: 'text-red-700 bg-red-50',
      group: 'cancelled',
    };
  }
  if (os === 'Returned') {
    return {
      label: 'Returned',
      hint: 'Return completed',
      tone: 'text-gray-600 bg-gray-100',
      group: 'cancelled',
    };
  }
  if (os === 'Delivered') {
    return {
      label: 'Delivered',
      hint: order.deliveredAt
        ? `Delivered on ${new Date(order.deliveredAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
          })}`
        : 'Your order has been delivered',
      tone: 'text-emerald-700 bg-emerald-50',
      group: 'delivered',
    };
  }
  if (os === 'Shipped' || os === 'Out for Delivery') {
    return {
      label: os === 'Out for Delivery' ? 'Out for Delivery' : 'Shipped',
      hint: order.trackingNumber ? `Tracking ${order.trackingNumber}` : 'On the way to you',
      tone: 'text-sky-700 bg-sky-50',
      group: 'shipped',
    };
  }
  if (method === 'BankTransfer' && (ps === 'AwaitingProof' || os === 'Awaiting Payment')) {
    return {
      label: 'Awaiting Payment',
      hint: 'Upload bank transfer proof to continue',
      tone: 'text-amber-800 bg-amber-50',
      group: 'pending',
      action: 'proof',
    };
  }
  if (method === 'BankTransfer' && (ps === 'UnderReview' || os === 'Payment Pending')) {
    return {
      label: 'Payment Under Review',
      hint: 'We are verifying your payment',
      tone: 'text-blue-700 bg-blue-50',
      group: 'pending',
    };
  }
  if (
    os === 'Awaiting Confirmation' ||
    (method === 'PayAfterConfirm' && ['Pending', 'Awaiting Confirmation'].includes(os))
  ) {
    return {
      label: 'Awaiting Confirmation',
      hint: 'Our team will call you to confirm',
      tone: 'text-violet-700 bg-violet-50',
      group: 'pending',
      action: 'call',
    };
  }
  if (['Confirmed', 'Paid', 'Payment Received'].includes(os)) {
    return {
      label: 'Confirmed',
      hint: 'Preparing your order',
      tone: 'text-blue-700 bg-blue-50',
      group: 'pending',
    };
  }
  if (['Processing', 'Quality Check', 'Packed'].includes(os)) {
    return {
      label: os === 'Packed' ? 'Packed' : 'Processing',
      hint: 'Your rug is being prepared',
      tone: 'text-purple-700 bg-purple-50',
      group: 'pending',
    };
  }
  return {
    label: os || 'Ordered',
    hint: 'We have received your order',
    tone: 'text-amber-700 bg-amber-50',
    group: 'pending',
  };
}

function getTrackStepIndex(order) {
  const os = (order.orderStatus || '').toLowerCase();
  if (os.includes('cancel') || os.includes('return')) return -1;
  if (os.includes('deliver')) return 4;
  if (os.includes('out for') || os.includes('ship')) return 3;
  if (os.includes('pack') || os.includes('quality') || os.includes('process')) return 2;
  if (
    os.includes('confirm') ||
    os.includes('paid') ||
    os.includes('payment received') ||
    (order.paymentMethod === 'BankTransfer' && order.paymentStatus === 'Verified')
  ) {
    return 1;
  }
  return 0;
}

function OrderCard({ order, onInvoice, onReview }) {
  const [open, setOpen] = useState(false);
  const status = getFriendlyStatus(order);
  const stepIdx = getTrackStepIndex(order);
  const displayId =
    order.orderIdDisplay ||
    order.trackingNumber ||
    `#${String(order._id).slice(-8).toUpperCase()}`;
  const history = order.statusHistory?.length
    ? [...order.statusHistory].reverse()
    : [{ status: order.orderStatus, message: status.hint, timestamp: order.createdAt }];

  return (
    <article className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden">
      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-gray-100">
        <div className="text-left">
          <p className="text-[13px] font-semibold text-[#1A1A1A]">{displayId}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
            {' · '}
            {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod || 'COD'}
          </p>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${status.tone}`}>
          {status.label}
        </span>
      </div>

      {/* Status line */}
      <div className="px-4 sm:px-5 pt-3.5 flex items-start gap-2">
        {status.action === 'proof' ? (
          <FiUpload size={14} className="text-amber-600 mt-0.5 shrink-0" />
        ) : status.action === 'call' ? (
          <FiPhone size={14} className="text-violet-600 mt-0.5 shrink-0" />
        ) : stepIdx >= 4 ? (
          <FiCheck size={14} className="text-emerald-600 mt-0.5 shrink-0" />
        ) : (
          <FiClock size={14} className="text-[#C9A84C] mt-0.5 shrink-0" />
        )}
        <p className="text-[13px] text-gray-700">{status.hint}</p>
      </div>

      {/* Tracker */}
      {stepIdx >= 0 && (
        <div className="px-5 sm:px-8 py-4">
          <div className="flex items-center">
            {TRACK_STEPS.map((label, i) => {
              const done = i <= stepIdx;
              return (
                <div key={label} className="flex-1 flex flex-col items-center relative">
                  {i > 0 && (
                    <div
                      className={`absolute top-[7px] right-1/2 w-full h-[2px] ${
                        i <= stepIdx ? 'bg-emerald-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <div
                    className={`relative z-[1] w-3.5 h-3.5 rounded-full ${
                      done ? 'bg-emerald-500' : 'bg-white border-2 border-gray-300'
                    }`}
                  />
                  <p
                    className={`mt-2 text-[9px] sm:text-[10px] text-center ${
                      done ? 'text-emerald-700 font-medium' : 'text-gray-400'
                    }`}
                  >
                    {label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="px-4 sm:px-5 pb-3 space-y-3">
        {order.orderItems?.map((item, idx) => (
          <div key={item._id || idx} className="flex gap-3 items-start">
            <img
              src={getImageUrl(item.image)}
              alt={item.name}
              className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[13px] font-medium text-[#1A1A1A] line-clamp-2">{item.name}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {[item.size, item.color].filter(Boolean).join(' · ') || 'Handmade rug'}
                {' · Qty '}
                {item.quantity || 1}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[13px] font-semibold text-[#1A1A1A]">
                ₹{Number(item.price || 0).toLocaleString('en-IN')}
              </p>
              {order.orderStatus === 'Delivered' && (
                <button
                  type="button"
                  onClick={() => onReview?.(item.product)}
                  className="mt-1 text-[11px] font-medium text-[#B69640] inline-flex items-center gap-0.5 cursor-pointer"
                >
                  <FiStar size={11} /> Rate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer actions */}
      <div className="px-4 sm:px-5 py-3 border-t border-gray-100 flex flex-wrap items-center gap-2 bg-[#FCFCFC]">
        <p className="text-[13px] font-bold text-[#1A1A1A] mr-auto">
          ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')}
        </p>
        {status.action === 'proof' && (
          <Link
            to={`/payment-proof/${order._id}`}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#C9A84C] text-[#1A1A1A] text-[12px] font-semibold hover:bg-[#B69640]"
          >
            <FiUpload size={13} /> Upload Proof
          </Link>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-gray-200 text-[12px] font-medium text-[#1A1A1A] cursor-pointer hover:border-gray-300"
        >
          <FiTruck size={13} />
          {open ? 'Hide' : 'Track'}
        </button>
        <button
          type="button"
          onClick={() => onInvoice?.(order)}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-gray-200 text-[12px] font-medium text-[#1A1A1A] cursor-pointer hover:border-gray-300"
        >
          <FiDownload size={13} /> Invoice
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-[#FAFAFA]"
          >
            <div className="px-4 sm:px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Updates
              </p>
              {history.map((h, i) => (
                <div key={i} className="flex gap-3 pb-3 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] mt-1.5" />
                    {i < history.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#1A1A1A]">{h.status}</p>
                    {h.message && <p className="text-[12px] text-gray-500 mt-0.5">{h.message}</p>}
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {h.timestamp
                        ? new Date(h.timestamp).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </p>
                  </div>
                </div>
              ))}
              {order.shippingAddress && (
                <div className="mt-3 pt-3 border-t border-gray-200 text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
                    Delivery address
                  </p>
                  <p className="text-[12px] text-gray-700 leading-relaxed">
                    {order.shippingAddress.name}
                    {order.shippingAddress.phone ? ` · ${order.shippingAddress.phone}` : ''}
                    <br />
                    {[
                      order.shippingAddress.street || order.shippingAddress.house,
                      order.shippingAddress.city,
                      order.shippingAddress.state,
                      order.shippingAddress.pincode,
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

export default function OrderHistory({
  orders,
  loading,
  orderFilter,
  setOrderFilter,
  onInvoice,
  onReview,
}) {
  const filtered = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return getFriendlyStatus(o).group === orderFilter;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      <div className="bg-white rounded-2xl border border-gray-200/80 px-4 sm:px-5 py-4">
        <h2 className="text-base sm:text-lg font-semibold text-[#1A1A1A]">Order History</h2>
        <p className="text-xs text-gray-500 mt-0.5">Track every step — simple and clear</p>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-0.5 -mx-1 px-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setOrderFilter(f.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-colors cursor-pointer ${
                orderFilter === f.id
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-sm text-gray-400">
          Loading orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
          <FiShoppingBag size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-[#1A1A1A] mb-1">No orders yet</p>
          <p className="text-xs text-gray-500 mb-5">Your purchases will show up here</p>
          <Link
            to="/shop"
            className="inline-flex h-10 px-5 items-center gap-1 rounded-xl bg-[#C9A84C] text-[#1A1A1A] text-sm font-semibold hover:bg-[#B69640]"
          >
            Shop Now <FiChevronRight size={14} />
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-sm text-gray-500">
          No orders in this filter
        </div>
      ) : (
        filtered.map((order) => (
          <OrderCard key={order._id} order={order} onInvoice={onInvoice} onReview={onReview} />
        ))
      )}
    </motion.div>
  );
}
