const crypto = require('crypto');
const Permission = require('../models/Permission');
const Role = require('../models/Role');
const User = require('../models/User');
const SecurityAuditLedger = require('../models/SecurityAuditLedger');
const { ROLE_TEMPLATES } = require('../utils/roleTemplateConstants');
const { resolveEffectivePermissions } = require('../services/permissionResolver');
const { SCOPE_HIERARCHY } = require('../utils/permissionScopes');
const permissionCache = require('../utils/permissionCache');

const logAudit = async ({ req, action, targetType, targetId, oldValue = null, newValue = null, reason = '' }) => {
  try {
    await SecurityAuditLedger.create({
      eventId: crypto.randomUUID(),
      timestamp: new Date(),
      actorId: req.user?._id || null,
      actorIp: req.ip || req.connection?.remoteAddress || '0.0.0.0',
      requestId: req.headers['x-request-id'] || null,
      correlationId: req.headers['x-correlation-id'] || null,
      sessionId: req.headers['x-session-id'] || null,
      browser: req.headers['user-agent'] || null,
      targetType,
      targetId: String(targetId),
      action,
      oldValue,
      newValue,
      reason
    });
  } catch (err) {
    console.error('SecurityAuditLedger logAudit error:', err.message);
  }
};

// ─── PERMISSION REGISTRY APIS ──────────────────────────────────────────────

/**
 * @desc    Get all permissions in master registry
 * @route   GET /api/iam/permissions
 * @access  Private (iam.permissions.view_matrix)
 */
const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ displayOrder: 1, module: 1, permissionId: 1 });
    return res.status(200).json({
      success: true,
      count: permissions.length,
      data: permissions
    });
  } catch (err) {
    console.error('getAllPermissions error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving permissions registry.' });
  }
};

/**
 * @desc    Get permissions formatted as module -> submodule UI tree
 * @route   GET /api/iam/permissions/tree
 * @access  Private (iam.permissions.view_matrix)
 */
const getPermissionTree = async (req, res) => {
  try {
    const permissions = await Permission.find().sort({ displayOrder: 1 });

    const tree = {};
    for (const p of permissions) {
      if (!tree[p.module]) {
        tree[p.module] = {};
      }
      if (!tree[p.module][p.submodule]) {
        tree[p.module][p.submodule] = [];
      }
      tree[p.module][p.submodule].push(p);
    }

    return res.status(200).json({
      success: true,
      data: tree
    });
  } catch (err) {
    console.error('getPermissionTree error:', err);
    return res.status(500).json({ success: false, message: 'Server error generating permission tree.' });
  }
};

/**
 * @desc    Get single permission details
 * @route   GET /api/iam/permissions/:id
 * @access  Private (iam.permissions.view_matrix)
 */
const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findOne({ permissionId: req.params.id });
    if (!permission) {
      return res.status(404).json({ success: false, message: `Permission '${req.params.id}' not found.` });
    }
    return res.status(200).json({ success: true, data: permission });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error retrieving permission.' });
  }
};

// ─── ROLE MANAGEMENT APIS ──────────────────────────────────────────────────

/**
 * @desc    Get all roles
 * @route   GET /api/iam/roles
 * @access  Private (iam.roles.view)
 */
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find()
      .populate('parentRoles', 'name code')
      .populate('createdBy', 'firstName lastName email')
      .sort({ isSystemRole: -1, priority: -1, name: 1 });

    return res.status(200).json({
      success: true,
      count: roles.length,
      data: roles
    });
  } catch (err) {
    console.error('getAllRoles error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving roles.' });
  }
};

/**
 * @desc    Get role by ID
 * @route   GET /api/iam/roles/:id
 * @access  Private (iam.roles.view)
 */
const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id)
      .populate('parentRoles', 'name code')
      .populate('createdBy', 'firstName lastName email');

    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }

    return res.status(200).json({ success: true, data: role });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error retrieving role.' });
  }
};

/**
 * @desc    Create new custom role
 * @route   POST /api/iam/roles
 * @access  Private (iam.roles.create)
 */
const createRole = async (req, res) => {
  try {
    const { name, code, description, priority, permissions, denyPermissions, parentRoles } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Role name and uppercase code are required.' });
    }

    const formattedCode = code.toUpperCase().trim();

    // Check duplicates
    const existingName = await Role.findOne({ name: name.trim() });
    if (existingName) {
      return res.status(409).json({ success: false, message: `Role name '${name}' already exists.` });
    }

    const existingCode = await Role.findOne({ code: formattedCode });
    if (existingCode) {
      return res.status(409).json({ success: false, message: `Role code '${formattedCode}' already exists.` });
    }

    // Validate permissions & scopes
    if (permissions && Array.isArray(permissions)) {
      for (const item of permissions) {
        if (item.scope && !SCOPE_HIERARCHY.includes(item.scope)) {
          return res.status(400).json({ success: false, message: `Invalid scope '${item.scope}' for permission ${item.permissionId}.` });
        }
      }
    }

    const role = await Role.create({
      name: name.trim(),
      code: formattedCode,
      description: description || '',
      priority: priority || 0,
      isSystemRole: false,
      systemLocked: false,
      permissions: permissions || [],
      denyPermissions: denyPermissions || [],
      parentRoles: parentRoles || [],
      createdBy: req.user._id
    });

    await logAudit({
      req,
      action: 'CREATE_ROLE',
      targetType: 'ROLE',
      targetId: role._id,
      newValue: role.toObject()
    });

    return res.status(201).json({
      success: true,
      message: 'Role created successfully.',
      data: role
    });

  } catch (err) {
    console.error('createRole error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error creating role.' });
  }
};

