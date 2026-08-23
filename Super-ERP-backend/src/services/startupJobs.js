const cron = require('node-cron');

function registerStartupJobs() {
  const scheduledTasks = [];
  let campaignInterval = null;

  const enableCronJobs = process.env.ENABLE_CRON_JOBS !== 'false';
  if (!enableCronJobs) {
    console.log('[Startup] Background jobs disabled. Running in web-only mode.');
    return { campaignInterval, scheduledTasks };
  }

  try {
    const Offer = require('../models/Offer');
    if (Offer.collection) {
      const cleanupIndex = async () => {
        const cursor = Offer.collection.listIndexes();
        const indexes = typeof cursor.toArray === 'function' ? await cursor.toArray() : await cursor;
        for (const name of ['recordLocator_1', 'bookingRef_1', 'paymentToken_1']) {
          if (Array.isArray(indexes) && indexes.some(index => index.name === name)) {
            try { await Offer.collection.dropIndex(name); } catch (err) { if (err.code !== 27 && err.code !== 26) console.error(`[Startup] Failed to drop ${name}:`, err.message); }
          }
        }
      };
      cleanupIndex().catch(err => console.error('[Startup] Index cleanup error:', err.message));
    }

    const { updateExpiredCampaigns } = require('./campaignHelper');
    updateExpiredCampaigns().catch?.(() => {});
    campaignInterval = setInterval(() => updateExpiredCampaigns().catch?.(() => {}), 5 * 60 * 1000);

    scheduledTasks.push(cron.schedule('0 9 25 * *', async () => {
      try {
        const User = require('../models/User');
        const DetailedSchedule = require('../models/DetailedSchedule');
        const Email = require('../models/Email');
        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        const nextMonth = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
        const employees = await User.find({ isActive: true });
        let count = 0;
        for (const emp of employees) {
          const existing = await DetailedSchedule.findOne({ employeeId: emp._id, month: nextMonth });
          if (!existing) {
            await Email.create({ senderId: emp._id, recipientId: emp._id, subject: `Reminder: Please set your schedule for ${nextMonth}`, body: `Dear ${emp.firstName},\n\nPlease set your work schedule for ${nextMonth} before the month starts.\n\nGo to Personal Department > Profile & Schedule to update your schedule.\n\nBest regards,\nHR Department` });
            count++;
          }
        }
        console.log(`[Cron] Sent ${count} schedule reminders for ${nextMonth}`);
      } catch (err) { console.error('[Cron] Schedule reminder error:', err); }
    }));

    scheduledTasks.push(cron.schedule('0 * * * *', async () => {
      try {
        const Offer = require('../models/Offer');
        const result = await Offer.updateMany({ status: { $in: ['Sent', 'Viewed'] }, validUntil: { $lt: new Date() } }, { $set: { status: 'Expired' } });
        if (result.modifiedCount > 0) console.log(`[Cron] Expired ${result.modifiedCount} overdue offer(s)`);
      } catch (err) { console.error('[Cron] Offer expiry error:', err.message); }
    }));

    scheduledTasks.push(cron.schedule('0 6 * * *', async () => {
      try {
        const Lot = require('../models/Lot');
        const Email = require('../models/Email');
        const User = require('../models/User');
        const now = new Date();
        const horizon30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const expired = await Lot.updateMany({ expiryDate: { $lte: now }, status: 'Unrestricted', quantity: { $gt: 0 } }, { $set: { status: 'Blocked' } });
        if (expired.modifiedCount > 0) console.log(`[Cron:Inventory] Blocked ${expired.modifiedCount} expired lot(s)`);
        const expiringLots = await Lot.find({ expiryDate: { $gt: now, $lte: horizon30 }, status: 'Unrestricted', quantity: { $gt: 0 } }).populate('item', 'sku name').populate('warehouse', 'code name');
        if (expiringLots.length) {
          const managers = await User.find({ role: { $in: ['Inventory Manager', 'Warehouse Manager', 'Super CRM Administrator'] }, isActive: true });
          const lotList = expiringLots.slice(0, 15).map(l => `- Lot ${l.lotNumber} | ${l.item?.sku} ${l.item?.name} | Qty: ${l.quantity} | Expires: ${new Date(l.expiryDate).toLocaleDateString()} | ${l.warehouse?.code}`).join('\n');
          for (const mgr of managers) await Email.create({ senderId: mgr._id, recipientId: mgr._id, subject: `[Inventory Alert] ${expiringLots.length} lot(s) expiring within 30 days`, body: `Dear ${mgr.firstName},\n\n${lotList}\n\nPlease review and take action.\n\nBest regards,\nInventory System` });
        }
      } catch (err) { console.error('[Cron:Inventory] Expiry scan error:', err.message); }
    }));

    scheduledTasks.push(cron.schedule('0 */4 * * *', async () => {
      try {
        const StockLevel = require('../models/StockLevel');
        const User = require('../models/User');
        const Email = require('../models/Email');
        const breachedItems = await StockLevel.aggregate([
          { $group: { _id: '$item', totalAvailable: { $sum: '$available' } } },
          { $lookup: { from: 'inventoryitems', localField: '_id', foreignField: '_id', as: 'itemData' } },
          { $unwind: '$itemData' },
          { $match: { 'itemData.reorderPoint': { $gt: 0 }, $expr: { $lte: ['$totalAvailable', '$itemData.reorderPoint'] } } },
          { $project: { sku: '$itemData.sku', name: '$itemData.name', reorderPoint: '$itemData.reorderPoint', totalAvailable: 1 } },
          { $sort: { totalAvailable: 1 } }
        ]);
        if (!breachedItems.length) return;
        const managers = await User.find({ role: { $in: ['Inventory Manager', 'Super CRM Administrator'] }, isActive: true });
        const itemList = breachedItems.slice(0, 20).map(i => `- ${i.sku} ${i.name} | Available: ${i.totalAvailable} | Reorder Point: ${i.reorderPoint}`).join('\n');
        for (const mgr of managers) await Email.create({ senderId: mgr._id, recipientId: mgr._id, subject: `[Inventory Alert] ${breachedItems.length} item(s) below reorder point`, body: `Dear ${mgr.firstName},\n\n${itemList}\n\nPlease initiate replenishment orders.\n\nBest regards,\nInventory System` });
      } catch (err) { console.error('[Cron:Inventory] Reorder breach check error:', err.message); }
    }));

    console.log('[Startup] Background jobs enabled.');
  } catch (err) {
    console.error('[Startup] Error registering background jobs:', err.message);
  }

  return { campaignInterval, scheduledTasks };
}

module.exports = { registerStartupJobs };
