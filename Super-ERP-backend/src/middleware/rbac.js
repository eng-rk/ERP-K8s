/**
 * Role-Based Access Control (RBAC) Legacy Middleware
 * Preserves 100% backward compatibility for existing route definitions.
 */
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User authentication required.' });
    }

    const userLegacyRole = req.user.role;
    const userRoleObjects = req.user.roles || [];

    // Check legacy string enum role
    let isAuthorized = userLegacyRole && roles.includes(userLegacyRole);

    // Check normalized Role object codes / names if legacy check didn't match
    if (!isAuthorized && Array.isArray(userRoleObjects) && userRoleObjects.length > 0) {
      isAuthorized = userRoleObjects.some(r => {
        const code = r.code || r.name;
        const name = r.name;
        return roles.includes(code) || roles.includes(name);
      });
    }

    if (!isAuthorized) {
      return res.status(403).json({
        message: `User role '${userLegacyRole || 'N/A'}' is not authorized to access this resource`
      });
    }

    next();
  };
};
