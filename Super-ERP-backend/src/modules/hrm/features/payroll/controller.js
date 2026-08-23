const service = require('./service');
const respondError = (res, error) => res.status(error.status || 500).json({ message: error.message || 'Server error' });

exports.upsertSalaryComponent = async (req, res) => {
  try { const data = await service.upsertSalaryComponent({ ...req.body, user: req.user }); res.json({ success: true, data }); }
  catch (error) { respondError(res, error); }
};
exports.deleteSalaryComponent = async (req, res) => {
  try { const data = await service.deleteSalaryComponent({ employeeId: req.query.employeeId, componentId: req.params.id, user: req.user }); res.json({ success: true, data }); }
  catch (error) { respondError(res, error); }
};
exports.updateNetSalaryOnly = async (req, res) => {
  try { const data = await service.updateNetSalary({ id: req.params.id, netSalary: req.body.netSalary, reason: req.body.reason, user: req.user }); res.json({ success: true, data }); }
  catch (error) { respondError(res, error); }
};
