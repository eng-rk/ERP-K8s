const handlers = require('../../legacyHandlers');

module.exports = {
  upsertContract: handlers.upsertContract,
  uploadSignedContract: handlers.uploadSignedContract,
  getContracts: handlers.getContracts,
  getMyContract: handlers.getMyContract,
  updateGovDocs: handlers.updateGovDocs,
  uploadGovDocFile: handlers.uploadGovDocFile,
  verifyGovDoc: handlers.verifyGovDoc,
  getLeaveBalance: handlers.getLeaveBalance,
  createLeaveRequest: handlers.createLeaveRequest,
  getLeaveRequests: handlers.getLeaveRequests,
  updateLeaveStatus: handlers.updateLeaveStatus,
  getGovDocTemplates: handlers.getGovDocTemplates,
  createGovDocTemplate: handlers.createGovDocTemplate,
  deleteGovDocTemplate: handlers.deleteGovDocTemplate,
  createKPI: handlers.createKPI,
  getKPIs: handlers.getKPIs,
};
