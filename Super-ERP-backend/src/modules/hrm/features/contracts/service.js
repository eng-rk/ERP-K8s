const Contract = require('./model');

const normalizeNumber = (value, field) => {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) throw Object.assign(new Error(`${field} must be a non-negative number`), { status: 400 });
  return number;
};

const list = async (filter = {}) => Contract.find(filter).populate('employeeId', 'name email role').sort({ createdAt: -1 });
const get = async (id) => {
  const contract = await Contract.findById(id).populate('employeeId', 'name email role');
  if (!contract) throw Object.assign(new Error('Contract not found'), { status: 404 });
  return contract;
};

const create = async (payload, actorId) => {
  const data = { ...payload };
  data.baseSalary = normalizeNumber(data.baseSalary, 'baseSalary');
  data.netSalary = normalizeNumber(data.netSalary, 'netSalary');
  if (!data.employeeId || !data.hireDate) throw Object.assign(new Error('employeeId and hireDate are required'), { status: 400 });
  if (data.contractEndDate && new Date(data.contractEndDate) < new Date(data.hireDate)) throw Object.assign(new Error('contractEndDate cannot be before hireDate'), { status: 400 });
  if (await Contract.exists({ employeeId: data.employeeId })) throw Object.assign(new Error('Employee already has a contract'), { status: 409 });
  if (data.salaryComponents) data.salaryComponents = data.salaryComponents.map(component => ({ ...component, addedBy: actorId }));
  return Contract.create(data);
};

const update = async (id, payload, actorId) => {
  const contract = await get(id);
  const data = { ...payload };
  if (data.baseSalary !== undefined) data.baseSalary = normalizeNumber(data.baseSalary, 'baseSalary');
  if (data.netSalary !== undefined) data.netSalary = normalizeNumber(data.netSalary, 'netSalary');
  const hireDate = data.hireDate || contract.hireDate;
  if (data.contractEndDate && new Date(data.contractEndDate) < new Date(hireDate)) throw Object.assign(new Error('contractEndDate cannot be before hireDate'), { status: 400 });
  if (data.baseSalary !== undefined && data.baseSalary !== contract.baseSalary) contract.salaryHistory.push({ amount: data.baseSalary, changedBy: actorId, reason: data.salaryChangeReason || 'Contract salary updated' });
  delete data.salaryChangeReason;
  Object.assign(contract, data);
  return contract.save();
};

const remove = async (id) => { const contract = await get(id); await contract.deleteOne(); return contract; };
const addSalaryComponent = async (id, component, actorId) => { const contract = await get(id); if (!component?.label || !component?.type || component.value === undefined) throw Object.assign(new Error('label, type and value are required'), { status: 400 }); contract.salaryComponents.push({ ...component, addedBy: actorId }); return contract.save(); };
const updateDocumentStatus = async (id, document, status, remarks, actorId) => { const allowed = ['nationalId','socialInsurance','militaryStatus','graduationCertificate','criminalRecord']; if (!allowed.includes(document)) throw Object.assign(new Error('Unsupported government document'), { status: 400 }); if (!['Pending Upload','Submitted','Approved','Rejected'].includes(status)) throw Object.assign(new Error('Invalid document status'), { status: 400 }); const contract = await get(id); contract.govDocsDetails[document] = { ...contract.govDocsDetails[document].toObject?.() || contract.govDocsDetails[document], status, remarks: remarks || '', verifiedBy: actorId }; return contract.save(); };

module.exports = { list, get, create, update, remove, addSalaryComponent, updateDocumentStatus };
