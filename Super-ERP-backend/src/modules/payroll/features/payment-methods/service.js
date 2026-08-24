const PaymentMethod = require('../../../../models/PaymentMethod');

const PAYROLL_ROLES = [
  'Payroll Specialist',
  'HR Manager',
  'HR Director / Executive HR User',
  'HRM System Administrator',
  'Super CRM Administrator',
];

const isPayrollManager = (role) => PAYROLL_ROLES.includes(role);

const assertPayrollManager = (req) => {
  if (!isPayrollManager(req.user?.role)) {
    const error = new Error('Access denied.');
    error.status = 403;
    throw error;
  }
};

exports.getAllPaymentMethods = async ({ req }) => {
  assertPayrollManager(req);
  const { status } = req.query;
  const filter = status && status !== 'All' ? { status } : {};
  return PaymentMethod.find(filter)
    .populate('employeeId', 'firstName lastName role department')
    .populate('reviewedBy', 'firstName lastName')
    .sort({ status: 1, createdAt: -1 });
};

exports.approvePaymentMethod = async ({ req }) => {
  assertPayrollManager(req);
  const pm = await PaymentMethod.findById(req.params.id);
  if (!pm) {
    const error = new Error('Not found.');
    error.status = 404;
    throw error;
  }

  await PaymentMethod.updateMany(
    { employeeId: pm.employeeId, isActive: true },
    { isActive: false }
  );

  pm.status = 'Approved';
  pm.isActive = true;
  pm.reviewedBy = req.user._id;
  pm.reviewedAt = new Date();
  await pm.save();
  return pm;
};

exports.rejectPaymentMethod = async ({ req }) => {
  assertPayrollManager(req);
  const pm = await PaymentMethod.findById(req.params.id);
  if (!pm) {
    const error = new Error('Not found.');
    error.status = 404;
    throw error;
  }

  pm.status = 'Rejected';
  pm.isActive = false;
  pm.reviewedBy = req.user._id;
  pm.reviewedAt = new Date();
  pm.rejectionReason = req.body.reason || '';
  await pm.save();
  return pm;
};
