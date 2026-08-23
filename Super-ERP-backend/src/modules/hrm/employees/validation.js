const mongoose = require('mongoose');

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

function validateCreateEmployee(body = {}) {
  const errors = [];
  if (!body.userId || !isObjectId(body.userId)) errors.push('userId must be a valid User id');
  if (!body.employeeCode || typeof body.employeeCode !== 'string' || !body.employeeCode.trim()) errors.push('employeeCode is required');
  if (body.departmentId && !isObjectId(body.departmentId)) errors.push('departmentId must be a valid id');
  if (body.positionId && !isObjectId(body.positionId)) errors.push('positionId must be a valid id');
  if (body.managerId && !isObjectId(body.managerId)) errors.push('managerId must be a valid id');
  if (body.joinDate && Number.isNaN(Date.parse(body.joinDate))) errors.push('joinDate must be a valid date');
  if (body.employmentStatus && !['active', 'inactive', 'terminated', 'on_leave'].includes(body.employmentStatus)) errors.push('invalid employmentStatus');
  return errors;
}

module.exports = { validateCreateEmployee };
