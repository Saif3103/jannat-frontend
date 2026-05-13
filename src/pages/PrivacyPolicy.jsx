import { Helmet } from 'react-helmet-async';

function PolicySection({ title, children }) {
  return (
    <div className="mb-8">
      <h2 className="font-luxury text-2xl text-[#1A1A1A] mb-3">{title}</h2>
      <div className="text-[#1A1A1A]/60 leading-relaxed space-y-2 text-sm">{children}</div>
    </div>
  );
}

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet><title>Privacy Policy | Jannat Rugs Co.</title></Helmet>
      <div className="pt-24 min-h-screen max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-luxury text-4xl text-white mb-2">Privacy Policy</h1>
        <p className="text-[#1A1A1A]/40 text-sm mb-10">Last updated: January 2025</p>
        <PolicySection title="Information We Collect">
          <p>We collect information you provide directly, such as name, email, phone number, and delivery addresses when you register or place an order. We also collect payment information (processed securely by our payment partners) and usage data to improve your experience.</p>
        </PolicySection>
        <PolicySection title="How We Use Your Information">
          <p>Your information is used to process orders, communicate about your purchases, provide customer support, send promotional offers (with your consent), and improve our services. We never sell your personal data to third parties.</p>
        </PolicySection>
        <PolicySection title="Data Security">
          <p>All sensitive data is encrypted using industry-standard SSL/TLS protocols. Passwords are hashed using bcrypt. We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your information.</p>
        </PolicySection>
        <PolicySection title="Cookies">
          <p>We use cookies to maintain your session and cart, remember preferences, and analyze website traffic. You can disable cookies in your browser settings, though this may affect some website functionality.</p>
        </PolicySection>
        <PolicySection title="Contact">
          <p>For privacy-related concerns, contact us at jannatrugs786@gmail.com or call +91 9235508422.</p>
        </PolicySection>
      </div>
    </>
  );
}
