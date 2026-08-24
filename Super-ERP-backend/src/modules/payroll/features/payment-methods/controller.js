const service = require('./service');

const handle = (handler) => async (req, res) => {
  try {
    const data = await handler({ req });
    res.json({ success: true, data });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

exports.getAllPaymentMethods = handle(service.getAllPaymentMethods);
exports.approvePaymentMethod = handle(service.approvePaymentMethod);
exports.rejectPaymentMethod = handle(service.rejectPaymentMethod);
