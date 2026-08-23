const mongoose = require('mongoose');

const VALID_STATUSES = ['Active', 'Inactive', 'Discontinued'];
const isObjectId = (value) => mongoose.Types.ObjectId.isValid(String(value || ''));

function validateInventoryItemInput(body = {}, { partial = false } = {}) {
  const errors = [];
  if (!partial || body.sku !== undefined) {
    if (!body.sku || typeof body.sku !== 'string' || !body.sku.trim()) errors.push('SKU is required');
  }
  if (!partial || body.name !== undefined) {
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) errors.push('Name is required');
  }
  if (body.unitCost !== undefined && (!Number.isFinite(Number(body.unitCost)) || Number(body.unitCost) < 0)) errors.push('unitCost must be a non-negative number');
  if (body.sellingPrice !== undefined && (!Number.isFinite(Number(body.sellingPrice)) || Number(body.sellingPrice) < 0)) errors.push('sellingPrice must be a non-negative number');
  if (body.weight !== undefined && (!Number.isFinite(Number(body.weight)) || Number(body.weight) < 0)) errors.push('weight must be a non-negative number');
  if (body.reorderPoint !== undefined && (!Number.isFinite(Number(body.reorderPoint)) || Number(body.reorderPoint) < 0)) errors.push('reorderPoint must be a non-negative number');
  if (body.maxStockLevel !== undefined && (!Number.isFinite(Number(body.maxStockLevel)) || Number(body.maxStockLevel) < 0)) errors.push('maxStockLevel must be a non-negative number');
  if (body.minOrderQty !== undefined && (!Number.isFinite(Number(body.minOrderQty)) || Number(body.minOrderQty) < 0)) errors.push('minOrderQty must be a non-negative number');
  if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) errors.push('Invalid inventory item status');
  if (body.createdBy !== undefined && !isObjectId(body.createdBy)) errors.push('createdBy must be a valid id');
  if (body.alternateUoms !== undefined && !Array.isArray(body.alternateUoms)) errors.push('alternateUoms must be an array');
  if (body.tags !== undefined && !Array.isArray(body.tags)) errors.push('tags must be an array');
  return errors;
}

function normalizeSku(sku) {
  return String(sku || '').trim().toUpperCase();
}

module.exports = { VALID_STATUSES, isObjectId, validateInventoryItemInput, normalizeSku };
