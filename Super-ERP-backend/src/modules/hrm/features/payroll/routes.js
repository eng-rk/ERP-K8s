const express = require('express');
const { protect } = require('../../../../middleware/auth');
const { checkPermission } = require('../../../../middleware/authorize');
const controller = require('../../../../controllers/hrmController');

const router = express.Router();

router.post('/contracts/salary-components', protect, checkPermission('hrm.contracts.edit_salary_components'), controller.upsertSalaryComponent);
router.delete('/contracts/salary-components/:id', protect, checkPermission('hrm.contracts.edit_salary_components'), controller.deleteSalaryComponent);
router.put('/contracts/salary/:id', protect, checkPermission('hrm.contracts.edit_net_salary'), controller.updateNetSalaryOnly);

module.exports = router;
