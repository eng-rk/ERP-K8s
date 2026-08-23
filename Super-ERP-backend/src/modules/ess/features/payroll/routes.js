const express = require('express');
const { protect, enforceSelfScope } = require('../../../../middleware/auth');
const controller = require('./controller');
const router = express.Router();
router.get('/payroll/payslips', protect, enforceSelfScope, controller.getMyPayslips);
router.get('/payroll/payslips/:id', protect, enforceSelfScope, controller.getMyPayslipById);
router.get('/payroll/history', protect, enforceSelfScope, controller.getMyPaymentHistory);
module.exports = router;
