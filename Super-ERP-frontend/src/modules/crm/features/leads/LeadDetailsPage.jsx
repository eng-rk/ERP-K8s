import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import API, { API_HOST } from '../../../../services/api';
import OfferHistoryModal from '../offers/components/OfferHistoryModal';
import OfferVersionsModal from '../offers/components/OfferVersionsModal';
import { Icon } from '../../../../components/Icons';
import { Icon as LucideIcon } from '../../../../utils/iconMapper';
import EmailComposer from '../email/EmailComposer';
import { normalizeCurrencies, validateOfferPrice } from '../offers/utils/offerHelpers';

const statusBadge = (status) => {
  const map = {
    New: 'badge-new', Contacted: 'badge-contacted', Qualified: 'badge-qualified', Lost: 'badge-lost', Converted: 'badge-converted', Draft: 'badge-new', Sent: 'badge-contacted', Viewed: 'badge-qualified', Accepted: 'badge-converted', Rejected: 'badge-lost', Expired: 'badge-meta', Completed: 'badge-completed', Canceled: 'badge-lost', Refunded: 'badge-meta'
  };
  return map[status] || 'badge-new';
};

const STATUSES = ['New', 'Contacted', 'Qualified', 'Lost', 'Converted'];

const LeadDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = ['Super CRM Administrator', 'System Architect'].includes(user?.role);
  const [lead, setLead] = useState(null);
  const [offers, setOffers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatingLead, setUpdatingLead] = useState(false);
  const [currencies, setCurrencies] = useState([]);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [pricingSettings, setPricingSettings] = useState({});
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [composerOffer, setComposerOffer] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyOpenId, setHistoryOpenId] = useState(null);
  const [showReviseModal, setShowReviseModal] = useState(false);
  const [reviseOpenId, setReviseOpenId] = useState(null);
  const [revisionRequirement, setRevisionRequirement] = useState('');
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [versionsOpenId, setVersionsOpenId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [newOffer, setNewOffer] = useState({ title: '', description: '', offerType: 'Service', catalogProduct: '', price: '', validUntil: '', notes: '', currency: '' });
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUploadTarget, setImageUploadTarget] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageCaption, setImageCaption] = useState('');

  const fetchData = async () => {
    try {
      const [leadRes, offersRes] = await Promise.all([API.get(`/leads/${id}`), API.get(`/offers/lead/${id}`)]);
      setLead(leadRes.data.data); setOffers(offersRes.data.data || []);
    } catch (err) { setError(err.response?.data?.message || 'Failed to load data'); }
    finally { setLoading(false); }
  };
  const fetchTemplates = async () => { try { const res = await API.get('/offers/templates'); setTemplates(res.data.data || []); } catch (err) { console.error('Failed to load templates:', err); } };
  const fetchProducts = async () => { try { const res = await API.get('/products'); setProducts(res.data.data || []); } catch (err) { console.error('Failed to load products:', err); } };
  useEffect(() => { fetchData(); fetchTemplates(); fetchProducts(); }, [id]);
  useEffect(() => {
    const fetchCurrenciesAndSettings = async () => {
      let defCurr = 'USD';
      try {
        const currenciesRes = await API.get('/settings/currencies'); const normalized = normalizeCurrencies(currenciesRes.data.data?.currencies || []); defCurr = currenciesRes.data.data?.defaultCurrency || normalized[0]?.code || 'USD'; setCurrencies(normalized); setDefaultCurrency(defCurr); setNewOffer(p => ({ ...p, currency: defCurr }));
      } catch (err) { console.error('Failed to load currency settings:', err); setCurrencies(normalizeCurrencies([{ code: 'USD', name: 'US Dollar', symbol: '$' }])); setDefaultCurrency('USD'); setNewOffer(p => ({ ...p, currency: 'USD' })); }
      try { const pricingRes = await API.get('/settings/pricing'); setPricingSettings(pricingRes.data.data || {}); } catch (err) { console.log('Non-critical: Failed to load pricing configuration settings.', err.message); setPricingSettings({}); }
    }; fetchCurrenciesAndSettings();
  }, []);
  useEffect(() => { if (selectedTemplate) { const template = templates.find(t => t._id === selectedTemplate); if (template) { const validUntilDate = new Date(); validUntilDate.setDate(validUntilDate.getDate() + (template.validDays || 30)); setNewOffer(prev => ({ ...prev, title: template.title, description: template.description, price: template.price.toString(), validUntil: validUntilDate.toISOString().split('T')[0] })); } } }, [selectedTemplate, templates]);
  const updateLeadStatus = async (newStatus) => { setUpdatingLead(true); try { const { data } = await API.put(`/leads/${id}`, { status: newStatus }); setLead(data.data); } catch (err) { setError(err.response?.data?.message || 'Failed to update lead'); } finally { setUpdatingLead(false); } };
  const handleCreateOffer = async () => {
    if (!newOffer.title.trim()) return setError('Offer title is required'); if (!newOffer.description.trim()) return setError('Offer description is required'); const priceError = validateOfferPrice(newOffer.price, newOffer.offerType, pricingSettings); if (priceError) return setError(priceError); if (!newOffer.validUntil) return setError('Valid until date is required'); setSaving(true); setError('');
    try { const selectedCurrency = currencies.find(c => c.code === newOffer.currency) || null; await API.post('/offers', { ...newOffer, lead: id, price: parseFloat(newOffer.price), currency: newOffer.currency || defaultCurrency || 'USD', currencySymbol: selectedCurrency?.symbol || '' }); await fetchData(); setShowOfferModal(false); setNewOffer({ title: '', description: '', offerType: 'Service', catalogProduct: '', price: '', validUntil: '', notes: '', currency: defaultCurrency }); setSelectedTemplate(''); } catch (err) { const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to create offer'; setError(msg); } finally { setSaving(false); }
  };
  const handleUpdateOffer = async () => { if (!editingOffer.title.trim()) return setError('Offer title is required'); if (!editingOffer.description.trim()) return setError('Offer description is required'); if (!editingOffer.price || isNaN(parseFloat(editingOffer.price))) return setError('Valid price is required'); if (!editingOffer.validUntil) return setError('Valid until date is required'); setSaving(true); setError(''); try { await API.put(`/offers/${editingOffer._id}`, { ...editingOffer, price: parseFloat(editingOffer.price) }); await fetchData(); setShowEditModal(false); setEditingOffer(null); } catch (err) { const msg = err.response?.data?.error || err.response?.data?.message || 'Failed to update offer'; setError(msg); } finally { setSaving(false); } };
  const openEditModal = (offer) => { setEditingOffer({ ...offer, price: offer.price.toString(), validUntil: offer.validUntil.split('T')[0] }); setShowEditModal(true); };
  const handleSend = async (offerId) => { const offer = offers.find(o => o._id === offerId); if (!offer) return; setComposerOffer(offer); setShowEmailComposer(true); };
  const handleEmailSent = async () => { setSendingId(composerOffer._id); setError(''); try { await API.post(`/offers/${composerOffer._id}/send`, { method: 'Email' }); await fetchData(); setSuccess('Email sent successfully'); setTimeout(() => { setShowEmailComposer(false); setComposerOffer(null); setSuccess(''); }, 1500); } catch (err) { setError(err.response?.data?.message || 'Failed to send email'); } finally { setSendingId(null); } };
  const handleDelete = async (offerId) => { if (!confirm('Delete this offer?')) return; try { await API.delete(`/offers/${offerId}`); await fetchData(); } catch (err) { setError(err.response?.data?.message || 'Failed to delete offer'); } };
  const handleRevise = async (offerId) => { if (!revisionRequirement.trim()) return setError('Please describe the customer requirement.'); setError(''); try { await API.post(`/offers/${offerId}/revise`, { requirement: revisionRequirement }); setShowReviseModal(false); setReviseOpenId(null); setRevisionRequirement(''); await fetchData(); } catch (err) { setError(err.response?.data?.message || 'Failed to revise offer'); } };
  const handleUpdateOfferStatus = async (offerId, status) => { try { await API.put(`/offers/${offerId}`, { status }); await fetchData(); } catch (err) { setError(err.response?.data?.message || 'Failed to update status'); } };
  const handleUploadImage = async (e) => { if (e) e.preventDefault(); if (!selectedFile) return setError('Please select an image file first'); setSaving(true); setError(''); const formData = new FormData(); formData.append('image', selectedFile); if (imageCaption) formData.append('caption', imageCaption); try { await API.post(`/offers/${imageUploadTarget}/images`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }); await fetchData(); setShowImageModal(false); setImageUploadTarget(null); setSelectedFile(null); setImageCaption(''); } catch (err) { setError(err.response?.data?.message || 'Failed to upload image'); } finally { setSaving(false); } };
  const handleDeleteImage = async (offerId, imageId) => { if (!confirm('Are you sure you want to delete this image?')) return; try { await API.delete(`/offers/${offerId}/images/${imageId}`); await fetchData(); } catch (err) { setError(err.response?.data?.message || 'Failed to delete image'); } };
  if (loading) return <div className="loading-state"><div className="spinner" />Loading lead details…</div>;
  if (!lead) return <div className="empty-state"><p>Lead not found</p></div>;
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><button onClick={() => navigate('/leads')} className="sidebar-link" style={{ width: 'auto', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>Back to Leads</button></div></div>
      {error && <div className="alert alert-error" style={{ marginBottom: 20 }}>{error}</div>}
      {success && <div className="alert alert-success" style={{ marginBottom: 20 }}>{success}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
        <div className="table-wrapper" style={{ padding: 24 }}><h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{lead.name}</h2><div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}><div><div>Email</div><div>{lead.email}</div></div>{lead.phone && <div><div>Phone</div><div>{lead.phone}</div></div>}<div><div>Lead Status</div><select value={lead.status} onChange={e => updateLeadStatus(e.target.value)} disabled={updatingLead}>{STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select></div></div></div>
        <div className="table-wrapper" style={{ padding: 24 }}><h3>Offers</h3>{offers.map(offer => <div key={offer._id}>{offer.title}</div>)}</div>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
