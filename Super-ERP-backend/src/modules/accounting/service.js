const Account = require('./models/Account');
const CostCenter = require('./models/CostCenter');
const JournalEntry = require('./models/JournalEntry');

async function createAccount(payload) {
  const accountCode = payload.accountCode.trim().toUpperCase();
  if (await Account.exists({ accountCode })) throw Object.assign(new Error('Account code already exists'), { statusCode: 409 });
  return Account.create({ ...payload, accountCode });
}

async function listAccounts(filter = {}) {
  return Account.find(filter).sort({ accountCode: 1 }).lean();
}

async function createCostCenter(payload) {
  const code = payload.code.trim().toUpperCase();
  if (await CostCenter.exists({ code })) throw Object.assign(new Error('Cost center code already exists'), { statusCode: 409 });
  return CostCenter.create({ ...payload, code });
}

async function listCostCenters(filter = {}) { return CostCenter.find(filter).sort({ code: 1 }).lean(); }

async function createJournal(payload, userId) {
  const totalDebit = payload.lines.reduce((s, l) => s + Number(l.debit || 0), 0);
  const totalCredit = payload.lines.reduce((s, l) => s + Number(l.credit || 0), 0);
  if (Math.abs(totalDebit - totalCredit) > 0.000001) throw Object.assign(new Error('Journal is not balanced'), { statusCode: 400 });
  if (await JournalEntry.exists({ journalNumber: payload.journalNumber.trim().toUpperCase() })) throw Object.assign(new Error('Journal number already exists'), { statusCode: 409 });
  return JournalEntry.create({ ...payload, journalNumber: payload.journalNumber.trim().toUpperCase(), totalDebit, totalCredit, postedBy: payload.status === 'Posted' ? userId : null, postedAt: payload.status === 'Posted' ? new Date() : null });
}

async function listJournals(filter = {}, options = {}) {
  const limit = Math.min(Math.max(Number(options.limit) || 25, 1), 100);
  const page = Math.max(Number(options.page) || 1, 1);
  const [items, total] = await Promise.all([JournalEntry.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(limit).lean(), JournalEntry.countDocuments(filter)]);
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
}

module.exports = { createAccount, listAccounts, createCostCenter, listCostCenters, createJournal, listJournals };
