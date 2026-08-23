const Contract = require('../../../../models/Contract');
const HR_ROLES = ['HRM System Administrator', 'HR Manager', 'HR Specialist (Generalist)', 'Super CRM Administrator', 'Super Admin', 'Administrator', 'CRM core Administrator', 'Core 360 Administrator', 'HR Director / Executive HR User'];
const fail = (message, status) => Object.assign(new Error(message), { status });
const isHR = (role) => HR_ROLES.includes(role);

async function upsertSalaryComponent({ employeeId, componentId, label, type, valueType, value, kpiLinked, note, user }) {
  if (!isHR(user.role)) throw fail('Access denied.', 403);
  const contract = await Contract.findOne({ employeeId });
  if (!contract) throw fail('Contract not found.', 404);
  if (componentId) {
    const component = contract.salaryComponents.id(componentId);
    if (!component) throw fail('Component not found.', 404);
    component.label = label; component.type = type; component.valueType = valueType;
    component.value = Number(value); component.kpiLinked = !!kpiLinked; component.note = note || '';
  } else {
    contract.salaryComponents.push({ label, type, valueType, value: Number(value), kpiLinked: !!kpiLinked, note: note || '', addedBy: user._id });
  }
  await contract.save();
  return contract.salaryComponents;
}

async function deleteSalaryComponent({ employeeId, componentId, user }) {
  if (!isHR(user.role)) throw fail('Access denied.', 403);
  const contract = await Contract.findOne({ employeeId });
  if (!contract) throw fail('Contract not found.', 404);
  contract.salaryComponents = contract.salaryComponents.filter((c) => c._id.toString() !== componentId);
  await contract.save();
  return contract.salaryComponents;
}

async function updateNetSalary({ id, netSalary, reason, user }) {
  const authorized = user.isPersonalTeamLeader || HR_ROLES.includes(user.role);
  if (!authorized) throw fail('Not authorized. Only the Personal Team Leader or HR Managers can edit Net Salary.', 403);
  let contract = await Contract.findOne({ employeeId: id });
  if (!contract) contract = await Contract.findById(id);
  if (!contract) throw fail('Contract not found', 404);
  contract.salaryHistory.push({ amount: Number(netSalary), changedBy: user._id, reason: reason || 'Adjustment by Team Leader' });
  contract.netSalary = netSalary;
  await contract.save();
  return contract;
}

module.exports = { upsertSalaryComponent, deleteSalaryComponent, updateNetSalary };
