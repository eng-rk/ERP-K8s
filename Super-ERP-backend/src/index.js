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
app.use(helmet({ contentSecurityPolicy: false }));

const globalLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, message: { message: 'Too many requests from this IP, please try again later.' } });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30, message: { message: 'Too many authentication attempts, please try again later.' } });
app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);

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

app.get('/metrics', async (req, res) => {
  try {
    res.setHeader('Content-Type', promClient.register.contentType);
    res.send(await promClient.register.metrics());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS ? process.env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim()) : [];
const corsMiddleware = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return callback(null, true);
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
app.use((req, res, next) => {
  const origin = req.headers.origin;
  corsMiddleware(req, res, () => {
    if (origin && !res.getHeader('Access-Control-Allow-Origin')) return res.status(403).json({ message: 'CORS policy blocked this origin.' });
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

app.get('/health/live', (req, res) => res.status(200).json({ status: 'UP', service: 'super-erp-backend', timestamp: new Date().toISOString(), uptime: process.uptime() }));
app.get('/health/ready', (req, res) => {
  const isConnected = mongoose.connection && mongoose.connection.readyState === 1;
  res.status(isConnected ? 200 : 503).json({ status: isConnected ? 'READY' : 'NOT_READY', database: isConnected ? 'connected' : 'disconnected', timestamp: new Date().toISOString() });
});

const authRoutes = require('./routes/authRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const leadRoutes = require('./modules/crm/leads');
const ticketRoutes = require('./modules/crm/tickets');
const analyticsRoutes = require('./modules/crm/analytics');
const campaignRoutes = require('./modules/crm/campaigns');
const publicRoutes = require('./routes/publicRoutes');
const offerRoutes = require('./modules/crm/offers');
const hrmRoutes = require('./routes/hrmRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const essRoutes = require('./routes/essRoutes');
const gatewayRoutes = require('./routes/gatewayRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const bookingRoutes = require('./modules/crm/bookings');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./modules/inventory');
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

app.get('/', (req, res) => res.send('CRM Backend API is running...'));

let server;
let campaignInterval;
const scheduledTasks = [];
const runStartupTasks = () => {
  try {
    const Offer = require('./models/Offer');
    const Campaign = require('./models/Campaign');
    campaignInterval = setInterval(async () => {
      try {
        await Offer.updateMany({ status: 'pending', expiresAt: { $lt: new Date() } }, { $set: { status: 'expired' } });
        await Campaign.updateMany({ status: 'scheduled', startDate: { $lte: new Date() } }, { $set: { status: 'active' } });
      } catch (err) { console.error('Scheduled CRM task failed:', err.message); }
    }, 60 * 1000);
  } catch (err) { console.error('Failed to initialize startup tasks:', err.message); }
};

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  runStartupTasks();
  server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  scheduledTasks.forEach(task => { try { task.stop(); } catch (_) {} });
  if (campaignInterval) clearInterval(campaignInterval);
  if (server) server.close(() => mongoose.connection.close(false).then(() => process.exit(0)).catch(() => process.exit(1)));
  else process.exit(0);
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
