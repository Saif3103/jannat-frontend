import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi';
import api, { BASE_URL } from '../../api/axios';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import { useSettingsStore } from '../../store';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingTeam, setUploadingTeam] = useState({});
  const [activeTab, setActiveTab] = useState('general');
  const [contacts, setContacts] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newTestimonial, setNewTestimonial] = useState({ name: '', location: '', rating: 5, comment: '' });
  const [previews, setPreviews] = useState({});

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('blob:')) return url;
    return `${BASE_URL}/${url}`;
  };

  const TEAM_FIELDS = ['founderImage', 'sahanaImage', 'saifImage', 'coFounderImage'];

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setPreviews(prev => ({
        ...prev,
        [name]: URL.createObjectURL(files[0])
      }));
    }
  };

  // Team images upload instantly when selected (separate dedicated endpoint)
  const handleTeamImageChange = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreviews(prev => ({ ...prev, [field]: previewUrl }));

    // Upload instantly
    setUploadingTeam(prev => ({ ...prev, [field]: true }));
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('field', field);
      const res = await api.post('/settings/upload-team-image', fd, { timeout: 120000 });
      if (res.data.success) {
        toast.success('Image uploaded successfully!');
        setSettings(prev => ({ ...prev, [field]: res.data.url }));
        useSettingsStore.getState().fetchSettings();
      }
    } catch (err) {
      console.error('Team image upload error:', err?.response?.data || err);
      toast.error(err?.response?.data?.message || 'Upload failed. Please try again.');
      // Revert preview on error
      setPreviews(prev => ({ ...prev, [field]: null }));
    } finally {
      setUploadingTeam(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    // Remove empty video fields
    ['heroVideo', 'adVideo'].forEach(field => {
      const file = fd.get(field);
      if (file && file instanceof File && file.size === 0) fd.delete(field);
    });

    // Remove team image fields — they are handled by dedicated instant-upload
    TEAM_FIELDS.forEach(f => fd.delete(f));

    const socialLinks = {
      facebook: fd.get('facebook') || '',
      instagram: fd.get('instagram') || '',
      youtube: fd.get('youtube') || '',
      whatsapp: fd.get('whatsapp') || ''
    };
    fd.append('socialLinks', JSON.stringify(socialLinks));
    ['facebook', 'instagram', 'youtube', 'whatsapp'].forEach(k => fd.delete(k));

    await save(fd);
    setPreviews({});
  };

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data.settings)).finally(() => setLoading(false));
    api.get('/contacts').then(r => setContacts(r.data.contacts)).catch(() => {});
  }, []);

  const save = async (data) => {
    setSaving(true);
    try {
      // IMPORTANT: Do NOT set Content-Type manually for FormData.
      // The browser must auto-set it with the multipart boundary string.
      // Manually setting 'multipart/form-data' WITHOUT boundary causes multer to fail.
      await api.put('/settings', data, { timeout: 120000 });
      toast.success('Settings saved!');
      api.get('/settings').then(r => {
        setSettings(r.data.settings);
        useSettingsStore.getState().fetchSettings();
      });
    } catch (err) {
      console.error('Settings save error:', err?.response?.data || err);
      const errMsg = err?.response?.data?.message || err.message || 'Failed to save settings';
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
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

  if (loading) return <AdminLayout><div className="text-[#1A1A1A]/30 text-center py-20">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <Helmet><title>Settings | Admin</title></Helmet>
      
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure global site parameters and brand assets</p>
      </div>

      <div className="flex gap-4 mb-8 p-1.5 bg-gray-100 rounded-2xl w-fit flex-wrap">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-900'}`}>
            {tab === 'messages' ? 'Contact Messages' : tab}
          </button>
        ))}
      </div>

      <div className="max-w-4xl">
        {/* GENERAL */}
        {activeTab === 'general' && settings && (
          <form onSubmit={handleFormSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Company Information</h2>
                {[
                  { name: 'siteName', label: 'Store Name', defaultValue: settings.siteName, placeholder: 'Jannat Rugs Co.' },
                  { name: 'email', label: 'Support Email', defaultValue: settings.email, placeholder: 'support@jannatrugs.com' },
                  { name: 'phone1', label: 'Primary Phone', defaultValue: settings.phone1, placeholder: '+91 999 999 9999' },
                  { name: 'phone2', label: 'Secondary Phone', defaultValue: settings.phone2, placeholder: '+91 888 888 8888' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="text-[11px] font-bold text-gray-400 block mb-2 uppercase tracking-widest">{f.label}</label>
                    <input name={f.name} defaultValue={f.defaultValue} placeholder={f.placeholder} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                  </div>
                ))}
                <div>
                  <label className="text-[11px] font-bold text-gray-400 block mb-2 uppercase tracking-widest">Office Address</label>
                  <textarea name="address" defaultValue={settings.address} rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none" />
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Social Presence</h2>
                  {['facebook', 'instagram', 'youtube', 'whatsapp'].map(s => (
                    <div key={s}>
                      <label className="text-[11px] font-bold text-gray-400 block mb-2 uppercase tracking-widest">{s}</label>
                      <input name={s} defaultValue={settings.socialLinks?.[s]} placeholder={`https://${s}.com/jannatrugs`} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                    </div>
                  ))}
                </div>

                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">SEO Configuration</h2>
                  {[
                    { name: 'seoTitle', label: 'Meta Title', defaultValue: settings.seoTitle },
                    { name: 'seoDescription', label: 'Meta Description', defaultValue: settings.seoDescription },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="text-[11px] font-bold text-gray-400 block mb-2 uppercase tracking-widest">{f.label}</label>
                      <input name={f.name} defaultValue={f.defaultValue} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Hero Video Asset</h2>
                <div className="space-y-4">
                  {(previews.heroVideo || settings.heroVideo) && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-inner">
                      <video src={previews.heroVideo || getImageUrl(settings.heroVideo)} className="w-full h-full object-cover" muted controls />
                    </div>
                  )}
                  <label className="flex items-center gap-4 px-6 py-5 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 shadow-sm transition-all"><FiUpload size={20} /></div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">{(previews.heroVideo || settings.heroVideo) ? 'Replace Asset' : 'Upload Hero Video'}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">MP4 format recommended</p>
                    </div>
                    <input name="heroVideo" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Ad Section Video</h2>
                <div className="space-y-4">
                  {(previews.adVideo || settings.adVideo) && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shadow-inner">
                      <video src={previews.adVideo || getImageUrl(settings.adVideo)} className="w-full h-full object-cover" muted controls />
                    </div>
                  )}
                  <label className="flex items-center gap-4 px-6 py-5 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all group">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 shadow-sm transition-all"><FiUpload size={20} /></div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">{(previews.adVideo || settings.adVideo) ? 'Replace Asset' : 'Upload Ad Video'}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">MP4 format recommended</p>
                    </div>
                    <input name="adVideo" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Leadership Asset Management</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

                {/* Azeem Ansari */}
                <div className="space-y-3 text-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">Azeem Ansari<br/><span className="text-gray-300 font-normal normal-case">Founder</span></label>
                  <label className="relative mx-auto w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-gray-50 group shadow-inner">
                    {uploadingTeam.founderImage ? (
                      <div className="flex flex-col items-center gap-2"><div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /><span className="text-[9px] text-blue-500 font-bold">Uploading...</span></div>
                    ) : (previews.founderImage || settings.founderImage) ? (
                      <><img src={previews.founderImage || getImageUrl(settings.founderImage)} alt="Founder" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><FiUpload className="text-white" size={20} /></div></>
                    ) : (<div className="flex flex-col items-center gap-1"><FiUpload className="text-gray-300" size={24} /><span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Upload Photo</span></div>)}
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={e => handleTeamImageChange(e, 'founderImage')} className="hidden" />
                  </label>
                </div>

                {/* Sahana Ansari */}
                <div className="space-y-3 text-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">Sahana Ansari<br/><span className="text-gray-300 font-normal normal-case">Co-Founder</span></label>
                  <label className="relative mx-auto w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-pink-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-gray-50 group shadow-inner">
                    {uploadingTeam.sahanaImage ? (
                      <div className="flex flex-col items-center gap-2"><div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" /><span className="text-[9px] text-pink-500 font-bold">Uploading...</span></div>
                    ) : (previews.sahanaImage || settings.sahanaImage) ? (
                      <><img src={previews.sahanaImage || getImageUrl(settings.sahanaImage)} alt="Sahana" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><FiUpload className="text-white" size={20} /></div></>
                    ) : (<div className="flex flex-col items-center gap-1"><FiUpload className="text-gray-300" size={24} /><span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Upload Photo</span></div>)}
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={e => handleTeamImageChange(e, 'sahanaImage')} className="hidden" />
                  </label>
                </div>

                {/* Saif Ali */}
                <div className="space-y-3 text-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">Saif Ali<br/><span className="text-gray-300 font-normal normal-case">Developer & Marketing</span></label>
                  <label className="relative mx-auto w-full aspect-square rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-gray-50 group shadow-inner">
                    {uploadingTeam.saifImage ? (
                      <div className="flex flex-col items-center gap-2"><div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /><span className="text-[9px] text-blue-500 font-bold">Uploading...</span></div>
                    ) : (previews.saifImage || settings.saifImage) ? (
                      <><img src={previews.saifImage || getImageUrl(settings.saifImage)} alt="Saif" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><FiUpload className="text-white" size={20} /></div></>
                    ) : (<div className="flex flex-col items-center gap-1"><FiUpload className="text-gray-300" size={24} /><span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Upload Photo</span></div>)}
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={e => handleTeamImageChange(e, 'saifImage')} className="hidden" />
                  </label>
                </div>

              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={saving} 
                className="bg-[#222] text-white px-12 py-4 rounded-2xl font-bold tracking-[0.1em] shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50">
                {saving ? 'UPDATING SYSTEM...' : 'SAVE ALL SETTINGS'}
              </button>
            </div>
          </form>
        )}

        {/* CHATBOT FAQs */}
        {activeTab === 'chatbot' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Automated Support FAQs</h2>
              <div className="space-y-4">
                {settings?.chatbotFaqs?.map((faq, i) => (
                  <div key={i} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl group hover:bg-white hover:border-blue-100 transition-all shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-gray-900 font-bold text-sm">{faq.question}</p>
                        <p className="text-gray-500 text-xs mt-2 font-medium leading-relaxed">{faq.answer}</p>
                      </div>
                      <button onClick={() => removeFaq(i)} className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><FiTrash2 size={16} /></button>
                    </div>
                  </div>
                ))}
                {settings?.chatbotFaqs?.length === 0 && <p className="text-center py-10 text-gray-400 text-sm font-medium italic">No FAQs configured yet.</p>}
              </div>
            </div>

            <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 space-y-6">
              <h3 className="text-gray-900 font-bold text-base flex items-center gap-2"><FiPlus className="text-blue-600"/> Add New Response Pair</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-2 uppercase tracking-widest">Customer Query</label>
                  <input value={newFaq.question} onChange={e => setNewFaq(p => ({ ...p, question: e.target.value }))} placeholder="What is your return policy?" className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-500 block mb-2 uppercase tracking-widest">Bot Answer</label>
                  <textarea value={newFaq.answer} onChange={e => setNewFaq(p => ({ ...p, answer: e.target.value }))} placeholder="We offer a 7-day hassle-free return policy..." rows={3} className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:ring-4 focus:ring-blue-100 outline-none transition-all resize-none" />
                </div>
                <button onClick={addFaq} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"><FiPlus/> Register FAQ</button>
              </div>
            </div>
          </div>
        )}

        {/* TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Published Customer Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {settings?.testimonials?.map((t, i) => (
                    <div key={i} className="p-6 bg-gray-50 border border-gray-100 rounded-2xl flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 font-bold text-lg shadow-sm border border-gray-100 flex-shrink-0">{t.name?.[0]}</div>
                      <div className="min-w-0">
                        <p className="text-gray-900 font-bold text-sm truncate">{t.name}</p>
                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">{t.location}</p>
                        <p className="text-gray-500 text-xs mt-3 italic leading-relaxed font-medium line-clamp-3">"{t.comment}"</p>
                      </div>
                    </div>
                  ))}
                  {settings?.testimonials?.length === 0 && <div className="col-span-full text-center py-10 text-gray-400 text-sm font-medium italic">No testimonials added yet.</div>}
                </div>
             </div>

             <div className="bg-indigo-50/50 p-8 rounded-3xl border border-indigo-100">
                <h3 className="text-gray-900 font-bold text-base mb-6 flex items-center gap-2"><FiPlus className="text-indigo-600"/> Add Verified Testimonial</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 block mb-2 uppercase tracking-widest">Customer Name</label>
                    <input value={newTestimonial.name} onChange={e => setNewTestimonial(p => ({ ...p, name: e.target.value }))} className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 block mb-2 uppercase tracking-widest">Location</label>
                    <input value={newTestimonial.location} onChange={e => setNewTestimonial(p => ({ ...p, location: e.target.value }))} className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="text-[11px] font-bold text-gray-500 block mb-2 uppercase tracking-widest">Customer Feedback</label>
                  <textarea value={newTestimonial.comment} onChange={e => setNewTestimonial(p => ({ ...p, comment: e.target.value }))} rows={3} className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none resize-none" />
                </div>
                <button onClick={async () => {
                  const updated = [...(settings.testimonials || []), newTestimonial];
                  await save({ testimonials: JSON.stringify(updated) });
                  setNewTestimonial({ name: '', location: '', rating: 5, comment: '' });
                }} className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-all flex items-center justify-center gap-2"><FiPlus/> Publish Story</button>
             </div>
          </div>
        )}

        {/* MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Customer', 'Message Details', 'Date Received'].map(h => (
                      <th key={h} className="text-left px-8 py-5 text-gray-500 text-[11px] font-bold uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contacts.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-20 text-gray-400 font-medium italic">Your inbox is currently empty.</td></tr>
                  ) : contacts.map(c => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold border border-gray-200 group-hover:bg-white transition-colors">{c.name?.[0]}</div>
                          <div>
                            <p className="text-gray-900 font-bold text-sm">{c.name}</p>
                            <p className="text-gray-400 text-[10px] font-medium mt-0.5">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-gray-600 text-xs font-medium leading-relaxed max-w-md">"{c.message}"</p>
                        {c.phone && <p className="text-[10px] text-blue-500 font-bold mt-2 tracking-wider">TEL: {c.phone}</p>}
                      </td>
                      <td className="px-8 py-6 text-gray-400 text-xs font-bold tracking-tight">
                        {new Date(c.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
