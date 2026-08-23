// HRM Partnerships domain HTTP controller.
const legacy = require('../../../../controllers/hrmController');
module.exports = {
  createPartnership: legacy.createPartnership,
  getPartnerships: legacy.getPartnerships,
  createSuggestion: legacy.createSuggestion,
  getSuggestions: legacy.getSuggestions,
  updateSuggestionStatus: legacy.updateSuggestionStatus,
};
