// HRM Employees domain HTTP boundary.
// Email, payroll and training have already been extracted into their own features.
// Remaining employee-related handlers are exposed explicitly here so routes never
// depend on the whole legacy controller object.
const legacy = require('../../../../controllers/hrmController');
module.exports = {
  upsertContract: legacy.upsertContract,
  uploadSignedContract: legacy.uploadSignedContract,
  getContracts: legacy.getContracts,
  getMyContract: legacy.getMyContract,
  updateGovDocs: legacy.updateGovDocs,
  uploadGovDocFile: legacy.uploadGovDocFile,
  verifyGovDoc: legacy.verifyGovDoc,
  getLeaveBalance: legacy.getLeaveBalance,
  createLeaveRequest: legacy.createLeaveRequest,
  getLeaveRequests: legacy.getLeaveRequests,
  updateLeaveStatus: legacy.updateLeaveStatus,
  getGovDocTemplates: legacy.getGovDocTemplates,
  createGovDocTemplate: legacy.createGovDocTemplate,
  deleteGovDocTemplate: legacy.deleteGovDocTemplate,
  createKPI: legacy.createKPI,
  getKPIs: legacy.getKPIs,
};
