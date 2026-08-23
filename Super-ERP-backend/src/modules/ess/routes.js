const express = require('express');

const scheduleRoutes = require('./features/schedule/routes');
const payrollRoutes = require('./features/payroll/routes');
const paymentMethodRoutes = require('./features/payment-methods/routes');

const router = express.Router();

// Public API paths remain unchanged under /api/ess.
router.use(scheduleRoutes);
router.use(payrollRoutes);
router.use(paymentMethodRoutes);

module.exports = router;
