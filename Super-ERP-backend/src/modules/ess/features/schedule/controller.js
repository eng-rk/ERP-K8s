/** ESS Schedule domain boundary. Existing self-scoped handlers remain compatible during migration. */
const controller = require('../../../../controllers/essController');
module.exports = {
  getMySchedule: controller.getMySchedule,
};
