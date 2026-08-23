const Item = require('../../models/InventoryItem');

async function createItem(payload) {
  const normalized = { ...payload, sku: payload.sku?.trim().toUpperCase() };
  if (normalized.sku) {
    const existing = await Item.findOne({ sku: normalized.sku }).lean();
    if (existing) throw Object.assign(new Error('SKU already exists'), { statusCode: 409 });
  }
  return Item.create(normalized);
}

async function getItem(id) {
  return Item.findById(id).lean();
}

async function listItems(filter = {}, options = {}) {
  const query = {};
  if (filter.categoryId) query.categoryId = filter.categoryId;
  if (filter.warehouseId) query.warehouseId = filter.warehouseId;
  if (filter.sku) query.sku = String(filter.sku).trim().toUpperCase();
  const limit = Math.min(Math.max(Number(options.limit) || 25, 1), 100);
  const page = Math.max(Number(options.page) || 1, 1);
  const [items, total] = await Promise.all([
    Item.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Item.countDocuments(query)
  ]);
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

async function updateItem(id, updates) {
  if (updates.sku) updates.sku = updates.sku.trim().toUpperCase();
  const item = await Item.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
  if (!item) throw Object.assign(new Error('Inventory item not found'), { statusCode: 404 });
  return item;
}

module.exports = { createItem, getItem, listItems, updateItem };
