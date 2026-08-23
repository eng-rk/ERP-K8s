const legacy = require('../../../../controllers/paymentController');
module.exports = {
  getPublicOfferByToken: legacy.getPublicOfferByToken,
  processPublicPayment: legacy.processPublicPayment,
};
