const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'] },
  phone: { type: String, required: [true, 'Phone number is required'] },
  source: { type: String, enum: ['Meta', 'Google', 'Other'], required: [true, 'Source is required'] },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Converted', 'Lost'], default: 'New' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  notes: [{
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { name: String, email: String, role: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
