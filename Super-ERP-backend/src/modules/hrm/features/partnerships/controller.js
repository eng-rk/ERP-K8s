const handlers = require('../../legacyHandlers');

module.exports = {
  createPartnership: handlers.createPartnership,
  getPartnerships: handlers.getPartnerships,
  createSuggestion: handlers.createSuggestion,
  getSuggestions: handlers.getSuggestions,
  updateSuggestionStatus: handlers.updateSuggestionStatus,
};
