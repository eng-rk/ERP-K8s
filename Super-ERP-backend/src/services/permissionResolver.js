const User = require('../models/User');
const Role = require('../models/Role');
const { resolveHighestScope } = require('./scopeResolver');
const permissionCache = require('../utils/permissionCache');

/**
 * Recursively resolve all permissions from a role including parent roles
 */
const resolveRolePermissions = async (roleId, visitedRoleIds = new Set()) => {
  if (!roleId || visitedRoleIds.has(roleId.toString())) {
    return { grants: [], denies: [] };
  }
  visitedRoleIds.add(roleId.toString());

  const role = await Role.findById(roleId).populate('parentRoles');
  if (!role || !role.enabled) {
    return { grants: [], denies: [] };
  }

  let grants = [...(role.permissions || [])];
  let denies = [...(role.denyPermissions || [])];

  if (role.parentRoles && role.parentRoles.length > 0) {
    for (const parent of role.parentRoles) {
      const parentResolved = await resolveRolePermissions(parent._id || parent, visitedRoleIds);
      grants = grants.concat(parentResolved.grants);
      denies = denies.concat(parentResolved.denies);
    }
  }

  return { grants, denies };
};

/**
 * Main Effective Permission Resolver for a User
 */
const resolveEffectivePermissions = async (userId, bypassCache = false) => {
  if (!userId) return {};

  const version = 1;
  if (!bypassCache) {
    const cached = permissionCache.get(userId.toString(), version);
    if (cached) return cached;
  }

  const user = await User.findById(userId).populate({
    path: 'roles',
    populate: { path: 'parentRoles' }
  });

  if (!user || !user.isActive) {
    return {};
  }

  const effectiveMap = {};
  const explicitDenySet = new Set();

  // 1. Resolve Grants & Denies from User's Assigned Roles & Parent Roles
  if (user.roles && user.roles.length > 0) {
    for (const role of user.roles) {
      if (!role.enabled) continue;
      const { grants, denies } = await resolveRolePermissions(role._id);

      // Apply grants
      for (const claim of grants) {
        const existing = effectiveMap[claim.permissionId];
        const newScope = existing
          ? resolveHighestScope(existing.scope, claim.scope)
          : claim.scope;

        effectiveMap[claim.permissionId] = {
          permissionId: claim.permissionId,
          scope: newScope,
          granted: true,
          source: 'ROLE'
        };
      }

      // Record role denies
      for (const deny of denies) {
        explicitDenySet.add(deny.permissionId);
      }
    }
  }

  // 2. Resolve Custom Granted Permission Overrides from User Profile
  if (user.customPermissionClaims && user.customPermissionClaims.length > 0) {
    for (const claim of user.customPermissionClaims) {
      if (claim.granted) {
        const existing = effectiveMap[claim.permissionId];
        const newScope = existing
          ? resolveHighestScope(existing.scope, claim.scope)
          : claim.scope;

        effectiveMap[claim.permissionId] = {
          permissionId: claim.permissionId,
          scope: newScope,
          granted: true,
          source: 'CUSTOM_GRANT'
        };
      } else {
        // Explicit user level deny
        explicitDenySet.add(claim.permissionId);
      }
    }
  }

  // 3. Apply Explicit Denies (Override any Grants)
  for (const deniedPermId of explicitDenySet) {
    if (effectiveMap[deniedPermId]) {
      effectiveMap[deniedPermId].granted = false;
      effectiveMap[deniedPermId].isExplicitDeny = true;
    }
  }

  // Store in cache
  permissionCache.set(userId.toString(), effectiveMap, version);

  return effectiveMap;
};

module.exports = {
  resolveEffectivePermissions,
  resolveRolePermissions
};
