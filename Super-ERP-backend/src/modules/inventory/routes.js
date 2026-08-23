const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth');
const { checkPermission } = require('../../middleware/authorize');
const {
  postGoodsIssue, createStockTransfer, postInventoryAdjustment,
  createShipment, createCycleCount, createPhysicalInventory,
  getWarehouses, createWarehouse, updateWarehouse,
  getLots, getSerials, approveAdjustment, rejectAdjustment,
  getShipments, createTransfer, getTransfers,
  createAdjustment, getAdjustments, getCycleCounts, getPhysicalInventories,
  createPickTask, getPickTasks, getPickTask, updatePickTask, releasePickWave,
  getInventoryValuation, getABCClassification, getDeadStockReport,
  getReorderAlerts, getExpiryAlerts, getPutawaySuggestion
} = require('../../controllers/inventoryController');
const { getValuationDetailed } = require('../../controllers/inventoryExtensionsController');
const itemRoutes = require('./items/routes');
const receivingRoutes = require('./receiving/routes');

router.use(protect);
router.use(itemRoutes);
router.use(receivingRoutes);

router.post('/issues/goods/:id', checkPermission('wms.shipping.post_issue'), postGoodsIssue);
router.post('/transfers/:id/execute', checkPermission('wms.transfers.execute'), createStockTransfer);
router.post('/adjustments/:id/post', checkPermission('wms.adjustments.approve'), postInventoryAdjustment);
router.post('/adjustments/:id/approve', checkPermission('wms.adjustments.approve'), approveAdjustment);
router.post('/adjustments/:id/reject', checkPermission('wms.adjustments.reject'), rejectAdjustment);
router.post('/shipments', checkPermission('wms.shipping.create_wave'), createShipment);
router.get('/shipments', checkPermission('wms.shipping.view'), getShipments);
router.post('/transfers', checkPermission('wms.transfers.request'), createTransfer);
router.get('/transfers', checkPermission('wms.items.view'), getTransfers);
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
router.post('/pick-tasks', checkPermission('wms.shipping.create_wave'), createPickTask);
router.get('/pick-tasks', checkPermission('wms.shipping.view'), getPickTasks);
router.get('/pick-tasks/:id', checkPermission('wms.shipping.view'), getPickTask);
router.put('/pick-tasks/:id', checkPermission('wms.shipping.assign_picker'), updatePickTask);
router.post('/pick-wave/release', checkPermission('wms.shipping.create_wave'), releasePickWave);
router.get('/reports/valuation', checkPermission('wms.items.view'), getInventoryValuation);
router.get('/reports/valuation-detailed', checkPermission('wms.items.view'), getValuationDetailed);
router.get('/reports/abc', checkPermission('wms.items.view'), getABCClassification);
router.get('/reports/dead-stock', checkPermission('wms.items.view'), getDeadStockReport);
router.get('/alerts/reorder', checkPermission('wms.items.view'), getReorderAlerts);
router.get('/alerts/expiry', checkPermission('wms.items.view'), getExpiryAlerts);
router.get('/putaway/suggest', checkPermission('wms.items.view'), getPutawaySuggestion);

module.exports = router;
