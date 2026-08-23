// HRM Scheduling / AUX domain HTTP controller.
const legacy = require('../../../../controllers/hrmController');
module.exports = {
  getDetailedSchedule: legacy.getDetailedSchedule,
  updateDetailedSchedule: legacy.updateDetailedSchedule,
  updateAuxStatus: legacy.updateAuxStatus,
  getTeamAux: legacy.getTeamAux,
  updateRtmFlag: legacy.updateRtmFlag,
  getAuxReport: legacy.getAuxReport,
  upsertAuxSchedule: legacy.upsertAuxSchedule,
  getAuxSchedules: legacy.getAuxSchedules,
};
