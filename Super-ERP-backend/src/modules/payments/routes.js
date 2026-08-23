const express = require('express');
const publicPaymentRoutes = require('./features/public/routes');

const router = express.Router();
router.use(publicPaymentRoutes);
module.exports = router;
