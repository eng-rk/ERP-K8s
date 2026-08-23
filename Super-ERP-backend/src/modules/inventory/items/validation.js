const mongoose = require('mongoose');

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

function validateInventoryItemPayload(body = {}) {
  const errors = [];
  if (!body.name || typeof body.name !== 'string' || !body.name.trim()) errors.push('name is required');
  if (body.categoryId !== undefined && !isObjectId(body.categoryId)) errors.push('categoryId must be a valid id');
  if (body.warehouseId !== undefined && !isObjectId(body.warehouseId)) errors.push('warehouseId must be a valid id');
  if (body.sku !== undefined && (typeof body.sku !== 'string' || !body.sku.trim())) errors.push('sku must be a non-empty string');
  if (body.reorderPoint !== undefined && (!Number.isFinite(Number(body.reorderPoint)) || Number(body.reorderPoint) < 0)) errors.push('reorderPoint must be a non-negative number');
  return errors;
}

module.exports = { validateInventoryItemPayload };
