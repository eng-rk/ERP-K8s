const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/authorize');
const uploadGovDoc = require('../middleware/uploadHRM');
const { uploadSignedContract: signedContractUpload } = require('../middleware/uploadHRM');

const {
  sendEmail,
  getInbox,
  getSent,
  getEmailThread,
  markEmailRead,
  upsertContract,
  uploadSignedContract,
  upsertSalaryComponent,
  deleteSalaryComponent,
  updateNetSalaryOnly,
  getContracts,
  getMyContract,
  updateGovDocs,
  uploadGovDocFile,
  verifyGovDoc,
  getGovDocTemplates,
  createGovDocTemplate,
  deleteGovDocTemplate,
  getLeaveBalance,
  createLeaveRequest,
  getLeaveRequests,
  updateLeaveStatus,
  getDetailedSchedule,
  updateDetailedSchedule,
  createTraining,
  getTrainings,
  updateTrainingReport,
  updateAuxStatus,
  getTeamAux,
  updateRtmFlag,
  createVacancy,
  getVacancies,
  createCandidate,
  getCandidates,
  updateCandidateStatus,
  addCandidateFeedback,
  createKPI,
  getKPIs,
  createPartnership,
  getPartnerships,
  createSuggestion,
  getSuggestions,
  updateSuggestionStatus,
  getAuxReport,
  upsertAuxSchedule,
  getAuxSchedules
} = require('../controllers/hrmController');

// --- Emails ---
router.post('/emails', protect, checkPermission('hrm.staff.view_list'), sendEmail);
router.get('/emails/inbox', protect, checkPermission('hrm.staff.view_list'), getInbox);
router.get('/emails/sent', protect, checkPermission('hrm.staff.view_list'), getSent);
router.get('/emails/:id/thread', protect, checkPermission('hrm.staff.view_list'), getEmailThread);
router.put('/emails/:id/read', protect, checkPermission('hrm.staff.view_list'), markEmailRead);

// --- Contracts & Salaries ---
router.post('/contracts', protect, checkPermission('hrm.staff.edit_profile'), upsertContract);
router.post('/contracts/signed-copy', protect, signedContractUpload.single('contractFile'), checkPermission('hrm.contracts.upload_signed_pdf'), uploadSignedContract);
router.post('/contracts/salary-components', protect, checkPermission('hrm.contracts.edit_salary_components'), upsertSalaryComponent);
router.delete('/contracts/salary-components/:id', protect, checkPermission('hrm.contracts.edit_salary_components'), deleteSalaryComponent);
router.put('/contracts/salary/:id', protect, checkPermission('hrm.contracts.edit_net_salary'), updateNetSalaryOnly);
router.get('/contracts', protect, checkPermission('hrm.contracts.view_base_salary'), getContracts);
router.get('/contracts/my', protect, checkPermission('hrm.staff.view_list', { requiredScope: 'SELF' }), getMyContract);
router.post('/contracts/gov-docs', protect, checkPermission('hrm.staff.edit_profile'), updateGovDocs);
router.post('/contracts/gov-docs/upload', protect, uploadGovDoc.single('docFile'), checkPermission('hrm.staff.edit_profile'), uploadGovDocFile);
router.put('/contracts/gov-docs/:id/verify', protect, checkPermission('hrm.contracts.verify_doc'), verifyGovDoc);

// --- Gov Doc Templates (Super Admin) ---
router.get('/gov-doc-templates', protect, checkPermission('admin.settings.view'), getGovDocTemplates);
router.post('/gov-doc-templates', protect, checkPermission('admin.settings.update_business_model'), createGovDocTemplate);
router.delete('/gov-doc-templates/:id', protect, checkPermission('admin.settings.update_business_model'), deleteGovDocTemplate);

// --- Leave Requests & Shifts ---
router.get('/leaves/balance/:employeeId', protect, checkPermission('hrm.leaves.apply'), getLeaveBalance);
router.get('/leaves/balance', protect, checkPermission('hrm.leaves.apply'), getLeaveBalance);
router.post('/leaves', protect, checkPermission('hrm.leaves.apply'), createLeaveRequest);
router.get('/leaves', protect, checkPermission('hrm.leaves.approve'), getLeaveRequests);
router.put('/leaves/:id/status', protect, checkPermission('hrm.leaves.approve'), updateLeaveStatus);
router.get('/schedules/detailed', protect, checkPermission('attendance.schedules.view'), getDetailedSchedule);
router.put('/schedules/detailed', protect, checkPermission('attendance.schedules.manage'), updateDetailedSchedule);

// --- Trainings & AUX Status ---
router.post('/trainings', protect, checkPermission('hrm.staff.create'), createTraining);
router.get('/trainings', protect, checkPermission('hrm.staff.view_list'), getTrainings);
router.put('/trainings/:id', protect, checkPermission('hrm.staff.edit_profile'), updateTrainingReport);
router.put('/aux', protect, checkPermission('attendance.rtm.view_live'), updateAuxStatus);
router.get('/aux/team', protect, checkPermission('attendance.rtm.view_live'), getTeamAux);
router.put('/aux/rtm-flag', protect, checkPermission('attendance.rtm.override_aux'), updateRtmFlag);
router.get('/aux/report', protect, checkPermission('attendance.rtm.view_live'), getAuxReport);
router.post('/aux/schedule', protect, checkPermission('attendance.schedules.manage'), upsertAuxSchedule);
router.get('/aux/schedule', protect, checkPermission('attendance.schedules.view'), getAuxSchedules);

// --- Talent Acquisition ---
router.post('/vacancies', protect, checkPermission('talent.ats.create_vacancy'), createVacancy);
router.get('/vacancies', protect, checkPermission('talent.ats.view_vacancies'), getVacancies);
router.post('/candidates', protect, checkPermission('talent.ats.create_vacancy'), createCandidate);
router.get('/candidates', protect, checkPermission('talent.ats.view_vacancies'), getCandidates);
router.put('/candidates/:id/status', protect, checkPermission('talent.ats.create_vacancy'), updateCandidateStatus);
router.post('/candidates/:id/feedback', protect, checkPermission('talent.ats.add_feedback'), addCandidateFeedback);
router.post('/candidates/:id/notes', protect, checkPermission('talent.ats.add_feedback'), addCandidateFeedback);

// --- KPIs ---
router.post('/kpis', protect, checkPermission('hrm.staff.edit_profile'), createKPI);
router.get('/kpis', protect, checkPermission('hrm.staff.view_list'), getKPIs);

// --- Partnerships & Suggestions ---
router.post('/partnerships', protect, checkPermission('hrm.staff.create'), createPartnership);
router.get('/partnerships', protect, checkPermission('hrm.staff.view_list'), getPartnerships);
router.post('/suggestions', protect, checkPermission('hrm.staff.view_list'), createSuggestion);
router.get('/suggestions', protect, checkPermission('hrm.staff.view_list'), getSuggestions);
router.put('/suggestions/:id/status', protect, checkPermission('hrm.staff.edit_profile'), updateSuggestionStatus);
router.put('/suggestions/:id', protect, checkPermission('hrm.staff.edit_profile'), updateSuggestionStatus);

module.exports = router;
