const service = require('./service');

exports.getAllPaymentMethods = service.getAllPaymentMethods;
exports.approvePaymentMethod = service.approvePaymentMethod;
exports.rejectPaymentMethod = service.rejectPaymentMethod;
