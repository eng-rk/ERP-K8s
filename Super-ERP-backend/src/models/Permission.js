const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  permissionId: {
    type: String,
    required: [true, 'Permission ID is required'],
    unique: true,
    index: true,
    trim: true
  },
  group: {
    type: String,
    required: [true, 'Permission group is required'],
    index: true,
    enum: [
      'IAM',
      'CRM',
      'WMS',
      'SCM',
      'HRM',
      'ATTENDANCE',
      'PAYROLL',
      'TALENT',
      'TICKETS',
      'MARKETING',
      'ADMIN'
    ]
  },
  submodule: {
    type: String,
    required: [true, 'Submodule name is required'],
    trim: true
  },
  category: {
    type: String,
    default: '',
    trim: true
  },
  uiGroup: {
    type: String,
    default: '',
    trim: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  actionName: {
    type: String,
    required: [true, 'Action name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW',
    index: true
  },
  isDangerous: {
    type: Boolean,
    default: false
  },
  requiresAudit: {
    type: Boolean,
    default: true
  },
  featureFlag: {
    type: String,
    default: null
  },
  licenseRequired: {
    type: String,
    default: null
  },
  dependencyIds: {
    type: [String],
    default: []
  },
  conflictingPermissions: {
    type: [String],
    default: []
  },
  hidden: {
    type: Boolean,
    default: false
  },
  deprecated: {
    type: Boolean,
    default: false
  },
  defaultScope: {
    type: String,
    enum: ['SELF', 'TEAM', 'DEPARTMENT', 'BRANCH', 'COMPANY', 'GLOBAL'],
    default: 'COMPANY'
  },
  allowedScopes: {
    type: [String],
    enum: ['SELF', 'TEAM', 'DEPARTMENT', 'BRANCH', 'COMPANY', 'GLOBAL'],
    default: ['SELF', 'TEAM', 'DEPARTMENT', 'BRANCH', 'COMPANY', 'GLOBAL']
  }
}, { timestamps: true });

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
