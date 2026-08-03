const mongoose = require('mongoose');

const securityAuditLedgerSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  actorIp: {
    type: String,
    default: '0.0.0.0'
  },
  requestId: {
    type: String,
    default: null,
    index: true
  },
  correlationId: {
    type: String,
    default: null,
    index: true
  },
  sessionId: {
    type: String,
    default: null
  },
  deviceId: {
    type: String,
    default: null
  },
  browser: {
    type: String,
    default: null
  },
  geoLocation: {
    type: String,
    default: null
  },
  targetType: {
    type: String,
    enum: ['ROLE', 'USER_PERMISSION', 'PERMISSION_REGISTRY', 'SYSTEM_SETTING'],
    required: true,
    index: true
  },
  targetId: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  beforeHash: {
    type: String,
    default: null
  },
  afterHash: {
    type: String,
    default: null
  },
  reason: {
    type: String,
    default: ''
  },
  hashSignature: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const SecurityAuditLedger = mongoose.model('SecurityAuditLedger', securityAuditLedgerSchema);

module.exports = SecurityAuditLedger;
