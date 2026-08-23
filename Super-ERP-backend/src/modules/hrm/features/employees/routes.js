const express = require('express');
const { protect } = require('../../../../middleware/auth');
const { checkPermission } = require('../../../../middleware/authorize');
const controller = require('../../../../controllers/hrmController');

const router = express.Router();

// Employee/contract profile operations
router.post('/contracts', protect, checkPermission('hrm.staff.edit_profile'), controller.upsertContract);
router.post('/contracts/signed-copy', protect, checkPermission('hrm.contracts.upload_signed_pdf'), controller.uploadSignedContract);
router.get('/contracts', protect, checkPermission('hrm.contracts.view_base_salary'), controller.getContracts);
router.get('/contracts/my', protect, checkPermission('hrm.staff.view_list', { requiredScope: 'SELF' }), controller.getMyContract);
router.post('/contracts/gov-docs', protect, checkPermission('hrm.staff.edit_profile'), controller.updateGovDocs);
router.put('/contracts/gov-docs/:id/verify', protect, checkPermission('hrm.contracts.verify_doc'), controller.verifyGovDoc);

router.get('/leaves/balance/:employeeId', protect, checkPermission('hrm.leaves.apply'), controller.getLeaveBalance);
router.get('/leaves/balance', protect, checkPermission('hrm.leaves.apply'), controller.getLeaveBalance);
router.post('/leaves', protect, checkPermission('hrm.leaves.apply'), controller.createLeaveRequest);
router.get('/leaves', protect, checkPermission('hrm.leaves.approve'), controller.getLeaveRequests);
router.put('/leaves/:id/status', protect, checkPermission('hrm.leaves.approve'), controller.updateLeaveStatus);

module.exports = router;
