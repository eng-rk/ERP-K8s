/**
 * HRM Employees domain facade.
 *
 * The current HRM implementation is still backed by hrmController.js.
 * This facade gives the Employees feature a stable domain boundary while
 * individual handlers are migrated out of the legacy controller incrementally.
 */
module.exports = require('../../../../controllers/hrmController');
