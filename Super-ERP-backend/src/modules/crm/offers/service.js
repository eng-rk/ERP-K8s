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

  return {
    lead: body.lead,
    title,
    description,
    price: parsePrice(body.price),
    validUntil: parseValidUntil(body.validUntil),
    offerType: body.offerType || 'Service',
    catalogProduct: parseCatalogProduct(body.catalogProduct),
    currency: String(body.currency || 'USD').trim().toUpperCase(),
    currencySymbol: body.currencySymbol || '',
    notes: body.notes ? String(body.notes).trim() : ''
  };
}

function assertOwnerOrAdmin(offer, user) {
  const admin = ['Super CRM Administrator', 'System Architect'].includes(user?.role);
  const owner = offer?.createdBy && user?._id && offer.createdBy.toString() === user._id.toString();
  if (!admin && !owner) throw Object.assign(new Error('Not authorized to update this offer'), { statusCode: 403 });
}

function assertDraftOrAdmin(offer, user) {
  const admin = ['Super CRM Administrator', 'System Architect'].includes(user?.role);
  if (!admin && offer?.status !== 'Draft') {
    throw Object.assign(new Error('Sent offers cannot be edited'), { statusCode: 403 });
  }
}

function assertValidPriceForOfferType(price, offerType, minimum = 0) {
  const parsed = parsePrice(price);
  if (parsed < Number(minimum || 0)) {
    throw Object.assign(
      new Error(`Minimum price for ${offerType === 'Product' ? 'product' : 'offer'} is ${Number(minimum || 0).toFixed(2)}`),
      { statusCode: 400 }
    );
  }
  return parsed;
}

module.exports = {
  parsePrice,
  parseValidUntil,
  parseCatalogProduct,
  normalizeCreatePayload,
  assertOwnerOrAdmin,
  assertDraftOrAdmin,
  assertValidPriceForOfferType
};
