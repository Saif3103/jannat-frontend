import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { FiDownload, FiFileText, FiPlus, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { useSettingsStore } from '../../store';
import {
  generateInvoicePdf,
  loadCreatedInvoices,
  findCreatedInvoice,
} from '../../utils/generateInvoice';

export default function AdminInvoices() {
  const [orders, setOrders] = useState([]);
  const [created, setCreated] = useState(() => loadCreatedInvoices());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [creatingId, setCreatingId] = useState(null);
  const { settings, fetchSettings } = useSettingsStore();

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/orders/admin/all');
      setOrders(data.orders || []);
      setCreated(loadCreatedInvoices());
    } catch {
      toast.error('Failed to load orders for invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    if (!settings) fetchSettings();
  }, []);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders
      .map((order) => {
        const inv = findCreatedInvoice(order._id) || created.find((c) => c.orderId === order._id);
        return { order, invoice: inv };
      })
      .filter(({ order, invoice }) => {
        if (!q) return true;
        const id = order._id?.slice(-8)?.toLowerCase() || '';
        const name = (order.user?.name || order.shippingAddress?.name || '').toLowerCase();
        const email = (order.user?.email || '').toLowerCase();
        const invNo = (invoice?.invoiceNumber || '').toLowerCase();
        return id.includes(q) || name.includes(q) || email.includes(q) || invNo.includes(q);
      });
  }, [orders, created, search]);

  const handleCreate = async (order) => {
    setCreatingId(order._id);
    try {
      const record = generateInvoicePdf(order, settings || {});
      setCreated(loadCreatedInvoices());
      toast.success(`Invoice ${record.invoiceNumber} created`);
    } catch (err) {
      console.error(err);
      toast.error('Could not create invoice');
    } finally {
      setCreatingId(null);
    }
  };

  const handleDownload = async (order) => {
    setCreatingId(order._id);
    try {
      generateInvoicePdf(order, settings || {});
      setCreated(loadCreatedInvoices());
      toast.success('Invoice downloaded');
    } catch (err) {
      console.error(err);
      toast.error('Download failed');
    } finally {
      setCreatingId(null);
    }
  };

  const createdCount = rows.filter((r) => r.invoice).length;

  return (
    <AdminLayout>
      <Helmet><title>Invoices | Admin</title></Helmet>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="text-left">
            <h2 className="text-lg font-bold text-[#1A1A1A] sm:hidden">Invoices</h2>
            <p className="text-sm text-gray-500">
              Create and download invoices for orders
              {!loading && (
                <span className="text-gray-400"> · {createdCount}/{orders.length} created</span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer self-start"
          >
            <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="search"
            placeholder="Search order ID, customer, invoice no…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-white border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#C9A84C]/20 focus:border-[#C9A84C]/50"
          />
        </div>

        {/* Mobile cards */}
        <div className="lg:hidden space-y-2.5">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="h-28 bg-white rounded-2xl animate-pulse border border-gray-100" />
              ))
            : rows.length === 0
              ? (
                <div className="bg-white border border-gray-100 rounded-2xl py-14 text-center text-sm text-gray-400">
                  No orders found
                </div>
              )
              : rows.map(({ order, invoice }) => (
                <div key={order._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-left">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1A1A1A]">
                        #{order._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {order.user?.name || order.shippingAddress?.name || 'Guest'}
                      </p>
                      {invoice && (
                        <p className="text-[11px] text-[#B69640] font-semibold mt-1">
                          {invoice.invoiceNumber}
                        </p>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${
                      invoice
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {invoice ? 'Created' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-3">
                    <p className="text-sm font-bold text-[#1A1A1A]">
                      ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')}
                    </p>
                    {invoice ? (
                      <button
                        type="button"
                        disabled={creatingId === order._id}
                        onClick={() => handleDownload(order)}
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#1A1A1A] text-white text-xs font-semibold cursor-pointer disabled:opacity-50"
                      >
                        <FiDownload size={13} />
                        Download
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={creatingId === order._id}
                        onClick={() => handleCreate(order)}
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#C9A84C] text-[#1A1A1A] text-xs font-semibold cursor-pointer disabled:opacity-50"
                      >
                        <FiPlus size={13} />
                        {creatingId === order._id ? 'Creating…' : 'Create Invoice'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Order', 'Customer', 'Invoice No.', 'Amount', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-400 text-[11px] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">Loading…</td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      <FiFileText className="mx-auto mb-2 text-gray-300" size={28} />
                      No orders found
                    </td>
                  </tr>
                ) : (
                  rows.map(({ order, invoice }) => (
                    <tr key={order._id} className="hover:bg-gray-50/60">
                      <td className="px-5 py-4 font-bold text-[#1A1A1A]">
                        #{order._id.slice(-6).toUpperCase()}
                        <p className="text-[11px] text-gray-400 font-normal mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-medium text-[#1A1A1A]">{order.user?.name || order.shippingAddress?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-400">{order.user?.email || '—'}</p>
                      </td>
                      <td className="px-5 py-4">
                        {invoice ? (
                          <span className="font-semibold text-[#1A1A1A]">{invoice.invoiceNumber}</span>
                        ) : (
                          <span className="text-gray-400 text-xs">Not created</span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-bold text-[#1A1A1A] tabular-nums">
                        ₹{Number(order.totalPrice || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                          invoice
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {invoice ? 'Created' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {invoice ? (
                          <button
                            type="button"
                            disabled={creatingId === order._id}
                            onClick={() => handleDownload(order)}
                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-[#1A1A1A] hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                          >
                            <FiDownload size={14} />
                            Download
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={creatingId === order._id}
                            onClick={() => handleCreate(order)}
                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#1A1A1A] text-white text-xs font-semibold hover:bg-black cursor-pointer disabled:opacity-50"
                          >
                            <FiPlus size={14} />
                            {creatingId === order._id ? 'Creating…' : 'Create Invoice'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
