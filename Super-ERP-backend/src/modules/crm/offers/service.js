const formatCurrency = (value, currencyCode = 'USD', currencySymbol = '') => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return `${currencySymbol || currencyCode || 'USD'}0.00`;
  const normalized = String(currencyCode || 'USD').trim().toUpperCase();
  const symbol = currencySymbol || (normalized === 'USD' ? '$' : normalized === 'EUR' ? '€' : normalized === 'EGP' ? 'E£' : '');
  const formatted = numericValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return symbol ? `${symbol}${formatted}` : `${normalized} ${formatted}`;
};

const formatOfferDate = (value) => {
  if (!value) return 'TBD';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'TBD' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getLeadDisplayName = (lead) => {
  if (!lead) return 'there';
  if (lead.name && String(lead.name).trim()) return String(lead.name).trim();
  return [lead.firstName, lead.lastName].filter(Boolean).map(String).map(v => v.trim()).filter(Boolean).join(' ') || 'there';
};

const buildOfferEmailData = (offer, req, branding, payLink) => {
  const lead = offer?.lead || {};
  const leadName = getLeadDisplayName(lead);
  const firstName = req?.user?.firstName || '';
  const lastName = req?.user?.lastName || '';
  return {
    companyName: branding?.companyName || 'Super CRM',
    companyLogo: branding?.companyLogo || '',
    currency: offer?.currency || 'USD',
    currencySymbol: offer?.currencySymbol || '',
    lead: { name: leadName, firstName: lead.firstName || leadName.split(' ')[0] || '', lastName: lead.lastName || leadName.split(' ').slice(1).join(' ') || '', email: lead.email || '', phone: lead.phone || '' },
    offer: { title: offer?.title || 'Proposal', description: offer?.description || 'A tailored solution prepared for your review.', price: offer?.price || 0, currency: offer?.currency || 'USD', currencySymbol: offer?.currencySymbol || '', validUntil: offer?.validUntil || null, id: offer?._id ? offer._id.toString().slice(-6).toUpperCase() : 'OFFER' },
    payLink,
    sender: { firstName, lastName, name: [firstName, lastName].filter(Boolean).join(' ') || 'Super CRM Team' }
  };
};

const replaceOfferPlaceholders = (content, data) => {
  if (!content || typeof content !== 'string') return '';
  const special = {
    'offer.price': formatCurrency(data?.offer?.price || 0, data?.offer?.currency || data?.currency || 'USD', data?.offer?.currencySymbol || data?.currencySymbol || ''),
    'offer.validUntil': formatOfferDate(data?.offer?.validUntil),
    'offer.id': data?.offer?.id || '', 'lead.name': data?.lead?.name || '', 'lead.firstName': data?.lead?.firstName || '', 'lead.lastName': data?.lead?.lastName || '', 'lead.email': data?.lead?.email || '', 'offer.title': data?.offer?.title || '', 'offer.description': data?.offer?.description || '', 'payLink': data?.payLink || '', 'companyName': data?.companyName || '', 'sender.firstName': data?.sender?.firstName || '', 'sender.lastName': data?.sender?.lastName || '', 'sender.name': data?.sender?.name || ''
  };
  return content.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (match, key) => {
    if (special[key] !== undefined) return special[key];
    const value = key.split('.').reduce((current, segment) => current && typeof current === 'object' ? current[segment] : '', data);
    return value === null || value === undefined ? '' : String(value);
  });
};

module.exports = { formatCurrency, formatOfferDate, getLeadDisplayName, buildOfferEmailData, replaceOfferPlaceholders };
