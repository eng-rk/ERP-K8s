const PayrollEntry = require('../../../../models/PayrollEntry');
exports.getMyPayslips = async employeeId => PayrollEntry.find({ employeeId }).populate('runId', 'period status approvedAt releasedAt paymentDate').sort({ period: -1 }).limit(36);
exports.getMyPayslipById = async ({ employeeId, id }) => PayrollEntry.findOne({ _id: id, employeeId }).populate('runId', 'period status approvedAt releasedAt paymentDate');
exports.getMyPaymentHistory = async employeeId => {
  const entries = await PayrollEntry.find({ employeeId, status: { $in: ['Paid', 'Approved'] } }).populate('runId', 'period status paymentDate paymentRef').sort({ period: -1 });
  const history = entries.map(e => ({ _id: e._id, period: e.period, grossEarnings: e.grossEarnings, totalDeductions: e.totalDeductions, netSalary: e.netSalary, status: e.status, paymentDate: e.paymentDate, paymentRef: e.paymentRef }));
  const totals = history.reduce((a, h) => ({ gross: a.gross + (h.grossEarnings || 0), deductions: a.deductions + (h.totalDeductions || 0), net: a.net + (h.netSalary || 0) }), { gross: 0, deductions: 0, net: 0 });
  const year = new Date().toISOString().slice(0, 4);
  const ytdNet = history.filter(h => h.period && h.period >= year).reduce((s, h) => s + (h.netSalary || 0), 0);
  return { history, totals, ytdNet, count: history.length };
};
