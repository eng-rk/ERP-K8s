const handlers = require('../../legacyHandlers');

module.exports = {
  createVacancy: handlers.createVacancy,
  getVacancies: handlers.getVacancies,
  createCandidate: handlers.createCandidate,
  getCandidates: handlers.getCandidates,
  updateCandidateStatus: handlers.updateCandidateStatus,
  addCandidateFeedback: handlers.addCandidateFeedback,
};
