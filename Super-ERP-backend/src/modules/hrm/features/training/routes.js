const express = require('express');
const { protect } = require('../../../../middleware/auth');
const { checkPermission } = require('../../../../middleware/authorize');
const controller = require('../../../../controllers/hrmController');

const router = express.Router();

router.post('/trainings', protect, checkPermission('hrm.staff.create'), controller.createTraining);
router.get('/trainings', protect, checkPermission('hrm.staff.view_list'), controller.getTrainings);
router.put('/trainings/:id', protect, checkPermission('hrm.staff.edit_profile'), controller.updateTrainingReport);

module.exports = router;
