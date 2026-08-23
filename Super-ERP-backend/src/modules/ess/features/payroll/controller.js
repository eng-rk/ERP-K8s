const service = require('./service');
const sendError = (res, error) => res.status(error.status || 500).json({ message: error.message || 'Server error' });
exports.getMyPayslips = async (req, res) => { try { res.json({ success: true, data: await service.getMyPayslips(req.scopeEmployeeId) }); } catch (e) { sendError(res, e); } };
exports.getMyPayslipById = async (req, res) => { try { const data = await service.getMyPayslipById({ employeeId: req.scopeEmployeeId, id: req.params.id }); if (!data) return res.status(404).json({ message: 'Payslip not found' }); res.json({ success: true, data }); } catch (e) { sendError(res, e); } };
exports.getMyPaymentHistory = async (req, res) => { try { res.json({ success: true, data: await service.getMyPaymentHistory(req.scopeEmployeeId) }); } catch (e) { sendError(res, e); } };
