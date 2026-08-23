const service = require('./service');
const { validateCreateEmployee } = require('./validation');

const sendError = (res, err) => res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });

async function create(req, res) {
  const errors = validateCreateEmployee(req.body);
  if (errors.length) return res.status(400).json({ success: false, errors });
  try { return res.status(201).json({ success: true, data: await service.createEmployee(req.body) }); }
  catch (err) { return sendError(res, err); }
}

async function getById(req, res) {
  try {
    const employee = await service.getEmployeeById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    return res.json({ success: true, data: employee });
  } catch (err) { return sendError(res, err); }
}

async function list(req, res) {
  try { return res.json({ success: true, data: await service.listEmployees(req.query, req.query) }); }
  catch (err) { return sendError(res, err); }
}

async function update(req, res) {
  try { return res.json({ success: true, data: await service.updateEmployee(req.params.id, { ...req.body }) }); }
  catch (err) { return sendError(res, err); }
}

module.exports = { create, getById, list, update };
