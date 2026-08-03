const { resolveEffectivePermissions } = require('../services/permissionResolver');
const { hasScope } = require('../services/scopeResolver');
const Permission = require('../models/Permission');

/**
 * Enterprise Authorization Middleware Guard
 * 
 * Usage:
 * checkPermission('payroll.engine.approve_run')
 * checkPermission('crm.leads.view', { requiredScope: 'TEAM' })
 */
const checkPermission = (permissionId, options = {}) => {
  return async (req, res, next) => {
    try {
      // 1. Verify authenticated user exists
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required. No active session found.'
        });
      }

      const {
        requiredScope = null,
        allowSelf = false,
        allowWildcard = true,
        audit = true
      } = options;

      // 2. Resolve user effective permissions
      const effectivePermissions = await resolveEffectivePermissions(req.user._id);

      // 3. Fallback for Super Admin string role legacy compatibility
      const isSuperAdminRole = req.user.role === 'Super CRM Administrator' || req.user.role === 'System Architect';

      let matchedClaim = effectivePermissions[permissionId];

      // Support wildcard matching if enabled (e.g. 'iam.*' or '*')
      if (!matchedClaim && allowWildcard && !isSuperAdminRole) {
        const parts = permissionId.split('.');
        if (parts.length > 1) {
          const groupWildcard = `${parts[0]}.*`;
          if (effectivePermissions[groupWildcard] && effectivePermissions[groupWildcard].granted) {
            matchedClaim = effectivePermissions[groupWildcard];
          }
        }
        if (!matchedClaim && effectivePermissions['*'] && effectivePermissions['*'].granted) {
          matchedClaim = effectivePermissions['*'];
        }
      }

      // Check permission grant status
      const isGranted = isSuperAdminRole || (matchedClaim && matchedClaim.granted && !matchedClaim.isExplicitDeny);

      if (!isGranted) {
        return res.status(403).json({
          success: false,
          message: `Access Denied: You do not possess the required permission claim '${permissionId}'.`,
          requiredPermission: permissionId
        });
      }

      // 4. Validate Scope if required
      const userScope = isSuperAdminRole ? 'GLOBAL' : (matchedClaim?.scope || 'COMPANY');

      if (requiredScope && !isSuperAdminRole) {
        const scopeValid = hasScope(userScope, requiredScope);
        if (!scopeValid) {
          return res.status(403).json({
            success: false,
            message: `Access Denied: Your scope '${userScope}' is insufficient for required scope '${requiredScope}'.`,
            requiredPermission: permissionId,
            userScope,
            requiredScope
          });
        }
      }

      // 5. Attach authorization context to request object
      req.permission = permissionId;
      req.permissionScope = userScope;
      req.permissionMetadata = {
        permissionId,
        userScope,
        isSuperAdminBypass: isSuperAdminRole,
        auditRequired: audit
      };

      return next();

    } catch (err) {
      console.error('[Authorization Engine Error]:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal authorization error while evaluating security policy.'
      });
    }
  };
};

module.exports = {
  checkPermission
};
