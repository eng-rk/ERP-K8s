/**
 * payrollRoutes.js
 * Enterprise Payroll AI Agents — Route Definitions
 * Mounted at: /api/payroll
 */

const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/authorize');

const {
  getPayrollRuns,
  generatePayrollRun,
  approvePayrollRun,
  releasePayrollRun,
  getRunEntries,
  getDisbursementQueue,
  retryDisbursement,
  getMyPayslips,
  getLoans,
  createLoan,
  updateLoan,
  getAlerts,
  updateAlertStatus,
  getAnalytics,
  personalAgentQuery,
  managerAgentQuery,
} = require('../controllers/payrollController');

const {
  getAllPaymentMethods,
  approvePaymentMethod,
  rejectPaymentMethod,
} = require('../controllers/paymentMethodController');

// ─── Payroll Runs ────────────────────────────────────────────────
router.get('/runs',              protect, checkPermission('payroll.engine.view_runs'), getPayrollRuns);
router.post('/runs',             protect, checkPermission('payroll.engine.calculate'), generatePayrollRun);
router.put('/runs/:id/approve',  protect, checkPermission('payroll.engine.approve_run'), approvePayrollRun);
router.put('/runs/:id/release',  protect, checkPermission('payroll.engine.release_disbursement'), releasePayrollRun);
router.get('/runs/:id/entries',  protect, checkPermission('payroll.engine.view_runs'), getRunEntries);
router.get('/disbursement-queue',         protect, checkPermission('payroll.engine.release_disbursement'), getDisbursementQueue);
router.put('/entries/:id/retry',          protect, checkPermission('payroll.engine.release_disbursement'), retryDisbursement);

// ─── Payslips ────────────────────────────────────────────────────
router.get('/entries/my',        protect, checkPermission('payroll.engine.view_runs', { requiredScope: 'SELF' }), getMyPayslips);

// ─── Loans ───────────────────────────────────────────────────────
router.get('/loans',             protect, checkPermission('payroll.loans.approve'), getLoans);
router.post('/loans',            protect, checkPermission('payroll.loans.apply'), createLoan);
router.put('/loans/:id',         protect, checkPermission('payroll.loans.approve'), updateLoan);

// ─── Alerts ──────────────────────────────────────────────────────
router.get('/alerts',            protect, checkPermission('payroll.engine.view_runs'), getAlerts);
router.put('/alerts/:id/status', protect, checkPermission('payroll.engine.calculate'), updateAlertStatus);

// ─── Analytics ───────────────────────────────────────────────────
router.get('/analytics',         protect, checkPermission('payroll.engine.view_runs'), getAnalytics);

// ─── AI Agents ───────────────────────────────────────────────────
router.post('/agent/personal',   protect, checkPermission('payroll.engine.view_runs', { requiredScope: 'SELF' }), personalAgentQuery);
router.post('/agent/manager',    protect, checkPermission('payroll.engine.view_runs'), managerAgentQuery);

// ─── Payment Methods (Manager) ───────────────────────────────────
router.get('/payment-methods',              protect, checkPermission('payroll.banking.verify_employee'), getAllPaymentMethods);
router.put('/payment-methods/:id/approve',  protect, checkPermission('payroll.banking.verify_employee'), approvePaymentMethod);
router.put('/payment-methods/:id/reject',   protect, checkPermission('payroll.banking.verify_employee'), rejectPaymentMethod);

module.exports = router;
