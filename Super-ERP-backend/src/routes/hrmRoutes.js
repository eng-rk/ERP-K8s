// Compatibility entrypoint: the HRM API is now composed from domain feature routers.
// Keeping this path preserves the existing /api/hrm mount without changing public URLs.
module.exports = require('../modules/hrm/routes');
