const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  employeeCode: { type: String, required: true, unique: true, trim: true, index: true },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', index: true },
  positionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Position', index: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  employmentStatus: { type: String, enum: ['active', 'inactive', 'terminated', 'on_leave'], default: 'active', index: true },
  joinDate: { type: Date },
  phone: { type: String, trim: true },
  emergencyContact: { name: String, phone: String, relation: String }
}, { timestamps: true });

employeeSchema.index({ departmentId: 1, employmentStatus: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
