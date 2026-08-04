const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const promClient = require('prom-client');
const path = require('path');
const cron = require('node-cron');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const { ensureDirectories } = require('./utils/ensureDirectories');

dotenv.config();

connectDB().catch(err => {
  console.error('Unexpected error during DB connection:', err);
});

const app = express();

// Security Headers with Helmet
app.use(helmet({ contentSecurityPolicy: false }));

// Rate Limiter Setup
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { message: 'Too many requests from this IP, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many authentication attempts, please try again later.' }
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);

// Prometheus Metrics Setup
promClient.collectDefaultMetrics({ prefix: 'core360_backend_' });

const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10]
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    httpRequestDurationMicroseconds.labels(req.method, route, res.statusCode).observe(duration);
  });
  next();
});

// Expose Prometheus Metrics Endpoint
app.get('/metrics', async (req, res) => {
  try {
    res.setHeader('Content-Type', promClient.register.contentType);
    res.send(await promClient.register.metrics());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [];

// Base CORS config using the standard package
const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Self-contained wrapper to intercept CORS violations and return HTTP 403 Forbidden
app.use((req, res, next) => {
  const origin = req.headers.origin;

  corsMiddleware(req, res, () => {
    if (origin && !res.getHeader('Access-Control-Allow-Origin')) {
      return res.status(403).json({ message: 'CORS policy blocked this origin.' });
    }
    next();
  });
});

app.options('/*splat', corsMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const requestLogger = require('./middleware/requestLogger');
app.use(requestLogger);

ensureDirectories();

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health Check Endpoints
app.get('/health/live', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'super-erp-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/health/ready', (req, res) => {
  const isConnected = mongoose.connection && mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({
    status: isConnected ? 'READY' : 'NOT_READY',
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

const authRoutes = require('./routes/authRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const leadRoutes = require('./routes/leadRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const publicRoutes = require('./routes/publicRoutes');
const offerRoutes = require('./routes/offerRoutes');
const hrmRoutes = require('./routes/hrmRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const essRoutes = require('./routes/essRoutes');
const gatewayRoutes = require('./routes/gatewayRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const templateRoutes = require('./routes/templateRoutes');
const permissionRoutes = require('./routes/permissionRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/iam', permissionRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/hrm', hrmRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/ess', essRoutes);
app.use('/api/gateway', gatewayRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/public/pay', paymentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/templates', templateRoutes);

app.get('/', (req, res) => {
  res.send('CRM Backend API is running...');
});

let server;
let campaignInterval;
const scheduledTasks = [];

const runStartupTasks = () => {
  try {
    const Offer = require('./models/Offer');
    if (Offer.collection) {
      const cleanupIndex = async () => {
        const cursor = Offer.collection.listIndexes();
        const indexes = typeof cursor.toArray === 'function' ? await cursor.toArray() : await cursor;
        const staleNames = ['recordLocator_1', 'bookingRef_1', 'paymentToken_1'];
        for (const name of staleNames) {
          if (Array.isArray(indexes) && indexes.some(idx => idx.name === name)) {
            console.log(`[Startup] Dropping stale ${name} index...`);
            await Offer.collection.dropIndex(name);
          }
        }
      };
      cleanupIndex().catch(err => {
        if (err.code !== 27 && err.code !== 26) {
          console.error('[Startup] Index cleanup error:', err.message);
        }
      });
    }

    const enableCronJobs = process.env.ENABLE_CRON_JOBS !== 'false';

    if (enableCronJobs) {
      console.log('[Startup] Background jobs enabled.');

      const { updateExpiredCampaigns } = require('./services/campaignHelper');
      updateExpiredCampaigns();
      campaignInterval = setInterval(updateExpiredCampaigns, 5 * 60 * 1000);

      scheduledTasks.push(cron.schedule('0 9 25 * *', async () => {
        try {
          console.log('[Cron] Running monthly schedule reminder job...');
          const User = require('./models/User');
          const DetailedSchedule = require('./models/DetailedSchedule');
          const Email = require('./models/Email');

          const now = new Date();
          const y = now.getFullYear();
          const m = now.getMonth() + 1;
          const nextMonth = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;

          const employees = await User.find({ isActive: true });
          let count = 0;

          for (const emp of employees) {
            const existing = await DetailedSchedule.findOne({ employeeId: emp._id, month: nextMonth });
            if (!existing) {
              await Email.create({
                senderId: emp._id,
                recipientId: emp._id,
                subject: `Reminder: Please set your schedule for ${nextMonth}`,
                body: `Dear ${emp.firstName},\n\nPlease set your work schedule for ${nextMonth} before the month starts.\n\nGo to Personal Department > Profile & Schedule to update your schedule.\n\nBest regards,\nHR Department`
              });
              count++;
            }
          }
          console.log(`[Cron] Sent ${count} schedule reminders for ${nextMonth}`);
        } catch (err) {
          console.error('[Cron] Schedule reminder error:', err);
        }
      }));
      console.log('[Cron] Monthly schedule reminder job registered (25th of each month, 9:00 AM)');

      scheduledTasks.push(cron.schedule('0 * * * *', async () => {
        try {
          const Offer = require('./models/Offer');
          const now = new Date();
          const result = await Offer.updateMany(
            {
              status: { $in: ['Sent', 'Viewed'] },
              validUntil: { $lt: now }
            },
            { $set: { status: 'Expired' } }
          );
          if (result.modifiedCount > 0) {
            console.log(`[Cron] Expired ${result.modifiedCount} overdue offer(s)`);
          }
        } catch (err) {
          console.error('[Cron] Offer expiry error:', err.message);
        }
      }));
      console.log('[Cron] Hourly offer expiry job registered');

      // ── Inventory: daily expiry scan (6:00 AM) ──────────────────────────────
      scheduledTasks.push(cron.schedule('0 6 * * *', async () => {
        try {
          const Lot = require('./models/Lot');
          const Email = require('./models/Email');
          const User = require('./models/User');
          const now = new Date();
          const horizon30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

          // Block lots that are past expiry
          const expired = await Lot.updateMany(
            { expiryDate: { $lte: now }, status: 'Unrestricted', quantity: { $gt: 0 } },
            { $set: { status: 'Blocked' } }
          );
          if (expired.modifiedCount > 0) {
            console.log(`[Cron:Inventory] Blocked ${expired.modifiedCount} expired lot(s)`);
          }

          // Notify inventory managers about lots expiring within 30 days
          const expiringLots = await Lot.find({
            expiryDate: { $gt: now, $lte: horizon30 },
            status: 'Unrestricted',
            quantity: { $gt: 0 }
          }).populate('item', 'sku name').populate('warehouse', 'code name');

          if (expiringLots.length > 0) {
            const managers = await User.find({ role: { $in: ['Inventory Manager', 'Warehouse Manager', 'Super CRM Administrator'] }, isActive: true });
            for (const mgr of managers) {
              const lotList = expiringLots.slice(0, 15).map(l =>
                `- Lot ${l.lotNumber} | ${l.item?.sku} ${l.item?.name} | Qty: ${l.quantity} | Expires: ${new Date(l.expiryDate).toLocaleDateString()} | ${l.warehouse?.code}`
              ).join('\n');
              await Email.create({
                senderId: mgr._id,
                recipientId: mgr._id,
                subject: `[Inventory Alert] ${expiringLots.length} lot(s) expiring within 30 days`,
                body: `Dear ${mgr.firstName},\n\nThe following lots are expiring within 30 days:\n\n${lotList}${expiringLots.length > 15 ? `\n...and ${expiringLots.length - 15} more.` : ''}\n\nPlease review and take action.\n\nBest regards,\nInventory System`
              });
            }
            console.log(`[Cron:Inventory] Sent expiry alerts for ${expiringLots.length} lot(s) to ${managers.length} manager(s)`);
          }
        } catch (err) {
          console.error('[Cron:Inventory] Expiry scan error:', err.message);
        }
      }));
      console.log('[Cron] Daily inventory expiry scan registered (6:00 AM)');

      // ── Inventory: reorder point breach check (every 4 hours) ───────────────
      scheduledTasks.push(cron.schedule('0 */4 * * *', async () => {
        try {
          const StockLevel = require('./models/StockLevel');
          const InventoryItem = require('./models/InventoryItem');
          const Email = require('./models/Email');
          const User = require('./models/User');

          const breachedItems = await StockLevel.aggregate([
            { $group: { _id: '$item', totalAvailable: { $sum: '$available' } } },
            { $lookup: { from: 'inventoryitems', localField: '_id', foreignField: '_id', as: 'itemData' } },
            { $unwind: { path: '$itemData' } },
            {
              $match: {
                'itemData.reorderPoint': { $gt: 0 },
                $expr: { $lte: ['$totalAvailable', '$itemData.reorderPoint'] }
              }
            },
            {
              $project: {
                sku: '$itemData.sku',
                name: '$itemData.name',
                reorderPoint: '$itemData.reorderPoint',
                totalAvailable: 1
              }
            },
            { $sort: { totalAvailable: 1 } }
          ]);

          if (breachedItems.length > 0) {
            const managers = await User.find({ role: { $in: ['Inventory Manager', 'Super CRM Administrator'] }, isActive: true });
            for (const mgr of managers) {
              const itemList = breachedItems.slice(0, 20).map(i =>
                `- ${i.sku} ${i.name} | Available: ${i.totalAvailable} | Reorder Point: ${i.reorderPoint}`
              ).join('\n');
              await Email.create({
                senderId: mgr._id,
                recipientId: mgr._id,
                subject: `[Inventory Alert] ${breachedItems.length} item(s) below reorder point`,
                body: `Dear ${mgr.firstName},\n\nThe following items have stock at or below their reorder point:\n\n${itemList}${breachedItems.length > 20 ? `\n...and ${breachedItems.length - 20} more.` : ''}\n\nPlease initiate replenishment orders.\n\nBest regards,\nInventory System`
              });
            }
            console.log(`[Cron:Inventory] Sent reorder alerts for ${breachedItems.length} item(s)`);
          }
        } catch (err) {
          console.error('[Cron:Inventory] Reorder breach check error:', err.message);
        }
      }));
      console.log('[Cron] Inventory reorder breach check registered (every 4 hours)');
    } else {
      console.log('[Startup] Background jobs disabled. Running in web-only mode.');
    }

  } catch (err) {
    console.error('[Startup] Error running startup tasks:', err.message);
  }
};
runStartupTasks();

let isShuttingDown = false;

const gracefulShutdown = (signal) => {
  if (isShuttingDown) {
    console.log(`[Shutdown] ${signal} received, but shutdown is already in progress.`);
    return;
  }
  isShuttingDown = true;
  console.log(`[Shutdown] Received ${signal}. Starting graceful shutdown sequence...`);

  const timeoutMs = parseInt(process.env.SHUTDOWN_TIMEOUT_MS, 10) || 10000;
  const forceExitTimeout = setTimeout(() => {
    console.error(`[Shutdown] Force exiting process after ${timeoutMs / 1000}s timeout.`);
    process.exit(1);
  }, timeoutMs);

  if (server) {
    console.log('[Shutdown] Stop accepting new HTTP requests...');
    server.close(async () => {
      console.log('[Shutdown] Active HTTP connections drained. Stopping background tasks...');

      if (scheduledTasks.length > 0) {
        console.log('[Shutdown] Stopping active background cron tasks...');
        scheduledTasks.forEach(task => task.stop());
      }

      if (campaignInterval) {
        console.log('[Shutdown] Clearing campaign update interval...');
        clearInterval(campaignInterval);
      }

      try {
        console.log('[Shutdown] Closing MongoDB connection...');
        await mongoose.connection.close();
        console.log('[Shutdown] MongoDB connection closed cleanly.');
        clearTimeout(forceExitTimeout);
        console.log('[Shutdown] Graceful shutdown completed successfully.');
        process.exit(0);
      } catch (err) {
        console.error('[Shutdown] Error while closing MongoDB connection:', err);
        clearTimeout(forceExitTimeout);
        process.exit(1);
      }
    });
  } else {
    if (scheduledTasks.length > 0) {
      console.log('[Shutdown] Stopping active background cron tasks...');
      scheduledTasks.forEach(task => task.stop());
    }

    if (campaignInterval) {
      console.log('[Shutdown] Clearing campaign update interval...');
      clearInterval(campaignInterval);
    }

    mongoose.connection.close()
      .then(() => {
        clearTimeout(forceExitTimeout);
        console.log('[Shutdown] MongoDB connection closed cleanly (script mode).');
        process.exit(0);
      })
      .catch((err) => {
        console.error('[Shutdown] Error closing MongoDB connection (script mode):', err);
        clearTimeout(forceExitTimeout);
        process.exit(1);
      });
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
