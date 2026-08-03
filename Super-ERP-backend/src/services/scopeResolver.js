const { SCOPES, SCOPE_HIERARCHY } = require('../utils/permissionScopes');

/**
 * Compare two scopes.
 * Returns 1 if scopeA > scopeB
 * Returns 0 if scopeA === scopeB
 * Returns -1 if scopeA < scopeB
 */
const compareScopes = (scopeA, scopeB) => {
  const indexA = SCOPE_HIERARCHY.indexOf(scopeA);
  const indexB = SCOPE_HIERARCHY.indexOf(scopeB);

  if (indexA === -1 || indexB === -1) return 0;
  if (indexA > indexB) return 1;
  if (indexA < indexB) return -1;
  return 0;
};

/**
 * Returns true if userScope is equal to or higher in hierarchy than requiredScope
 */
const hasScope = (userScope, requiredScope) => {
  if (!userScope || !requiredScope) return false;
  if (userScope === SCOPES.GLOBAL) return true;
  return compareScopes(userScope, requiredScope) >= 0;
};

/**
 * Returns the higher of two scopes
 */
const resolveHighestScope = (scope1, scope2) => {
  if (!scope1) return scope2 || SCOPES.SELF;
  if (!scope2) return scope1 || SCOPES.SELF;
  return compareScopes(scope1, scope2) >= 0 ? scope1 : scope2;
};

/**
 * Expand ABAC scope into database query filter parameters
 */
const expandScope = (userScope, user, scopeContext = {}) => {
  const employeeId = user._id || user.id;
  const context = {
    companyId: scopeContext.companyId || user.scopeContext?.companyId || null,
    branchId: scopeContext.branchId || user.scopeContext?.branchId || null,
    departmentId: scopeContext.departmentId || user.scopeContext?.departmentId || user.department || null,
    teamId: scopeContext.teamId || user.scopeContext?.teamId || null
  };

  switch (userScope) {
    case SCOPES.SELF:
      return { predicate: { employeeId }, context };
    case SCOPES.TEAM:
      return { predicate: { teamId: context.teamId }, context };
    case SCOPES.DEPARTMENT:
      return { predicate: { departmentId: context.departmentId }, context };
    case SCOPES.BRANCH:
      return { predicate: { branchId: context.branchId }, context };
    case SCOPES.COMPANY:
      return { predicate: { companyId: context.companyId }, context };
    case SCOPES.GLOBAL:
    default:
      return { predicate: {}, context };
  }
};

module.exports = {
  compareScopes,
  hasScope,
  resolveHighestScope,
  expandScope
};
