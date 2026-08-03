const mongoose = require('mongoose');

const rolePermissionSchema = new mongoose.Schema({
  permissionId: {
    type: String,
    required: true,
    trim: true
  },
  scope: {
    type: String,
    enum: ['SELF', 'TEAM', 'DEPARTMENT', 'BRANCH', 'COMPANY', 'GLOBAL'],
    default: 'COMPANY'
  }
}, { _id: false });

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Role code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: Number,
    default: 0
  },
  enabled: {
    type: Boolean,
    default: true
  },
  systemLocked: {
    type: Boolean,
    default: false
  },
  isSystemRole: {
    type: Boolean,
    default: false
  },
  parentRoles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  permissions: [rolePermissionSchema],
  denyPermissions: [rolePermissionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
