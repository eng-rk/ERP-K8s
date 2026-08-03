import React from 'react';
import { Activity, ShieldCheck, Sliders, Layers, Award } from 'lucide-react';

export const UserSummaryPanel = React.memo(({
  userRoles = [],
  totalCatalogCount = 0,
  grantedCount = 0,
  deniedCount = 0,
  effectiveCount = 0,
  inheritedCount = 0,
  overrideCount = 0
}) => {
  const percentEffective = totalCatalogCount > 0 ? Math.round((effectiveCount / totalCatalogCount) * 100) : 0;

  return (
    <div className="table-wrapper" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18, position: 'sticky', top: 20 }}>
      {/* Panel Header */}
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between' }}>
          <h3 className="table-title" style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={16} style={{ color: 'var(--accent-primary)' }} />
            Authorization Summary
          </h3>
          <span className="badge badge-qualified" style={{ fontSize: 10 }}>ACTIVE</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
          Live effective security profile analysis
        </p>
      </div>

      {/* Metric Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div className="stat-card green" style={{ padding: 12 }}>
          <div className="stat-label">Effective Claims</div>
          <div className="stat-value" style={{ fontSize: 22, marginTop: 4 }}>{effectiveCount}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{percentEffective}% of catalog</div>
        </div>

        <div className="stat-card blue" style={{ padding: 12 }}>
          <div className="stat-label">Catalog Size</div>
          <div className="stat-value" style={{ fontSize: 22, marginTop: 4 }}>{totalCatalogCount}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Claims defined</div>
        </div>

        <div className="stat-card cyan" style={{ padding: 12 }}>
          <div className="stat-label">Role Inherited</div>
          <div className="stat-value" style={{ fontSize: 22, marginTop: 4 }}>{inheritedCount}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>RBAC System</div>
        </div>

        <div className="stat-card yellow" style={{ padding: 12 }}>
          <div className="stat-label">User Overrides</div>
          <div className="stat-value" style={{ fontSize: 22, marginTop: 4 }}>{overrideCount}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Custom grants</div>
        </div>
      </div>

      {/* Assigned Roles Section */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Award size={14} style={{ color: 'var(--accent-primary)' }} />
          Assigned Roles ({userRoles.length})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {userRoles.length === 0 ? (
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>No system roles assigned</span>
          ) : (
            userRoles.map((r, idx) => {
              const roleName = typeof r === 'object' && r ? (r.name || r.code || 'Assigned Role') : (String(r).startsWith('6') ? 'System Assigned Role' : String(r));
              return (
                <span key={r._id || r.code || idx} className="badge badge-meta" style={{ fontSize: 11 }}>
                  {roleName}
                </span>
              );
            })
          )}
        </div>
      </div>

      {/* Security Health */}
      <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={14} style={{ color: 'var(--accent-success)' }} />
            Security Audit
          </span>
          <span style={{ fontWeight: 700, color: 'var(--accent-success)' }}>ACTIVE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sliders size={14} style={{ color: 'var(--accent-primary)' }} />
            ABAC Engine
          </span>
          <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>ENFORCED</span>
        </div>
      </div>
    </div>
  );
});

UserSummaryPanel.displayName = 'UserSummaryPanel';
