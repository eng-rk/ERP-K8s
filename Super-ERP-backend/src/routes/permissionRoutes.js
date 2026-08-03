const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/authorize');

const {
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
} = require('../controllers/permissionController');

router.use(protect);

// ─── Permissions ─────────────────────────────────────────────────────────────
router.get('/permissions', checkPermission('iam.permissions.view_matrix'), getAllPermissions);
router.get('/permissions/tree', checkPermission('iam.permissions.view_matrix'), getPermissionTree);
router.get('/permissions/:id', checkPermission('iam.permissions.view_matrix'), getPermissionById);

// ─── Roles ───────────────────────────────────────────────────────────────────
router.get('/roles', checkPermission('iam.roles.view'), getAllRoles);
router.get('/roles/:id', checkPermission('iam.roles.view'), getRoleById);
router.post('/roles', checkPermission('iam.roles.create'), createRole);
router.put('/roles/:id', checkPermission('iam.roles.edit'), updateRole);
router.delete('/roles/:id', checkPermission('iam.roles.delete'), deleteRole);
router.post('/roles/:id/clone', checkPermission('iam.roles.duplicate'), cloneRole);

// ─── Templates ───────────────────────────────────────────────────────────────
router.get('/role-templates', checkPermission('iam.roles.view'), getRoleTemplates);
router.post('/role-templates/:code/create-role', checkPermission('iam.roles.create'), createRoleFromTemplate);

// ─── Users Authorization Overrides ──────────────────────────────────────────
router.get('/users/:id/permissions', checkPermission('iam.users.view_sensitive'), getUserEffectivePermissions);
router.put('/users/:id/permissions', checkPermission('iam.users.assign_role'), updateUserCustomPermissions);
router.put('/users/:id/roles', checkPermission('iam.users.assign_role'), updateUserRoles);

module.exports = router;
