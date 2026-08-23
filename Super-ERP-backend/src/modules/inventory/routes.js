const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/authorize');
const {
  postInventoryAdjustment, createShipment, createCycleCount, createPhysicalInventory,
  getWarehouses, createWarehouse, updateWarehouse,
  getLots, getSerials, approveAdjustment, rejectAdjustment,
  createAdjustment, getAdjustments, getCycleCounts, getPhysicalInventories,
  getInventoryValuation, getABCClassification, getDeadStockReport,
  getReorderAlerts, getExpiryAlerts, getPutawaySuggestion
} = require('../../controllers/inventoryController');
const { getValuationDetailed } = require('../../controllers/inventoryExtensionsController');
const itemRoutes = require('./items/routes');
const receivingRoutes = require('./receiving/routes');
const shippingRoutes = require('./shipping/routes');
const transferRoutes = require('./transfers/routes');
router.use(protect);
router.use(itemRoutes);
router.use(receivingRoutes);
router.use(shippingRoutes);
router.use('/transfers', transferRoutes);
router.post('/adjustments/:id/post', checkPermission('wms.adjustments.approve'), postInventoryAdjustment);
router.post('/adjustments/:id/approve', checkPermission('wms.adjustments.approve'), approveAdjustment);
router.post('/adjustments/:id/reject', checkPermission('wms.adjustments.reject'), rejectAdjustment);
router.post('/adjustments', checkPermission('wms.adjustments.create_request'), createAdjustment);
router.get('/adjustments', checkPermission('wms.adjustments.view'), getAdjustments);
router.post('/cycle-counts', checkPermission('wms.audits.cycle_count'), createCycleCount);
router.get('/cycle-counts', checkPermission('wms.items.view'), getCycleCounts);
router.post('/physical-inventories', checkPermission('wms.audits.physical_inventory'), createPhysicalInventory);
router.get('/physical-inventories', checkPermission('wms.items.view'), getPhysicalInventories);
router.get('/warehouses', checkPermission('wms.items.view'), getWarehouses);
router.post('/warehouses', checkPermission('wms.items.create'), createWarehouse);
router.put('/warehouses/:id', checkPermission('wms.items.edit'), updateWarehouse);
router.get('/lots', checkPermission('wms.items.view'), getLots);
router.get('/serials', checkPermission('wms.items.view'), getSerials);
router.get('/reports/valuation', checkPermission('wms.items.view'), getInventoryValuation);
router.get('/reports/valuation-detailed', checkPermission('wms.items.view'), getValuationDetailed);
router.get('/reports/abc', checkPermission('wms.items.view'), getABCClassification);
router.get('/reports/dead-stock', checkPermission('wms.items.view'), getDeadStockReport);
router.get('/alerts/reorder', checkPermission('wms.items.view'), getReorderAlerts);
router.get('/alerts/expiry', checkPermission('wms.items.view'), getExpiryAlerts);
router.get('/putaway/suggest', checkPermission('wms.items.view'), getPutawaySuggestion);
module.exports = router;
