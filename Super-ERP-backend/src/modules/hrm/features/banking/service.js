const EmployeeBankAccount = require('../../../../models/EmployeeBankAccount');

const getForEmployee = (employeeId) => EmployeeBankAccount.findOne({ employeeId })
  .populate('employeeId', 'name email employeeId')
  .populate('verifiedBy', 'name email');

const upsert = async (employeeId, payload, actorId) => {
  const data = { ...payload, employeeId, updatedBy: actorId };
  if (actorId && !payload.addedBy) data.addedBy = actorId;
  return EmployeeBankAccount.findOneAndUpdate(
    { employeeId }, data,
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
};

const verify = async (employeeId, actorId) => {
  const account = await EmployeeBankAccount.findOneAndUpdate(
    { employeeId },
    { isVerified: true, verifiedBy: actorId, verifiedAt: new Date(), updatedBy: actorId },
    { new: true, runValidators: true }
  );
  if (!account) throw Object.assign(new Error('Employee bank account not found'), { statusCode: 404 });
  return account;
};

const remove = async (employeeId) => {
  const result = await EmployeeBankAccount.findOneAndDelete({ employeeId });
  if (!result) throw Object.assign(new Error('Employee bank account not found'), { statusCode: 404 });
  return result;
};

module.exports = { getForEmployee, upsert, verify, remove };
