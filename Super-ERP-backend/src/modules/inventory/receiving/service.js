const mongoose = require('mongoose');
const { ReceivingOrder } = require('../../../models/Inventory');

const ensureId = (value, name) => {
  if (!mongoose.Types.ObjectId.isValid(value)) throw Object.assign(new Error(`${name} must be a valid id`), { statusCode: 400 });
};

async function createReceivingOrder(payload, userId) {
  ensureId(payload?.supplierId, 'supplierId');
  if (!Array.isArray(payload?.items) || !payload.items.length) throw Object.assign(new Error('At least one receiving item is required'), { statusCode: 400 });
  for (const item of payload.items) {
    ensureId(item.itemId, 'itemId');
    if (!Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0) throw Object.assign(new Error('Receiving quantity must be greater than zero'), { statusCode: 400 });
  }
  return ReceivingOrder.create({ ...payload, createdBy: userId, status: payload.status || 'pending' });
}

async function getReceivingOrders(filter = {}, options = {}) {
  const query = {};
  if (filter.supplierId) { ensureId(filter.supplierId, 'supplierId'); query.supplierId = filter.supplierId; }
  if (filter.status) query.status = filter.status;
  const limit = Math.min(Math.max(Number(options.limit) || 25, 1), 100);
  const page = Math.max(Number(options.page) || 1, 1);
  const [items, total] = await Promise.all([
    ReceivingOrder.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    ReceivingOrder.countDocuments(query)
  ]);
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

module.exports = { createReceivingOrder, getReceivingOrders };
