import { Helmet } from 'react-helmet-async';

export default function TermsConditions() {
  return (
    <>
      <Helmet><title>Terms & Conditions | Jannat Rugs Co.</title></Helmet>
      <div className="pt-24 min-h-screen max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-luxury text-4xl text-white mb-2">Terms & Conditions</h1>
        <p className="text-amber-100/40 text-sm mb-10">Last updated: January 2025</p>
        {[
          { title: 'Acceptance of Terms', body: 'By accessing and using the Jannat Rugs Co. website, you agree to be bound by these Terms and Conditions. If you do not agree, please discontinue use of the website.' },
          { title: 'Product Descriptions', body: 'We strive to display our products as accurately as possible. Colors and textures may vary slightly due to screen settings. All measurements are approximate.' },
          { title: 'Orders & Payments', body: 'By placing an order, you agree to provide accurate information. We reserve the right to cancel orders that appear fraudulent. All prices are in Indian Rupees (INR) and inclusive of applicable taxes.' },
          { title: 'Shipping & Delivery', body: 'We offer delivery across India. Estimated delivery times are 5-7 business days. Jannat Rugs Co. is not responsible for delays caused by courier partners or customs.' },
          { title: 'Returns & Refunds', body: 'Items may be returned within 7 days of delivery in original, unused condition. Custom orders are non-returnable. Refunds are processed within 7-10 business days after we receive and inspect the returned item.' },
          { title: 'Intellectual Property', body: 'All content on this website, including images, text, and designs, is the property of Jannat Rugs Co. and protected by copyright laws.' },
          { title: 'Contact', body: 'For terms-related queries: jannatrugs786@gmail.com | +91 9235508422' },
        ].map(s => (
          <div key={s.title} className="mb-7">
            <h2 className="font-luxury text-2xl text-amber-400 mb-2">{s.title}</h2>
            <p className="text-amber-100/60 text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
