const express = require('express');
const { protect, enforceSelfScope } = require('../../../../middleware/auth');
const controller = require('../../../../controllers/essController');

const router = express.Router();
const self = [protect, enforceSelfScope];

router.get('/payroll/payslips', self, controller.getMyPayslips);
router.get('/payroll/payslips/:id', self, controller.getMyPayslipById);
router.get('/payroll/history', self, controller.getMyPaymentHistory);

module.exports = router;
