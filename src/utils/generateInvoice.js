import { jsPDF } from 'jspdf';

const STORAGE_KEY = 'jannat_created_invoices';

export function getInvoiceNumber(orderId) {
  const short = String(orderId || '').slice(-6).toUpperCase();
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `INV-${y}${m}-${short}`;
}

export function loadCreatedInvoices() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveCreatedInvoice(record) {
  const list = loadCreatedInvoices().filter((i) => i.orderId !== record.orderId);
  list.unshift(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function findCreatedInvoice(orderId) {
  return loadCreatedInvoices().find((i) => i.orderId === orderId) || null;
}

function money(n) {
  return `Rs. ${Number(n || 0).toLocaleString('en-IN')}`;
}

/**
 * Generate & download a PDF invoice from an order object.
 * Works without backend invoice routes.
 */
export function generateInvoicePdf(order, settings = {}) {
  if (!order?._id) throw new Error('Invalid order');

  const existing = findCreatedInvoice(order._id);
  const invoiceNumber = existing?.invoiceNumber || getInvoiceNumber(order._id);
  const createdAt = existing?.createdAt || new Date().toISOString();

  const company = settings?.siteName || 'Jannat Rugs Co.';
  const phone = settings?.phone1 || settings?.phone || '+91 92355 08422';
  const email = settings?.email || 'hello@jannatrugs.com';
  const address = settings?.address || 'India';

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 52;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(26, 26, 26);
  doc.text(company, margin, y);

  doc.setFontSize(11);
  doc.setTextColor(201, 168, 76);
  doc.text('TAX INVOICE', pageW - margin, y, { align: 'right' });

  y += 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(address, margin, y);
  y += 12;
  doc.text(`${phone}  |  ${email}`, margin, y);

  y += 22;
  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(1.2);
  doc.line(margin, y, pageW - margin, y);
  y += 28;

  // Meta
  const addr = order.shippingAddress || {};
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(26, 26, 26);
  doc.text('Bill To', margin, y);
  doc.text('Invoice Details', pageW / 2 + 20, y);

  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  const customerName = order.user?.name || addr.name || 'Customer';
  const customerEmail = order.user?.email || '';
  const leftLines = [
    customerName,
    addr.phone || '',
    [addr.street, addr.city].filter(Boolean).join(', '),
    [addr.state, addr.pincode].filter(Boolean).join(' - '),
    customerEmail,
  ].filter(Boolean);

  leftLines.forEach((line, i) => {
    doc.text(String(line), margin, y + i * 14);
  });

  const rightLines = [
    `Invoice No: ${invoiceNumber}`,
    `Order ID: #${String(order._id).slice(-8).toUpperCase()}`,
    `Date: ${new Date(createdAt).toLocaleDateString('en-IN')}`,
    `Payment: ${order.paymentMethod || 'COD'}`,
    `Status: ${order.orderStatus || 'Pending'}`,
  ];
  rightLines.forEach((line, i) => {
    doc.text(line, pageW / 2 + 20, y + i * 14);
  });

  y += Math.max(leftLines.length, rightLines.length) * 14 + 28;

  // Table header
  const colX = {
    no: margin,
    item: margin + 28,
    qty: pageW - margin - 160,
    price: pageW - margin - 100,
    total: pageW - margin,
  };

  doc.setFillColor(26, 26, 26);
  doc.rect(margin, y - 12, pageW - margin * 2, 22, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('#', colX.no, y);
  doc.text('Item', colX.item, y);
  doc.text('Qty', colX.qty, y);
  doc.text('Price', colX.price, y);
  doc.text('Total', colX.total, y, { align: 'right' });
  y += 22;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  const items = order.orderItems || [];
  let subtotal = 0;

  items.forEach((item, idx) => {
    const lineTotal = Number(item.price || 0) * Number(item.quantity || 1);
    subtotal += lineTotal;
    const name = String(item.name || 'Product').slice(0, 48);
    const meta = [item.size, item.color].filter(Boolean).join(' / ');

    if (y > 720) {
      doc.addPage();
      y = 52;
    }

    doc.text(String(idx + 1), colX.no, y);
    doc.text(name, colX.item, y);
    if (meta) {
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text(meta, colX.item, y + 11);
      doc.setFontSize(9);
      doc.setTextColor(40, 40, 40);
    }
    doc.text(String(item.quantity || 1), colX.qty, y);
    doc.text(money(item.price), colX.price, y);
    doc.text(money(lineTotal), colX.total, y, { align: 'right' });
    y += meta ? 28 : 18;

    doc.setDrawColor(235, 235, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, y - 6, pageW - margin, y - 6);
  });

  y += 16;
  const grand = Number(order.totalPrice || subtotal);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Subtotal', pageW - margin - 120, y);
  doc.text(money(subtotal), pageW - margin, y, { align: 'right' });
  y += 16;

  if (grand !== subtotal) {
    doc.text('Shipping / Other', pageW - margin - 120, y);
    doc.text(money(grand - subtotal), pageW - margin, y, { align: 'right' });
    y += 16;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(26, 26, 26);
  doc.text('Grand Total', pageW - margin - 120, y);
  doc.setTextColor(201, 168, 76);
  doc.text(money(grand), pageW - margin, y, { align: 'right' });

  y += 40;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text('Thank you for shopping with Jannat Rugs Co.', margin, y);
  y += 12;
  doc.text('This is a computer-generated invoice.', margin, y);

  doc.save(`invoice-${invoiceNumber}.pdf`);

  const record = {
    _id: existing?._id || `local-${order._id}`,
    orderId: order._id,
    invoiceNumber,
    amount: grand,
    createdAt,
    customerName,
    customerEmail,
    orderStatus: order.orderStatus,
    paymentMethod: order.paymentMethod,
  };
  saveCreatedInvoice(record);
  return record;
}
