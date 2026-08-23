const express = require('express');
const { protect } = require('../../../../middleware/auth');
const { checkPermission } = require('../../../../middleware/authorize');
const controller = require('../../../../controllers/hrmController');

const router = express.Router();

router.get('/schedules/detailed', protect, checkPermission('attendance.schedules.view'), controller.getDetailedSchedule);
router.put('/schedules/detailed', protect, checkPermission('attendance.schedules.manage'), controller.updateDetailedSchedule);
router.put('/aux', protect, checkPermission('attendance.rtm.view_live'), controller.updateAuxStatus);
router.get('/aux/team', protect, checkPermission('attendance.rtm.view_live'), controller.getTeamAux);
router.put('/aux/rtm-flag', protect, checkPermission('attendance.rtm.override_aux'), controller.updateRtmFlag);
router.get('/aux/report', protect, checkPermission('attendance.rtm.view_live'), controller.getAuxReport);
router.post('/aux/schedule', protect, checkPermission('attendance.schedules.manage'), controller.upsertAuxSchedule);
router.get('/aux/schedule', protect, checkPermission('attendance.schedules.view'), controller.getAuxSchedules);

module.exports = router;
