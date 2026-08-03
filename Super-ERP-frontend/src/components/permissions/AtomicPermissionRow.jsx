import React from 'react';
import { AlertTriangle, ShieldCheck, Link2, Zap } from 'lucide-react';
import { PermissionScopeSelector } from './PermissionScopeSelector';

const RISK_BADGES = {
  CRITICAL: 'badge-urgent',
  HIGH: 'badge-contacted',
  MEDIUM: 'badge-qualified',
  LOW: 'badge-new'
};

export const AtomicPermissionRow = React.memo(({
  permission,
  isGranted,
  currentScope,
  isInherited,
  isOverride,
  onToggleGrant,
  onScopeChange,
  readOnly = false
}) => {
  const {
    permissionId,
    displayName,
    description,
    riskLevel = 'LOW',
    isDangerous = false,
    requiresAudit = false,
    allowedScopes = ['SELF', 'TEAM', 'DEPARTMENT', 'BRANCH', 'COMPANY', 'GLOBAL']
  } = permission;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        padding: '10px 14px',
        borderRadius: 'var(--radius-sm)',
        background: isGranted ? (isOverride ? 'rgba(245, 158, 11, 0.06)' : 'var(--bg-card)') : 'var(--bg-card-hover)',
        border: `1px solid ${isGranted ? (isOverride ? 'rgba(245, 158, 11, 0.25)' : 'var(--border-color)') : 'var(--border-color)'}`,
        opacity: isGranted ? 1 : 0.8,
        transition: 'var(--transition)'
      }}
    >
      {/* Left: Checkbox + Name + Badges */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1, minWidth: 260 }}>
        <input
          type="checkbox"
          checked={isGranted}
          onChange={(e) => onToggleGrant(permissionId, e.target.checked)}
          disabled={readOnly}
          style={{ marginTop: 3, width: 15, height: 15, cursor: readOnly ? 'not-allowed' : 'pointer' }}
        />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: isGranted ? 'var(--text-primary)' : 'var(--text-muted)', textDecoration: isGranted ? 'none' : 'line-through' }}>
              {displayName}
            </span>

            <span className={`badge ${RISK_BADGES[riskLevel] || 'badge-new'}`} style={{ fontSize: 10, padding: '2px 6px' }}>
              {riskLevel}
            </span>

            {isDangerous && (
              <span className="badge badge-urgent" style={{ fontSize: 10, padding: '2px 6px', gap: 4 }}>
                <AlertTriangle size={11} />
                DANGEROUS
              </span>
            )}

            {requiresAudit && (
              <span className="badge badge-meta" style={{ fontSize: 10, padding: '2px 6px', gap: 4 }}>
                <ShieldCheck size={11} />
                AUDITED
              </span>
            )}

            {isInherited && (
              <span className="badge badge-qualified" style={{ fontSize: 10, padding: '2px 6px', gap: 4 }}>
                <Link2 size={11} />
                ROLE INHERITED
              </span>
            )}

            {isOverride && (
              <span className="badge badge-converted" style={{ fontSize: 10, padding: '2px 6px', gap: 4 }}>
                <Zap size={11} />
                OVERRIDDEN
              </span>
            )}
          </div>

          <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--accent-primary)', marginTop: 2 }}>
            {permissionId}
          </div>

          {description && (
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>
              {description}
            </div>
          )}
        </div>
      </div>

      {/* Right: Scope Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PermissionScopeSelector
          value={currentScope || 'COMPANY'}
          onChange={(newScope) => onScopeChange(permissionId, newScope)}
          disabled={readOnly || !isGranted}
          allowedScopes={allowedScopes}
        />
      </div>
    </div>
  );
});

AtomicPermissionRow.displayName = 'AtomicPermissionRow';
