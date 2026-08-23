const handlers = require('../../legacyHandlers');

module.exports = {
  getDetailedSchedule: handlers.getDetailedSchedule,
  updateDetailedSchedule: handlers.updateDetailedSchedule,
  updateAuxStatus: handlers.updateAuxStatus,
  getTeamAux: handlers.getTeamAux,
  updateRtmFlag: handlers.updateRtmFlag,
  getAuxReport: handlers.getAuxReport,
  upsertAuxSchedule: handlers.upsertAuxSchedule,
  getAuxSchedules: handlers.getAuxSchedules,
};
