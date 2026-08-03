import React from 'react';
import { FolderOpen, Folder, CheckSquare, XSquare, RotateCcw, Save, Check, RefreshCw } from 'lucide-react';
import { PermissionSearchBar } from './PermissionSearchBar';

export const PermissionsToolbar = React.memo(({
  searchTerm,
  onSearchChange,
  selectedModule,
  onModuleChange,
  selectedRole,
  onRoleChange,
  modules = [],
  roles = [],
  onExpandAll,
  onCollapseAll,
  onGrantAll,
  onRevokeAll,
  onReset,
  onSave,
  hasUnsavedChanges = false,
  isSaving = false,
  readOnly = false
}) => {
  return (
    <div className="table-header" style={{ marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
      {/* Search & Filter Controls */}
      <PermissionSearchBar
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        selectedModule={selectedModule}
        onModuleChange={onModuleChange}
        selectedRole={selectedRole}
        onRoleChange={onRoleChange}
        modules={modules}
        roles={roles}
      />

      {/* Button Group */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary btn-sm" onClick={onExpandAll} title="Expand all modules">
          <FolderOpen size={13} />
          <span>Expand All</span>
        </button>

        <button className="btn btn-secondary btn-sm" onClick={onCollapseAll} title="Collapse all modules">
          <Folder size={13} />
          <span>Collapse All</span>
        </button>

        {!readOnly && (
          <>
            <button className="btn btn-secondary btn-sm" onClick={onGrantAll} title="Grant all claims">
              <CheckSquare size={13} style={{ color: 'var(--accent-success)' }} />
              <span>Grant All</span>
            </button>

            <button className="btn btn-secondary btn-sm" onClick={onRevokeAll} title="Revoke all custom grants">
              <XSquare size={13} style={{ color: 'var(--accent-danger)' }} />
              <span>Revoke All</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={onReset}
              disabled={!hasUnsavedChanges || isSaving}
              style={{ opacity: !hasUnsavedChanges || isSaving ? 0.5 : 1 }}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={onSave}
              disabled={!hasUnsavedChanges || isSaving}
              style={{ width: 'auto', minWidth: 100, opacity: !hasUnsavedChanges || isSaving ? 0.6 : 1 }}
            >
              {isSaving ? (
                <>
                  <RefreshCw size={13} className="spinner" />
                  <span>Saving…</span>
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <Save size={13} />
                  <span>Save Changes *</span>
                </>
              ) : (
                <>
                  <Check size={13} />
                  <span>Saved</span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
});

PermissionsToolbar.displayName = 'PermissionsToolbar';
