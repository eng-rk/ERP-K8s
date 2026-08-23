const mongoose = require('mongoose');
const InventoryItem = require('../models/InventoryItem');
const StockLevel = require('../models/StockLevel');
const Lot = require('../models/Lot');
const ReceivingOrder = require('../models/ReceivingOrder');

const scanBarcode = async (req, res) => {
  try {
    const barcode = String(req.params.barcode || '').trim();
    if (!barcode) return res.status(400).json({ message: 'Barcode is required.' });

    const item = await InventoryItem.findOne({
      $or: [{ barcode }, { sku: barcode.toUpperCase() }]
    }).populate('product', 'name sku');

    if (!item) return res.status(404).json({ message: 'No inventory item found for this barcode.' });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: 'Failed to scan barcode', error: error.message });
  }
};

const getFefoRecommendation = async (req, res) => {
  try {
    const { item, warehouse, quantity = 1 } = req.query;
    if (!item || !warehouse) return res.status(400).json({ message: 'item and warehouse are required.' });

    const requested = Number(quantity);
    if (!Number.isFinite(requested) || requested <= 0) {
      return res.status(400).json({ message: 'quantity must be greater than zero.' });
    }

    const lots = await Lot.find({
      item,
      warehouse,
      quantity: { $gt: 0 },
      status: { $nin: ['Blocked', 'Restricted'] }
    }).sort({ expiryDate: 1, bestBeforeDate: 1, productionDate: 1, createdAt: 1 });

    let remaining = requested;
    const recommendations = [];
    for (const lot of lots) {
      if (remaining <= 0) break;
      const allocated = Math.min(Number(lot.quantity), remaining);
      recommendations.push({
        lotId: lot._id,
        lotNumber: lot.lotNumber,
        quantity: allocated,
        availableQuantity: lot.quantity,
        expiryDate: lot.expiryDate,
        bestBeforeDate: lot.bestBeforeDate,
        locator: lot.locator
      });
      remaining -= allocated;
    }

    res.json({
      success: true,
      data: {
        requestedQuantity: requested,
        allocatedQuantity: requested - remaining,
        shortfall: Math.max(remaining, 0),
        recommendations
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to build FEFO recommendation', error: error.message });
  }
};

const getUomConversions = async (req, res) => {
  try {
    const { item, from, to, quantity = 1 } = req.query;
    if (!item || !from || !to) return res.status(400).json({ message: 'item, from and to are required.' });

    const inventoryItem = await InventoryItem.findById(item).select('sku name baseUom alternateUoms');
    if (!inventoryItem) return res.status(404).json({ message: 'Inventory item not found.' });

    const units = new Map([[inventoryItem.baseUom, 1]]);
    for (const alt of inventoryItem.alternateUoms || []) units.set(alt.uom, Number(alt.conversionFactor));

    const fromFactor = units.get(String(from).toUpperCase());
    const toFactor = units.get(String(to).toUpperCase());
    if (!fromFactor || !toFactor) return res.status(400).json({ message: 'UOM conversion is not configured for this item.' });

    const input = Number(quantity);
    const converted = input * fromFactor / toFactor;
    res.json({ success: true, data: { item: inventoryItem, from: String(from).toUpperCase(), to: String(to).toUpperCase(), quantity: input, converted } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to convert UOM', error: error.message });
  }
};

const getValuationDetailed = async (req, res) => {
  try {
    const { warehouse, category } = req.query;
    const match = { onHand: { $gt: 0 } };
    if (warehouse && mongoose.isValidObjectId(warehouse)) match.warehouse = new mongoose.Types.ObjectId(warehouse);

    const pipeline = [
      { $match: match },
      { $lookup: { from: 'inventoryitems', localField: 'item', foreignField: '_id', as: 'item' } },
      { $unwind: '$item' },
      ...(category ? [{ $match: { 'item.category': category } }] : []),
      { $lookup: { from: 'warehouses', localField: 'warehouse', foreignField: '_id', as: 'warehouse' } },
      { $unwind: '$warehouse' },
      { $project: {
        item: '$item._id', sku: '$item.sku', itemName: '$item.name', category: '$item.category',
        warehouse: '$warehouse._id', warehouseCode: '$warehouse.code', warehouseName: '$warehouse.name',
        subinventory: 1, locator: 1, onHand: 1, available: 1, allocated: 1, blocked: 1,
        unitCost: '$item.unitCost', inventoryValue: { $multiply: ['$onHand', '$item.unitCost'] }
      } },
      { $sort: { inventoryValue: -1 } }
    ];

    const rows = await StockLevel.aggregate(pipeline);
    const totalValue = rows.reduce((sum, row) => sum + Number(row.inventoryValue || 0), 0);
    res.json({ success: true, data: rows, summary: { rows: rows.length, totalValue } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate detailed valuation', error: error.message });
  }
};

const exportEtaEInvoicePayload = async (req, res) => {
  try {
    const receiving = await ReceivingOrder.findById(req.params.receivingId)
      .populate('warehouse', 'code name')
      .populate('lines.item', 'sku name baseUom');
    if (!receiving) return res.status(404).json({ message: 'Receiving order not found.' });

    const payload = {
      documentType: 'inventory_receipt',
      documentId: receiving._id,
      documentNumber: receiving.poNumber || receiving.orderNumber || String(receiving._id),
      status: receiving.status,
      warehouse: receiving.warehouse,
      lines: (receiving.lines || []).map(line => ({
        item: line.item,
        quantity: line.acceptedQty ?? line.quantity ?? 0,
        uom: line.uom || line.item?.baseUom || 'EA',
        unitCost: line.unitCost || 0,
        lotNumber: line.lotNumber || ''
      })),
      generatedAt: new Date().toISOString()
    };

    res.json({ success: true, data: payload });
  } catch (error) {
    res.status(500).json({ message: 'Failed to export e-invoice payload', error: error.message });
  }
};

module.exports = { scanBarcode, getFefoRecommendation, getUomConversions, getValuationDetailed, exportEtaEInvoicePayload };
