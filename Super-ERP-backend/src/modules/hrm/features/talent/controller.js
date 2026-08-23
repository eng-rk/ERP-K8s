// HRM Talent domain HTTP controller.
// The handlers remain behavior-compatible with the legacy implementation.
const legacy = require('../../../../controllers/hrmController');
module.exports = {
  createVacancy: legacy.createVacancy,
  getVacancies: legacy.getVacancies,
  createCandidate: legacy.createCandidate,
  getCandidates: legacy.getCandidates,
  updateCandidateStatus: legacy.updateCandidateStatus,
  addCandidateFeedback: legacy.addCandidateFeedback,
};
