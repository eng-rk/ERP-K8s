import React from 'react';
import { ChevronRight, ChevronDown, FolderOpen, Folder } from 'lucide-react';
import { AtomicPermissionRow } from './AtomicPermissionRow';

const MODULE_TITLES = {
  CRM: 'Customer Relationship Management (CRM)',
  HR: 'Human Resource Management (HR)',
  Payroll: 'Payroll & Compensation',
  Inventory: 'Warehouse & Inventory (WMS)',
  Procurement: 'Supply Chain & Procurement',
  Attendance: 'Time & Attendance Tracking',
  IAM: 'Identity & Access Management (IAM)',
  Administration: 'System Administration',
  Marketing: 'Marketing & Campaigns',
  Support: 'Technical Support & Desk',
  Finance: 'Finance & Accounting',
  OTHER: 'General System Features'
};

export const ModuleAccordionGroup = React.memo(({
  moduleName,
  submodulesMap,
  effectiveMap,
  rolePermissionsSet,
  userCustomMap,
  isExpanded,
  onToggleExpand,
  onToggleGrant,
  onScopeChange,
  readOnly = false
}) => {
  let totalInModule = 0;
  let grantedInModule = 0;

  Object.values(submodulesMap).forEach(subList => {
    subList.forEach(p => {
      totalInModule++;
      const userCustom = userCustomMap[p.permissionId];
      const isGranted = userCustom
        ? userCustom.granted
        : (effectiveMap[p.permissionId]?.granted || false);

      if (isGranted) grantedInModule++;
    });
  });

  const percentGranted = totalInModule > 0 ? Math.round((grantedInModule / totalInModule) * 100) : 0;
  const formattedTitle = MODULE_TITLES[moduleName] || `${moduleName} Module`;

  return (
    <div className="card" style={{ marginBottom: 14, overflow: 'hidden', padding: 0 }}>
      {/* Module Header Bar */}
      <div
        onClick={() => onToggleExpand(moduleName)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'var(--bg-secondary)',
          borderBottom: isExpanded ? '1px solid var(--border-color)' : 'none',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {isExpanded ? <ChevronDown size={16} style={{ color: 'var(--accent-primary)' }} /> : <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />}
          {isExpanded ? <FolderOpen size={16} style={{ color: 'var(--accent-primary)' }} /> : <Folder size={16} style={{ color: 'var(--text-muted)' }} />}
          <div>
            <strong style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
              {formattedTitle}
            </strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <div style={{ width: 80, height: 4, background: 'var(--border-color)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${percentGranted}%`, height: '100%', background: percentGranted === 100 ? 'var(--accent-success)' : 'var(--accent-primary)', transition: 'width 0.3s ease' }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {percentGranted}% ({grantedInModule}/{totalInModule})
              </span>
            </div>
          </div>
        </div>

        <span className={`badge ${grantedInModule === totalInModule ? 'badge-qualified' : grantedInModule > 0 ? 'badge-new' : 'badge-lost'}`}>
          {grantedInModule} / {totalInModule} Granted
        </span>
      </div>

      {/* Submodule Section Lists */}
      {isExpanded && (
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, background: 'var(--bg-card)' }}>
          {Object.entries(submodulesMap).map(([submoduleName, permissionList]) => (
            <div key={submoduleName} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Submodule Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 4, borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {submoduleName}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  ({permissionList.length} claims)
                </span>
              </div>

              {/* Atomic Permission Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 8 }}>
                {permissionList.map((p) => {
                  const userCustom = userCustomMap[p.permissionId];
                  const effective = effectiveMap[p.permissionId];

                  const isGranted = userCustom
                    ? userCustom.granted
                    : (effective?.granted || false);

                  const currentScope = userCustom
                    ? userCustom.scope
                    : (effective?.scope || p.defaultScope || 'COMPANY');

                  const isInherited = rolePermissionsSet.has(p.permissionId);
                  const isOverride = !!userCustom;

                  return (
                    <AtomicPermissionRow
                      key={p.permissionId}
                      permission={p}
                      isGranted={isGranted}
                      currentScope={currentScope}
                      isInherited={isInherited}
                      isOverride={isOverride}
                      onToggleGrant={onToggleGrant}
                      onScopeChange={onScopeChange}
                      readOnly={readOnly}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

ModuleAccordionGroup.displayName = 'ModuleAccordionGroup';
