const express = require('express');
const { protect } = require('../../../../middleware/auth');
const { checkPermission } = require('../../../../middleware/authorize');
const uploadHRM = require('../../../../middleware/uploadHRM');
const controller = require('./controller');
const emailController = require('./email.controller');

const router = express.Router();
const signedContractUpload = uploadHRM.uploadSignedContract;

router.post('/contracts', protect, checkPermission('hrm.staff.edit_profile'), controller.upsertContract);
router.post('/contracts/signed-copy', protect, signedContractUpload.single('contractFile'), checkPermission('hrm.contracts.upload_signed_pdf'), controller.uploadSignedContract);
router.get('/contracts', protect, checkPermission('hrm.contracts.view_base_salary'), controller.getContracts);
router.get('/contracts/my', protect, checkPermission('hrm.staff.view_list', { requiredScope: 'SELF' }), controller.getMyContract);
router.post('/contracts/gov-docs', protect, checkPermission('hrm.staff.edit_profile'), controller.updateGovDocs);
router.post('/contracts/gov-docs/upload', protect, uploadHRM.single('docFile'), checkPermission('hrm.staff.edit_profile'), controller.uploadGovDocFile);
router.put('/contracts/gov-docs/:id/verify', protect, checkPermission('hrm.contracts.verify_doc'), controller.verifyGovDoc);

// Employee email operations are fully owned by this feature.
router.post('/emails', protect, checkPermission('hrm.staff.view_list'), emailController.sendEmail);
router.get('/emails/inbox', protect, checkPermission('hrm.staff.view_list'), emailController.getInbox);
router.get('/emails/sent', protect, checkPermission('hrm.staff.view_list'), emailController.getSent);
router.get('/emails/:id/thread', protect, checkPermission('hrm.staff.view_list'), emailController.getEmailThread);
router.put('/emails/:id/read', protect, checkPermission('hrm.staff.view_list'), emailController.markEmailRead);

router.get('/leaves/balance/:employeeId', protect, checkPermission('hrm.leaves.apply'), controller.getLeaveBalance);
router.get('/leaves/balance', protect, checkPermission('hrm.leaves.apply'), controller.getLeaveBalance);
router.post('/leaves', protect, checkPermission('hrm.leaves.apply'), controller.createLeaveRequest);
router.get('/leaves', protect, checkPermission('hrm.leaves.approve'), controller.getLeaveRequests);
router.put('/leaves/:id/status', protect, checkPermission('hrm.leaves.approve'), controller.updateLeaveStatus);

router.get('/gov-doc-templates', protect, checkPermission('admin.settings.view'), controller.getGovDocTemplates);
router.post('/gov-doc-templates', protect, checkPermission('admin.settings.update_business_model'), controller.createGovDocTemplate);
router.delete('/gov-doc-templates/:id', protect, checkPermission('admin.settings.update_business_model'), controller.deleteGovDocTemplate);
router.post('/kpis', protect, checkPermission('hrm.staff.edit_profile'), controller.createKPI);
router.get('/kpis', protect, checkPermission('hrm.staff.view_list'), controller.getKPIs);

module.exports = router;
