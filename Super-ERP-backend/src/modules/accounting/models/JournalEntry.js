const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  journalNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
  date: { type: Date, default: Date.now, required: true },
  fiscalPeriod: { type: String, default: () => new Date().toISOString().slice(0, 7) },
  currency: { type: String, default: 'EGP' },
  exchangeRate: { type: Number, default: 1, min: 0 },
  sourceType: { type: String, enum: ['SALES_INVOICE_POSTED', 'PURCHASE_INVOICE_POSTED', 'CUSTOMER_PAYMENT_POSTED', 'SUPPLIER_PAYMENT_POSTED', 'INVENTORY_ISSUE_POSTED', 'GOODS_RECEIPT_POSTED', 'PAYROLL_POSTED', 'ASSET_DEPRECIATED', 'MANUAL_JOURNAL'], default: 'MANUAL_JOURNAL' },
  sourceId: { type: String, default: '' },
  description: { type: String, required: true, trim: true },
  lines: [{ account: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountingAccount', required: true }, debit: { type: Number, default: 0, min: 0 }, credit: { type: Number, default: 0, min: 0 }, baseAmountEgp: { type: Number, required: true, min: 0 }, costCenter: { type: String, default: '' }, project: { type: String, default: '' }, description: { type: String, default: '' } }],
  totalDebit: { type: Number, required: true, min: 0 },
  totalCredit: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['Draft', 'Pending Approval', 'Approved', 'Posted', 'Reversed', 'Cancelled'], default: 'Draft' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  postedAt: { type: Date, default: null },
  reversedJournalId: { type: mongoose.Schema.Types.ObjectId, ref: 'AccountingJournalEntry', default: null }
}, { timestamps: true });

journalEntrySchema.index({ journalNumber: 1, date: 1, status: 1 });
module.exports = mongoose.model('AccountingJournalEntry', journalEntrySchema);
