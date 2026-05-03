import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [contacts, setContacts] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', location: '', rating: 5, comment: '' });

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data.settings)).finally(() => setLoading(false));
    api.get('/contacts').then(r => setContacts(r.data.contacts)).catch(() => {});
  }, []);

  const save = async (data) => {
    setSaving(true);
    try {
      // Use FormData if data is an instance of FormData, otherwise just the object
      await api.put('/settings', data);
      toast.success('Settings saved!');
      api.get('/settings').then(r => setSettings(r.data.settings));
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const addFaq = async () => {
    if (!newFaq.question || !newFaq.answer) return;
    const updated = [...(settings.chatbotFaqs || []), newFaq];
    await save({ chatbotFaqs: JSON.stringify(updated) });
    setNewFaq({ question: '', answer: '' });
  };

  const removeFaq = async (i) => {
    const updated = settings.chatbotFaqs.filter((_, idx) => idx !== i);
    await save({ chatbotFaqs: JSON.stringify(updated) });
  };

  const TABS = ['general', 'chatbot', 'testimonials', 'messages'];

  if (loading) return <AdminLayout><div className="text-amber-100/30 text-center py-20">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <Helmet><title>Settings | Admin</title></Helmet>
      <h1 className="font-luxury text-2xl text-white mb-6">Site Settings</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${activeTab === tab ? 'bg-amber-500/20 text-amber-400 border border-amber-700/40' : 'text-amber-100/50 hover:text-amber-400'}`}>
            {tab === 'messages' ? 'Contact Messages' : tab}
          </button>
        ))}
      </div>

      {/* GENERAL */}
      {activeTab === 'general' && settings && (
        <form onSubmit={e => { e.preventDefault(); const fd = new FormData(e.target); save(fd); }} className="space-y-6 max-w-2xl">
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h2 className="text-amber-400 font-medium">Contact Information</h2>
            {[
              { name: 'siteName', label: 'Site Name', defaultValue: settings.siteName },
              { name: 'email', label: 'Email', defaultValue: settings.email },
              { name: 'phone1', label: 'Phone 1', defaultValue: settings.phone1 },
              { name: 'phone2', label: 'Phone 2', defaultValue: settings.phone2 },
              { name: 'address', label: 'Address', defaultValue: settings.address },
            ].map(f => (
              <div key={f.name}>
                <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">{f.label}</label>
                <input name={f.name} defaultValue={f.defaultValue} className="input-luxury" />
              </div>
            ))}
          </div>
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h2 className="text-amber-400 font-medium">Social Links</h2>
            {['facebook', 'instagram', 'youtube', 'whatsapp'].map(s => (
              <div key={s}>
                <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">{s}</label>
                <input name={s} defaultValue={settings.socialLinks?.[s]} placeholder={`https://${s}.com/...`} className="input-luxury" />
              </div>
            ))}
          </div>
          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h2 className="text-amber-400 font-medium">SEO</h2>
            {[
              { name: 'seoTitle', label: 'SEO Title', defaultValue: settings.seoTitle },
              { name: 'seoDescription', label: 'SEO Description', defaultValue: settings.seoDescription },
            ].map(f => (
              <div key={f.name}>
                <label className="text-xs text-amber-100/50 block mb-1.5 uppercase tracking-wider">{f.label}</label>
                <input name={f.name} defaultValue={f.defaultValue} className="input-luxury" />
              </div>
            ))}
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h2 className="text-amber-400 font-medium">Homepage Brand Video (Background)</h2>
            <p className="text-[10px] text-amber-100/30 uppercase tracking-widest mb-2">Upload the main background video for the hero section</p>
            <div className="flex flex-col gap-4">
              {settings.heroVideo && (
                <div className="aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-amber-900/30 bg-black">
                  <video src={settings.heroVideo} className="w-full h-full object-cover" muted />
                </div>
              )}
              <label className="flex items-center gap-3 px-6 py-4 border-2 border-dashed border-amber-900/30 rounded-xl cursor-pointer hover:border-amber-500/50 transition-all group">
                <FiUpload size={20} className="text-amber-500/50 group-hover:text-amber-400" />
                <span className="text-xs text-amber-100/40 font-bold uppercase tracking-widest">
                  {settings.heroVideo ? 'Replace Hero Video' : 'Upload Hero Video'}
                </span>
                <input name="heroVideo" type="file" accept="video/*" className="hidden" />
              </label>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h2 className="text-amber-400 font-medium">Homepage Ad Section Video</h2>
            <p className="text-[10px] text-amber-100/30 uppercase tracking-widest mb-2">Upload a specific ad video for the dedicated homepage section</p>
            <div className="flex flex-col gap-4">
              {settings.adVideo && (
                <div className="aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-amber-900/30 bg-black">
                  <video src={settings.adVideo} className="w-full h-full object-cover" muted />
                </div>
              )}
              <label className="flex items-center gap-3 px-6 py-4 border-2 border-dashed border-amber-900/30 rounded-xl cursor-pointer hover:border-amber-500/50 transition-all group">
                <FiUpload size={20} className="text-amber-500/50 group-hover:text-amber-400" />
                <span className="text-xs text-amber-100/40 font-bold uppercase tracking-widest">
                  {settings.adVideo ? 'Replace Ad Video' : 'Upload Ad Video'}
                </span>
                <input name="adVideo" type="file" accept="video/*" className="hidden" />
              </label>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl space-y-4">
            <h2 className="text-amber-400 font-medium">Leadership Photos</h2>
            <p className="text-[10px] text-amber-100/30 uppercase tracking-widest mb-4">Upload photos of the Founder and Co-Founder</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Founder */}
              <div className="space-y-3">
                <label className="text-xs text-amber-100/50 block uppercase tracking-wider">Founder (Shahid Ali)</label>
                <label className="relative aspect-square rounded-2xl border-2 border-dashed border-amber-900/30 hover:border-amber-500/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-black/20 group">
                  {settings.founderImage ? (
                    <>
                      <img src={settings.founderImage} alt="Founder" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <FiUpload className="text-white" size={20} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FiUpload className="text-amber-500/40" size={24} />
                      <span className="text-[10px] text-amber-100/20 uppercase font-bold">Upload Photo</span>
                    </div>
                  )}
                  <input name="founderImage" type="file" accept="image/*" className="hidden" />
                </label>
              </div>

              {/* Co-Founder */}
              <div className="space-y-3">
                <label className="text-xs text-amber-100/50 block uppercase tracking-wider">Co-Founder (Sazid Ali)</label>
                <label className="relative aspect-square rounded-2xl border-2 border-dashed border-amber-900/30 hover:border-amber-500/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-black/20 group">
                  {settings.coFounderImage ? (
                    <>
                      <img src={settings.coFounderImage} alt="Co-Founder" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <FiUpload className="text-white" size={20} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <FiUpload className="text-amber-500/40" size={24} />
                      <span className="text-[10px] text-amber-100/20 uppercase font-bold">Upload Photo</span>
                    </div>
                  )}
                  <input name="coFounderImage" type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn-gold py-2.5 px-8">{saving ? 'Saving...' : 'Save Settings'}</button>
        </form>
      )}

      {/* CHATBOT FAQs */}
      {activeTab === 'chatbot' && (
        <div className="max-w-2xl space-y-4">
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <h2 className="text-amber-400 font-medium mb-3">Chatbot FAQs</h2>
            {settings?.chatbotFaqs?.map((faq, i) => (
              <div key={i} className="p-3 border border-amber-900/20 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-amber-100 text-sm font-medium">{faq.question}</p>
                    <p className="text-amber-100/50 text-xs mt-1">{faq.answer}</p>
                  </div>
                  <button onClick={() => removeFaq(i)} className="text-red-400/50 hover:text-red-400 flex-shrink-0"><FiTrash2 size={14} /></button>
                </div>
              </div>
            ))}
            <div className="space-y-3 pt-3 border-t border-amber-900/20">
              <h3 className="text-amber-100/60 text-sm">Add New FAQ</h3>
              <input value={newFaq.question} onChange={e => setNewFaq(p => ({ ...p, question: e.target.value }))} placeholder="Question" className="input-luxury text-sm" />
              <textarea value={newFaq.answer} onChange={e => setNewFaq(p => ({ ...p, answer: e.target.value }))} placeholder="Answer" rows={3} className="input-luxury text-sm resize-none" />
              <button onClick={addFaq} className="btn-gold text-xs py-2 px-6 flex items-center gap-2"><FiPlus size={14} /> Add FAQ</button>
            </div>
          </div>
        </div>
      )}

      {/* TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="max-w-2xl space-y-4">
          {settings?.testimonials?.map((t, i) => (
            <div key={i} className="glass-card p-4 rounded-xl flex gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400 font-bold">{t.name?.[0]}</div>
              <div>
                <p className="text-amber-100 font-medium text-sm">{t.name}</p>
                <p className="text-amber-100/40 text-xs">{t.location}</p>
                <p className="text-amber-100/60 text-xs mt-1 italic">"{t.comment}"</p>
              </div>
            </div>
          ))}
          <div className="glass-card p-5 rounded-2xl space-y-3">
            <h3 className="text-amber-400 font-medium">Add Testimonial</h3>
            {[{ key: 'name', label: 'Name' }, { key: 'location', label: 'Location' }, { key: 'comment', label: 'Comment' }].map(f => (
              <div key={f.key}>
                <label className="text-xs text-amber-100/50 block mb-1">{f.label}</label>
                <input value={newTestimonial[f.key]} onChange={e => setNewTestimonial(p => ({ ...p, [f.key]: e.target.value }))} className="input-luxury text-sm" />
              </div>
            ))}
            <button onClick={async () => {
              const updated = [...(settings.testimonials || []), newTestimonial];
              await save({ testimonials: JSON.stringify(updated) });
              setNewTestimonial({ name: '', location: '', rating: 5, comment: '' });
            }} className="btn-gold text-xs py-2 px-6 flex items-center gap-2">
              <FiPlus size={14} /> Add Testimonial
            </button>
          </div>
        </div>
      )}

      {/* MESSAGES */}
      {activeTab === 'messages' && (
        <div className="glass-card rounded-2xl overflow-hidden max-w-3xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                  {['Name', 'Email', 'Phone', 'Message', 'Date'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-amber-100/40 text-xs uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-8 text-amber-100/30">No messages yet</td></tr>
                ) : contacts.map(c => (
                  <tr key={c._id} className="border-b border-amber-900/10 hover:bg-amber-500/5">
                    <td className="px-4 py-3 text-amber-100">{c.name}</td>
                    <td className="px-4 py-3 text-amber-100/60 text-xs">{c.email}</td>
                    <td className="px-4 py-3 text-amber-100/50 text-xs">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-amber-100/60 text-xs max-w-[200px] truncate">{c.message}</td>
                    <td className="px-4 py-3 text-amber-100/30 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