/**
 * @desc    Update role or permission claims
 * @route   PUT /api/iam/roles/:id
 * @access  Private (iam.roles.edit / iam.roles.manage_permissions)
 */
const updateRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }

    if (role.systemLocked) {
      return res.status(403).json({ success: false, message: 'Cannot modify system locked role.' });
    }

    const oldValue = role.toObject();
    const { name, description, priority, enabled, permissions, denyPermissions, parentRoles } = req.body;

    if (name && name !== role.name) {
      const existingName = await Role.findOne({ name: name.trim() });
      if (existingName) {
        return res.status(409).json({ success: false, message: `Role name '${name}' already exists.` });
      }
      role.name = name.trim();
    }

    if (description !== undefined) role.description = description;
    if (priority !== undefined) role.priority = priority;
    if (enabled !== undefined) role.enabled = enabled;
    if (permissions !== undefined) role.permissions = permissions;
    if (denyPermissions !== undefined) role.denyPermissions = denyPermissions;
    if (parentRoles !== undefined) role.parentRoles = parentRoles;

    await role.save();

    await logAudit({
      req,
      action: 'UPDATE_ROLE',
      targetType: 'ROLE',
      targetId: role._id,
      oldValue,
      newValue: role.toObject()
    });

    return res.status(200).json({
      success: true,
      message: 'Role updated successfully.',
      data: role
    });

  } catch (err) {
    console.error('updateRole error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating role.' });
  }
};

/**
 * @desc    Delete custom role
 * @route   DELETE /api/iam/roles/:id
 * @access  Private (iam.roles.delete)
 */
const deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Role not found.' });
    }

    if (role.isSystemRole || role.systemLocked) {
      return res.status(403).json({ success: false, message: 'System protected roles cannot be deleted.' });
    }

    const oldValue = role.toObject();
    await Role.findByIdAndDelete(req.params.id);

    await logAudit({
      req,
      action: 'DELETE_ROLE',
      targetType: 'ROLE',
      targetId: req.params.id,
      oldValue
    });

    return res.status(200).json({
      success: true,
      message: 'Role deleted successfully.'
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error deleting role.' });
  }
};

/**
 * @desc    Clone an existing role
 * @route   POST /api/iam/roles/:id/clone
 * @access  Private (iam.roles.duplicate)
 */
