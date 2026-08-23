const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  baseSalary: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  hireDate: { type: Date, required: true },
  contractEndDate: { type: Date },
  govDocs: {
    nationalId: { type: String, default: '' }, socialInsurance: { type: String, default: '' },
    militaryStatus: { type: String, default: '' }, graduationCertificate: { type: String, default: '' },
    criminalRecord: { type: String, default: '' }
  },
  requiredDocsToUpload: { type: [String], default: ['National ID', 'Social Insurance Certificate', 'Military Status', 'Graduation Certificate', 'Criminal Record'] },
  salaryHistory: [{ amount: Number, changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, changedAt: { type: Date, default: Date.now }, reason: { type: String, default: '' } }],
  govDocsDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  customGovDocs: { type: mongoose.Schema.Types.Mixed, default: {} },
  customGovDocsDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  signedContractFile: { type: String, default: '' },
  salaryComponents: [{ label: { type: String, required: true }, type: { type: String, enum: ['Earning', 'Deduction'], required: true }, valueType: { type: String, enum: ['Fixed', 'Percentage'], default: 'Fixed' }, value: { type: Number, required: true }, kpiLinked: { type: Boolean, default: false }, note: { type: String, default: '' }, addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, addedAt: { type: Date, default: Date.now } }]
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);
