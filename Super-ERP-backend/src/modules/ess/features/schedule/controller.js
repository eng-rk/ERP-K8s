const service = require('./service');
const sendError = (res, error) => res.status(error.status || 500).json({ message: error.message || 'Server error' });
exports.getMySchedule = async (req, res) => { try { res.json({ success: true, data: await service.getMySchedule({ employeeId: req.scopeEmployeeId, month: req.query.month }) }); } catch (error) { sendError(res, error); } };
