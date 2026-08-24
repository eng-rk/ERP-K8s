// Compatibility entrypoint for legacy imports.
// The canonical Ticket model now lives inside the CRM module.
// Re-exporting it prevents Mongoose from compiling the same model name twice.
module.exports = require('../modules/crm/tickets/model');
