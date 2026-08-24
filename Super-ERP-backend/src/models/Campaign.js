// Compatibility entrypoint: the canonical Campaign model lives inside the CRM module.
// Keeping this path preserves existing imports while preventing duplicate Mongoose model registration.
module.exports = require('../modules/crm/campaigns/model');
