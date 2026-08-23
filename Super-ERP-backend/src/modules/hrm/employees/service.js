const Employee = require('./model');
const User = require('../../../models/User');

async function createEmployee(payload) {
  const user = await User.findById(payload.userId).select('_id role isActive');
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });
  if (!user.isActive) throw Object.assign(new Error('Cannot create an employee for an inactive user'), { statusCode: 400 });
  const existing = await Employee.findOne({ $or: [{ userId: payload.userId }, { employeeCode: payload.employeeCode.trim() }] });
  if (existing) throw Object.assign(new Error('Employee already exists for this user or employee code'), { statusCode: 409 });
  return Employee.create({ ...payload, employeeCode: payload.employeeCode.trim() });
}

async function getEmployeeById(id) {
  return Employee.findById(id).populate('userId', 'firstName lastName email role isActive').populate('managerId', 'firstName lastName email').lean();
}

async function listEmployees(filter = {}, options = {}) {
  const query = {};
  if (filter.departmentId) query.departmentId = filter.departmentId;
  if (filter.managerId) query.managerId = filter.managerId;
  if (filter.employmentStatus) query.employmentStatus = filter.employmentStatus;
  const limit = Math.min(Math.max(Number(options.limit) || 25, 1), 100);
  const page = Math.max(Number(options.page) || 1, 1);
  const [items, total] = await Promise.all([
    Employee.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate('userId', 'firstName lastName email role isActive').lean(),
    Employee.countDocuments(query)
  ]);
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

async function updateEmployee(id, updates) {
  delete updates.userId;
  delete updates.employeeCode;
  const employee = await Employee.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  if (!employee) throw Object.assign(new Error('Employee not found'), { statusCode: 404 });
  return employee;
}

module.exports = { createEmployee, getEmployeeById, listEmployees, updateEmployee };
