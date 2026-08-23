const express = require('express');
const { protect } = require('../../../../middleware/auth');
const { checkPermission } = require('../../../../middleware/authorize');
const controller = require('../../../../controllers/hrmController');

const router = express.Router();

router.post('/partnerships', protect, checkPermission('hrm.staff.create'), controller.createPartnership);
router.get('/partnerships', protect, checkPermission('hrm.staff.view_list'), controller.getPartnerships);
router.post('/suggestions', protect, checkPermission('hrm.staff.view_list'), controller.createSuggestion);
router.get('/suggestions', protect, checkPermission('hrm.staff.view_list'), controller.getSuggestions);
router.put('/suggestions/:id/status', protect, checkPermission('hrm.staff.edit_profile'), controller.updateSuggestionStatus);
router.put('/suggestions/:id', protect, checkPermission('hrm.staff.edit_profile'), controller.updateSuggestionStatus);

module.exports = router;
