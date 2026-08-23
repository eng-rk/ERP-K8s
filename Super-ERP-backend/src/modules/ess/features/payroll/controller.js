/** ESS Payroll domain boundary. Existing self-scoped handlers remain compatible during migration. */
const controller = require('../../../../controllers/essController');
module.exports = {
  getMyPayslips: controller.getMyPayslips,
  getMyPayslipById: controller.getMyPayslipById,
  getMyPaymentHistory: controller.getMyPaymentHistory,
};
