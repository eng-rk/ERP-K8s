import React from 'react';
import { Globe, Shield, Users, Building, Layers, User } from 'lucide-react';

const SCOPES = ['SELF', 'TEAM', 'DEPARTMENT', 'BRANCH', 'COMPANY', 'GLOBAL'];

const ScopeIcon = ({ scope }) => {
  const props = { size: 12, style: { flexShrink: 0 } };
  switch (scope) {
    case 'SELF': return <User {...props} />;
    case 'TEAM': return <Users {...props} />;
    case 'DEPARTMENT': return <Layers {...props} />;
    case 'BRANCH': return <Building {...props} />;
    case 'COMPANY': return <Building {...props} />;
    case 'GLOBAL': return <Globe {...props} />;
    default: return <Shield {...props} />;
  }
};

export const PermissionScopeSelector = React.memo(({ value = 'COMPANY', onChange, disabled = false, allowedScopes = SCOPES }) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <ScopeIcon scope={value} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="form-input"
        style={{
          padding: '4px 8px',
          fontSize: '11px',
          fontWeight: 600,
          borderRadius: 'var(--radius-sm)',
          minWidth: 105,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-color)'
        }}
      >
        {allowedScopes.map((scope) => (
          <option key={scope} value={scope}>
            Scope: {scope}
          </option>
        ))}
      </select>
    </div>
  );
});

PermissionScopeSelector.displayName = 'PermissionScopeSelector';
