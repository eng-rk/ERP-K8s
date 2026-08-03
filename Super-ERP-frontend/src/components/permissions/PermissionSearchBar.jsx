import React from 'react';
import { Search, X, Filter, ShieldCheck } from 'lucide-react';

export const PermissionSearchBar = React.memo(({
  searchTerm,
  onSearchChange,
  selectedModule,
  onModuleChange,
  selectedRole,
  onRoleChange,
  modules = [],
  roles = []
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
      {/* Search Input Box */}
      <div style={{ position: 'relative', minWidth: 240, flex: 1 }}>
        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search permission claims…"
          className="table-search"
          style={{ width: '100%', paddingLeft: 30, paddingRight: searchTerm ? 28 : 12, height: 34 }}
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Module Filter Select */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Filter size={13} style={{ color: 'var(--text-muted)' }} />
        <select
          value={selectedModule}
          onChange={(e) => onModuleChange(e.target.value)}
          className="form-input"
          style={{ padding: '5px 10px', fontSize: 12, height: 34, width: 'auto', minWidth: 150 }}
        >
          <option value="ALL">All Modules ({modules.length})</option>
          {modules.map((mod) => (
            <option key={mod} value={mod}>
              {mod} Module
            </option>
          ))}
        </select>
      </div>

      {/* Role Filter Select */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <ShieldCheck size={13} style={{ color: 'var(--text-muted)' }} />
        <select
          value={selectedRole || 'ALL'}
          onChange={(e) => onRoleChange && onRoleChange(e.target.value)}
          className="form-input"
          style={{ padding: '5px 10px', fontSize: 12, height: 34, width: 'auto', minWidth: 150 }}
        >
          <option value="ALL">All Roles ({roles.length})</option>
          {roles.map((r, idx) => {
            const name = typeof r === 'object' ? (r.name || r.code) : String(r);
            return (
              <option key={idx} value={name}>
                {name}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
});

PermissionSearchBar.displayName = 'PermissionSearchBar';
