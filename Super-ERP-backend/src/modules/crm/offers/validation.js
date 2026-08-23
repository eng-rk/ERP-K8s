const mongoose = require('mongoose');

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

function validateOfferPayload(body = {}) {
  const errors = [];
  if (body.leadId !== undefined && !isObjectId(body.leadId)) errors.push('leadId must be a valid id');
  if (body.customerId !== undefined && !isObjectId(body.customerId)) errors.push('customerId must be a valid id');
  if (body.totalAmount !== undefined && (!Number.isFinite(Number(body.totalAmount)) || Number(body.totalAmount) < 0)) errors.push('totalAmount must be a non-negative number');
  if (body.discount !== undefined && (!Number.isFinite(Number(body.discount)) || Number(body.discount) < 0)) errors.push('discount must be a non-negative number');
  if (body.expiresAt !== undefined && Number.isNaN(Date.parse(body.expiresAt))) errors.push('expiresAt must be a valid date');
  return errors;
}

module.exports = { validateOfferPayload };
