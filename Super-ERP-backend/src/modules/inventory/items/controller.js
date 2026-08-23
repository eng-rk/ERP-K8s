const legacy = require('../../../controllers/inventoryController');
const { validateInventoryItemInput, normalizeSku } = require('./validation');

function createInventoryItem(req, res, next) {
  const errors = validateInventoryItemInput(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });
  req.body = { ...req.body, sku: normalizeSku(req.body.sku) };
  return legacy.createInventoryItem(req, res, next);
}

function updateInventoryItem(req, res, next) {
  const errors = validateInventoryItemInput(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ success: false, errors });
  if (req.body.sku !== undefined) req.body = { ...req.body, sku: normalizeSku(req.body.sku) };
  return legacy.updateInventoryItem(req, res, next);
}

module.exports = {
  getInventoryItems: legacy.getInventoryItems,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem: legacy.deleteInventoryItem,
  getStockLevels: legacy.getStockLevels,
  getStockTransactions: legacy.getStockTransactions,
  getInventoryKPIs: legacy.getInventoryKPIs,
  scanBarcode: legacy.scanBarcode,
  getFefoRecommendation: legacy.getFefoRecommendation,
  getUomConversions: legacy.getUomConversions
};
