const Offer = require('../../models/Offer');
const Lead = require('../../models/Lead');

async function createOffer({ body, user }) {
  const { lead, title, description, price, validUntil, offerType = 'Service', notes, currency = 'USD', currencySymbol = '' } = body || {};
  if (!lead) throw Object.assign(new Error('Lead is required'), { statusCode: 400 });
  const leadDoc = await Lead.findById(lead);
  if (!leadDoc) throw Object.assign(new Error('Lead not found'), { statusCode: 404 });
  if (!title?.trim()) throw Object.assign(new Error('Offer title is required'), { statusCode: 400 });
  if (!description?.trim()) throw Object.assign(new Error('Offer description is required'), { statusCode: 400 });
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice < 0) throw Object.assign(new Error('Price must be a valid non-negative number'), { statusCode: 400 });
  const expiry = new Date(validUntil);
  if (!validUntil || Number.isNaN(expiry.getTime())) throw Object.assign(new Error('Valid until must be a valid date'), { statusCode: 400 });
  if (user?.role === 'Sales Agent' && leadDoc.assignedTo?.toString() !== user._id.toString()) throw Object.assign(new Error('Not authorized to create offers for this lead'), { statusCode: 403 });
  const offer = await Offer.create({ lead: leadDoc._id, createdBy: user._id, title: title.trim(), description: description.trim(), price: numericPrice, currency: String(currency).trim().toUpperCase(), currencySymbol, validUntil: expiry, offerType, notes: notes?.trim() || '' });
  return offer.populate('createdBy', 'firstName lastName role');
}

module.exports = { createOffer };
