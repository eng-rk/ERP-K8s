const mongoose = require('mongoose');

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || ''));

function validateOfferInput(body = {}, { partial = false } = {}) {
  const errors = [];
  if (!partial || body.lead !== undefined) {
    if (!body.lead || !isObjectId(body.lead)) errors.push('lead must be a valid id');
  }
  if (!partial || body.title !== undefined) {
    if (!body.title || !String(body.title).trim()) errors.push('Offer title is required');
  }
  if (!partial || body.description !== undefined) {
    if (!body.description || !String(body.description).trim()) errors.push('Offer description is required');
  }

  if (!partial || body.price !== undefined) {
    const price = Number(body.price);
    if (body.price === undefined || body.price === null || body.price === '' || !Number.isFinite(price)) {
      errors.push('Price is required and must be a valid number');
    } else if (price < 0) {
      errors.push('Price cannot be negative');
    }
  }

  if (!partial || body.validUntil !== undefined) {
    if (!body.validUntil || !String(body.validUntil).trim()) {
      errors.push('Valid until date is required');
    } else if (Number.isNaN(new Date(body.validUntil).getTime())) {
      errors.push('Valid until must be a valid date');
    }
  }

  if (body.catalogProduct !== undefined && body.catalogProduct !== null && body.catalogProduct !== '' && !isObjectId(body.catalogProduct)) {
    errors.push('Invalid catalog product selected');
  }
  return errors;
}

function normalizeOfferPayload(body = {}, currency = {}) {
  return {
    ...body,
    title: body.title === undefined ? body.title : String(body.title).trim(),
    description: body.description === undefined ? body.description : String(body.description).trim(),
    price: body.price === undefined ? body.price : Number(body.price),
    currency: String(body.currency || currency.code || 'USD').trim().toUpperCase(),
    currencySymbol: body.currencySymbol || currency.symbol || '',
    validUntil: body.validUntil === undefined ? body.validUntil : new Date(body.validUntil),
    offerType: body.offerType || 'Service',
    notes: body.notes ? String(body.notes).trim() : ''
  };
}

module.exports = { isObjectId, validateOfferInput, normalizeOfferPayload };
