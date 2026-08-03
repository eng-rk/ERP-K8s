/**
 * Centralized Data Visibility Scopes (ABAC) & Scope Hierarchy
 */
const SCOPES = {
  SELF: 'SELF',
  TEAM: 'TEAM',
  DEPARTMENT: 'DEPARTMENT',
  BRANCH: 'BRANCH',
  COMPANY: 'COMPANY',
  GLOBAL: 'GLOBAL'
};

const SCOPE_HIERARCHY = [
  SCOPES.SELF,
  SCOPES.TEAM,
  SCOPES.DEPARTMENT,
  SCOPES.BRANCH,
  SCOPES.COMPANY,
  SCOPES.GLOBAL
];

/**
 * Returns true if scopeA is greater than or equal to scopeB in hierarchy
 */
const isScopeEqualOrGreater = (scopeA, scopeB) => {
  const indexA = SCOPE_HIERARCHY.indexOf(scopeA);
  const indexB = SCOPE_HIERARCHY.indexOf(scopeB);
  if (indexA === -1 || indexB === -1) return false;
  return indexA >= indexB;
};

module.exports = {
  SCOPES,
  SCOPE_HIERARCHY,
  isScopeEqualOrGreater
};
