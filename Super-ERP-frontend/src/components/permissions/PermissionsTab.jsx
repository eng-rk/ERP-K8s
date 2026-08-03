import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import API from '../../services/api';
import { PermissionsToolbar } from './PermissionsToolbar';
import { ModuleAccordionGroup } from './ModuleAccordionGroup';
import { UserSummaryPanel } from './UserSummaryPanel';

export const PermissionsTab = ({ userId, readOnly = false }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Raw API Data
  const [catalogPermissions, setCatalogPermissions] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [effectivePermissions, setEffectivePermissions] = useState({});
  const [originalCustomClaims, setOriginalCustomClaims] = useState([]);

  // Editable Working State: userCustomMap -> { [permissionId]: { permissionId, scope, granted } }
  const [userCustomMap, setUserCustomMap] = useState({});

  // UI Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [expandedModules, setExpandedModules] = useState({});

  // Load Master Catalog & User Permission Profile
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: catRes } = await API.get('/iam/permissions');
      const catalog = catRes.data || [];
      setCatalogPermissions(catalog);

      const initialExpanded = {};
      catalog.forEach(p => { initialExpanded[p.module] = true; });
      setExpandedModules(initialExpanded);

      if (userId) {
        const { data: userRes } = await API.get(`/iam/users/${userId}/permissions`);
        setUserRoles(userRes.roles || []);
        setEffectivePermissions(userRes.effectivePermissions || {});
        
        const initialCustom = userRes.customPermissionClaims || [];
        setOriginalCustomClaims(initialCustom);

        const customMap = {};
        initialCustom.forEach(c => {
          customMap[c.permissionId] = { ...c };
        });
        setUserCustomMap(customMap);
      }
    } catch (err) {
      console.error('PermissionsTab fetchData error:', err);
      setError(err.response?.data?.message || 'Failed to load permissions registry.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Derived list of distinct system modules
  const modulesList = useMemo(() => {
    const mods = new Set();
    catalogPermissions.forEach(p => { if (p.module) mods.add(p.module); });
    return Array.from(mods).sort();
  }, [catalogPermissions]);

  // Filter permissions based on search term & selected module
  const filteredCatalog = useMemo(() => {
    return catalogPermissions.filter(p => {
      if (selectedModule !== 'ALL' && p.module !== selectedModule) return false;

      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchId = p.permissionId.toLowerCase().includes(term);
        const matchName = p.displayName.toLowerCase().includes(term);
        const matchDesc = p.description?.toLowerCase().includes(term);
        const matchCategory = p.category?.toLowerCase().includes(term);
        return matchId || matchName || matchDesc || matchCategory;
      }

      return true;
    });
  }, [catalogPermissions, selectedModule, searchTerm]);

  // Group filtered permissions by Module -> Submodule
  const groupedTree = useMemo(() => {
    const tree = {};
    filteredCatalog.forEach(p => {
      const mod = p.module || 'System';
      const sub = p.submodule || 'General';
      if (!tree[mod]) tree[mod] = {};
      if (!tree[mod][sub]) tree[mod][sub] = [];
      tree[mod][sub].push(p);
    });
    return tree;
  }, [filteredCatalog]);

  // Set of permissions inherited from user assigned roles
  const rolePermissionsSet = useMemo(() => {
    const set = new Set();
    Object.values(effectivePermissions).forEach(claim => {
      if (claim.source === 'ROLE' && claim.granted) {
        set.add(claim.permissionId);
      }
    });
    return set;
  }, [effectivePermissions]);

  // Unsaved changes detection
  const hasUnsavedChanges = useMemo(() => {
    const currentKeys = Object.keys(userCustomMap);
    const origMap = {};
    originalCustomClaims.forEach(c => { origMap[c.permissionId] = c; });

    if (currentKeys.length !== originalCustomClaims.length) return true;

    for (const key of currentKeys) {
      const cur = userCustomMap[key];
      const orig = origMap[key];
      if (!orig) return true;
      if (cur.granted !== orig.granted || cur.scope !== orig.scope) return true;
    }

    return false;
  }, [userCustomMap, originalCustomClaims]);

  // Handlers for toggles & edits
  const handleToggleExpand = useCallback((moduleName) => {
    setExpandedModules(prev => ({ ...prev, [moduleName]: !prev[moduleName] }));
  }, []);

  const handleExpandAll = useCallback(() => {
    const expanded = {};
    modulesList.forEach(m => { expanded[m] = true; });
    setExpandedModules(expanded);
  }, [modulesList]);

  const handleCollapseAll = useCallback(() => {
    const collapsed = {};
    modulesList.forEach(m => { collapsed[m] = false; });
    setExpandedModules(collapsed);
  }, [modulesList]);

  const handleToggleGrant = useCallback((permissionId, granted) => {
    setUserCustomMap(prev => {
      const next = { ...prev };
      const existingScope = next[permissionId]?.scope || effectivePermissions[permissionId]?.scope || 'COMPANY';
      next[permissionId] = { permissionId, scope: existingScope, granted };
      return next;
    });
  }, [effectivePermissions]);

  const handleScopeChange = useCallback((permissionId, scope) => {
    setUserCustomMap(prev => {
      const next = { ...prev };
      const existingGranted = next[permissionId] ? next[permissionId].granted : true;
      next[permissionId] = { permissionId, scope, granted: existingGranted };
      return next;
    });
  }, []);

  const handleGrantAll = useCallback(() => {
    setUserCustomMap(prev => {
      const next = { ...prev };
      filteredCatalog.forEach(p => {
        const existingScope = next[p.permissionId]?.scope || 'COMPANY';
        next[p.permissionId] = { permissionId: p.permissionId, scope: existingScope, granted: true };
      });
      return next;
    });
  }, [filteredCatalog]);

  const handleRevokeAll = useCallback(() => {
    setUserCustomMap({});
  }, []);

  const handleReset = useCallback(() => {
    const customMap = {};
    originalCustomClaims.forEach(c => {
      customMap[c.permissionId] = { ...c };
    });
    setUserCustomMap(customMap);
  }, [originalCustomClaims]);

  const handleSave = async () => {
    if (!userId || readOnly) return;
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const payload = Object.values(userCustomMap);
      const { data } = await API.put(`/iam/users/${userId}/permissions`, {
        customPermissionClaims: payload
      });

      setOriginalCustomClaims(data.data.customPermissionClaims || []);
      setEffectivePermissions(data.data.effectivePermissions || {});
      setSuccessMsg('Permissions successfully updated and saved.');

      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('handleSave error:', err);
      setError(err.response?.data?.message || 'Failed to save permission changes.');
    } finally {
      setSaving(false);
    }
  };

  // Metrics for Summary Panel
  const metrics = useMemo(() => {
    let effectiveCount = 0;
    let inheritedCount = 0;
    let deniedCount = 0;
    let overrideCount = Object.keys(userCustomMap).length;

    catalogPermissions.forEach(p => {
      const custom = userCustomMap[p.permissionId];
      const eff = effectivePermissions[p.permissionId];
      const isGranted = custom ? custom.granted : (eff?.granted || false);

      if (isGranted) effectiveCount++;
      else deniedCount++;

      if (rolePermissionsSet.has(p.permissionId)) inheritedCount++;
    });

    return {
      totalCatalogCount: catalogPermissions.length,
      effectiveCount,
      inheritedCount,
      deniedCount,
      overrideCount
    };
  }, [catalogPermissions, effectivePermissions, userCustomMap, rolePermissionsSet]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        Loading permissions matrix…
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Alert Notifications */}
      {error && (
        <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={16} />
            {error}
          </span>
          <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={16} />
            {successMsg}
          </span>
          <button onClick={() => setSuccessMsg(null)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Main Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        {/* Left Column: Toolbar & Accordions */}
        <div>
          <PermissionsToolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedModule={selectedModule}
            onModuleChange={setSelectedModule}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            modules={modulesList}
            roles={userRoles}
            onExpandAll={handleExpandAll}
            onCollapseAll={handleCollapseAll}
            onGrantAll={handleGrantAll}
            onRevokeAll={handleRevokeAll}
            onReset={handleReset}
            onSave={handleSave}
            hasUnsavedChanges={hasUnsavedChanges}
            isSaving={saving}
            readOnly={readOnly}
          />

          {Object.keys(groupedTree).length === 0 ? (
            <div className="empty-state">
              <p>No permission claims match your filter criteria.</p>
            </div>
          ) : (
            Object.entries(groupedTree).map(([moduleName, submodulesMap]) => (
              <ModuleAccordionGroup
                key={moduleName}
                moduleName={moduleName}
                submodulesMap={submodulesMap}
                effectiveMap={effectivePermissions}
                rolePermissionsSet={rolePermissionsSet}
                userCustomMap={userCustomMap}
                isExpanded={!!expandedModules[moduleName]}
                onToggleExpand={handleToggleExpand}
                onToggleGrant={handleToggleGrant}
                onScopeChange={handleScopeChange}
                readOnly={readOnly}
              />
            ))
          )}
        </div>

        {/* Right Column: Native Core360 Summary Panel */}
        <UserSummaryPanel
          userRoles={userRoles}
          totalCatalogCount={metrics.totalCatalogCount}
          effectiveCount={metrics.effectiveCount}
          inheritedCount={metrics.inheritedCount}
          deniedCount={metrics.deniedCount}
          overrideCount={metrics.overrideCount}
        />
      </div>
    </div>
  );
};
