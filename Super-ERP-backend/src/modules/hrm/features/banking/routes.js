const express = require('express');
const { protect } = require('../../../../middleware/auth');
const { checkPermission } = require('../../../../middleware/authorize');
const controller = require('./controller');

const router = express.Router();
router.get('/bank-account/me', protect, controller.getMine);
router.get('/bank-account/:employeeId', protect, checkPermission('hrm.staff.view_list'), controller.getEmployee);
router.put('/bank-account/:employeeId', protect, checkPermission('hrm.staff.edit_profile'), controller.upsert);
router.post('/bank-account/:employeeId/verify', protect, checkPermission('hrm.staff.edit_profile'), controller.verify);
router.delete('/bank-account/:employeeId', protect, checkPermission('hrm.staff.edit_profile'), controller.remove);

module.exports = router;
