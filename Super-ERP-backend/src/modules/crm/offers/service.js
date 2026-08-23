const mongoose = require('mongoose');

function parsePrice(value) {
  const price = Number(value);
  if (value === undefined || value === null || value === '' || !Number.isFinite(price) || price < 0) {
    throw new Error('Price must be a valid non-negative number');
  }
  return price;
}

function parseValidUntil(value) {
  if (!value) throw new Error('Valid until date is required');
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('Valid until must be a valid date');
  return date;
}

function parseCatalogProduct(value) {
  if (!value) return null;
  if (!mongoose.Types.ObjectId.isValid(String(value))) throw new Error('Invalid catalog product selected');
  return new mongoose.Types.ObjectId(String(value));
}

function normalizeCreatePayload(body = {}) {
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  if (!body.lead || !String(body.lead).trim()) throw new Error('Lead is required');
  if (!title) throw new Error('Offer title is required');
  if (!description) throw new Error('Offer description is required');
  const currency = String(body.currency || 'USD').trim().toUpperCase();
  return {
    lead: body.lead,
    title,
    description,
    price: parsePrice(body.price),
    validUntil: parseValidUntil(body.validUntil),
    offerType: body.offerType || 'Service',
    catalogProduct: parseCatalogProduct(body.catalogProduct),
    currency,
    currencySymbol: body.currencySymbol || '',
    notes: body.notes ? String(body.notes).trim() : ''
  };
}

module.exports = { parsePrice, parseValidUntil, parseCatalogProduct, normalizeCreatePayload };
