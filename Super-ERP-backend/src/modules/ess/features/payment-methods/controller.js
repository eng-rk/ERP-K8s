const controller = require('../../../../controllers/paymentMethodController');
module.exports = {
  getMyPaymentMethods: controller.getMyPaymentMethods,
  submitPaymentMethod: controller.submitPaymentMethod,
  updatePaymentMethod: controller.updatePaymentMethod,
  deletePaymentMethod: controller.deletePaymentMethod,
};
