// Compatibility entrypoint: ESS is now composed from domain feature routers.
// Keeping this path preserves the existing /api/ess mount and public URLs.
module.exports = require('../modules/ess/routes');