const cloneRole = async (req, res) => {
  try {
    const targetRole = await Role.findById(req.params.id);
    if (!targetRole) {
      return res.status(404).json({ success: false, message: 'Target role for cloning not found.' });
    }

    const { newName, newCode } = req.body;
    if (!newName || !newCode) {
      return res.status(400).json({ success: false, message: 'newName and uppercase newCode are required for cloning.' });
    }

    const formattedCode = newCode.toUpperCase().trim();

    const existingCode = await Role.findOne({ code: formattedCode });
    if (existingCode) {
      return res.status(409).json({ success: false, message: `Role code '${formattedCode}' already exists.` });
    }

    const cloned = await Role.create({
      name: newName.trim(),
      code: formattedCode,
      description: `Cloned from ${targetRole.name}`,
      isSystemRole: false,
      systemLocked: false,
      permissions: targetRole.permissions,
      denyPermissions: targetRole.denyPermissions,
      parentRoles: targetRole.parentRoles,
      createdBy: req.user._id
    });

    await logAudit({
      req,
      action: 'CLONE_ROLE',
      targetType: 'ROLE',
      targetId: cloned._id,
      oldValue: { clonedFromId: targetRole._id, name: targetRole.name },
      newValue: cloned.toObject()
    });

    return res.status(201).json({
      success: true,
      message: 'Role cloned successfully.',
      data: cloned
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error cloning role.' });
  }
};

// ─── ROLE PRESET TEMPLATE APIS ─────────────────────────────────────────────

/**
 * @desc    Get preset role templates catalog
 * @route   GET /api/iam/role-templates
 * @access  Private (iam.roles.view)
 */
const getRoleTemplates = async (req, res) => {
  return res.status(200).json({
    success: true,
    count: ROLE_TEMPLATES.length,
    data: ROLE_TEMPLATES
  });
};

/**
 * @desc    Create a new role from a preset template code
 * @route   POST /api/iam/role-templates/:code/create-role
 * @access  Private (iam.roles.create)
 */
const createRoleFromTemplate = async (req, res) => {
  try {
    const templateCode = req.params.code.toUpperCase().trim();
    const template = ROLE_TEMPLATES.find(t => t.roleCode === templateCode);

    if (!template) {
      return res.status(404).json({ success: false, message: `Template code '${templateCode}' not found.` });
    }

    const existingCode = await Role.findOne({ code: template.roleCode });
    if (existingCode) {
      return res.status(409).json({ success: false, message: `Role '${template.roleCode}' already instantiated in database.` });
    }

    const role = await Role.create({
      name: template.displayName,
      code: template.roleCode,
      description: template.description,
      isSystemRole: true,
      systemLocked: false,
      permissions: template.permissions,
      createdBy: req.user._id
    });

    await logAudit({
      req,
      action: 'INSTANTIATE_ROLE_TEMPLATE',
      targetType: 'ROLE',
      targetId: role._id,
      newValue: role.toObject(),
      reason: `Instantiated from template ${templateCode}`
    });

    return res.status(201).json({
      success: true,
      message: `Role '${template.displayName}' instantiated from template.`,
      data: role
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error instantiating template role.' });
  }
};

// ─── USER PERMISSIONS & ROLES ASSIGNMENT APIS ──────────────────────────────

/**
 * @desc    Get effective resolved permissions for a specific user
 * @route   GET /api/iam/users/:id/permissions
 * @access  Private (iam.users.view_sensitive)
 */
const getUserEffectivePermissions = async (req, res) => {
  try {
    const userId = req.params.id;
    const targetUser = await User.findById(userId).select('-password');

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found.' });
    }

    const resolved = await resolveEffectivePermissions(userId, true);

    return res.status(200).json({
      success: true,
      userId,
      roles: targetUser.roles,
      customPermissionClaims: targetUser.customPermissionClaims,
      effectivePermissions: resolved
    });

  } catch (err) {
    console.error('getUserEffectivePermissions error:', err);
    return res.status(500).json({ success: false, message: 'Server error resolving user permissions.' });
  }
};

/**
 * @desc    Update user custom permission grants or explicit denies
 * @route   PUT /api/iam/users/:id/permissions
 * @access  Private (iam.users.assign_role)
 */
const updateUserCustomPermissions = async (req, res) => {
  try {
    const userId = req.params.id;
    const { customPermissionClaims } = req.body;

    if (!Array.isArray(customPermissionClaims)) {
      return res.status(400).json({ success: false, message: 'customPermissionClaims must be an array.' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found.' });
    }

    const oldValue = targetUser.customPermissionClaims;
    targetUser.customPermissionClaims = customPermissionClaims;
    await targetUser.save();

    // Invalidate user cache
    permissionCache.invalidate(userId);

    const updatedEffective = await resolveEffectivePermissions(userId, true);

    await logAudit({
      req,
      action: 'UPDATE_USER_PERMISSIONS',
      targetType: 'USER_PERMISSION',
      targetId: userId,
      oldValue,
      newValue: customPermissionClaims
    });

    return res.status(200).json({
      success: true,
      message: 'User custom permissions updated.',
      data: {
        userId,
        customPermissionClaims: targetUser.customPermissionClaims,
        effectivePermissions: updatedEffective
      }
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error updating user permissions.' });
  }
};

/**
 * @desc    Update user assigned roles
 * @route   PUT /api/iam/users/:id/roles
 * @access  Private (iam.users.assign_role)
 */
const updateUserRoles = async (req, res) => {
  try {
    const userId = req.params.id;
    const { roleIds } = req.body;

    if (!Array.isArray(roleIds)) {
      return res.status(400).json({ success: false, message: 'roleIds must be an array of Role ObjectIds.' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found.' });
    }

    const oldValue = targetUser.roles;
    targetUser.roles = roleIds;
    await targetUser.save();

    // Invalidate user cache
    permissionCache.invalidate(userId);

    const updatedUser = await User.findById(userId).populate('roles', 'name code');
    const updatedEffective = await resolveEffectivePermissions(userId, true);

    await logAudit({
      req,
      action: 'ASSIGN_USER_ROLES',
      targetType: 'USER_PERMISSION',
      targetId: userId,
      oldValue,
      newValue: roleIds
    });

    return res.status(200).json({
      success: true,
      message: 'User roles updated.',
      data: {
        userId,
        roles: updatedUser.roles,
        effectivePermissions: updatedEffective
      }
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error updating user roles.' });
  }
};

module.exports = {
  getAllPermissions,
  getPermissionTree,
  getPermissionById,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  cloneRole,
  getRoleTemplates,
  createRoleFromTemplate,
  getUserEffectivePermissions,
  updateUserCustomPermissions,
  updateUserRoles
};
