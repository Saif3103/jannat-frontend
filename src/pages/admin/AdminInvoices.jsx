import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api, { BASE_URL } from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { FiDownload } from 'react-icons/fi';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchInvoices = async () => {
    try {
      const { data } = await api.get('/invoices');
      setInvoices(data.invoices);
    } catch (err) {
      toast.error('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownload = async (invoiceId, invoiceNumber) => {
    try {
      const response = await api.get(`/invoices/${invoiceId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error('Failed to download invoice');
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || 
    inv.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    inv.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <Helmet><title>Invoices | Admin</title></Helmet>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Invoice Management</h1>
          <p className="text-sm text-gray-500 mt-1">View and download automatically generated invoices</p>
        </div>
        <input 
          type="text" 
          placeholder="Search by ID, name, email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 min-w-[250px]"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-4 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Invoice No.</th>
                <th className="text-left px-6 py-4 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-4 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-4 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Order Status</th>
                <th className="text-center px-6 py-4 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">Loading invoices...</td></tr>
              ) : filteredInvoices.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400">No invoices found.</td></tr>
              ) : filteredInvoices.map(inv => (
                <tr key={inv._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900 font-medium">{inv.user?.name || 'Guest'}</p>
                    <p className="text-gray-400 text-xs">{inv.user?.email || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      inv.order?.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' :
                      inv.order?.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {inv.order?.orderStatus || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDownload(inv._id, inv.invoiceNumber)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Download PDF"
                    >
                      <FiDownload size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
