const mongoose = require('mongoose');
const isId = (v) => mongoose.Types.ObjectId.isValid(v);

function validateJournal(body = {}) {
  const errors = [];
  if (!body.journalNumber?.trim()) errors.push('journalNumber is required');
  if (!body.description?.trim()) errors.push('description is required');
  if (!Array.isArray(body.lines) || body.lines.length < 2) errors.push('at least two journal lines are required');
  if (Array.isArray(body.lines)) {
    body.lines.forEach((line, i) => {
      if (!isId(line.account)) errors.push(`lines[${i}].account must be a valid id`);
      const debit = Number(line.debit || 0); const credit = Number(line.credit || 0);
      if (debit < 0 || credit < 0 || (debit > 0 && credit > 0) || (debit === 0 && credit === 0)) errors.push(`lines[${i}] must contain either debit or credit`);
    });
    const debit = body.lines.reduce((s, l) => s + Number(l.debit || 0), 0);
    const credit = body.lines.reduce((s, l) => s + Number(l.credit || 0), 0);
    if (Math.abs(debit - credit) > 0.000001) errors.push('journal is not balanced');
  }
  return errors;
}

module.exports = { validateJournal };
