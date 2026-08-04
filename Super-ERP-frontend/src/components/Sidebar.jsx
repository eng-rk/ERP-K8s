import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import API from '../services/api';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

const SidebarIcon = ({ name }) => {
  const size = 17;
  const cls = 'sidebar-svg-icon';
  const p = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: cls,
  };

  switch (name) {
    case 'dept-crm':
      return <svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case 'dept-inventory':
      return <svg {...p}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
    case 'dept-supply':
      return <svg {...p}><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
    case 'dept-hrm':
      return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'dept-workspace':
      return <svg {...p}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>;
    case 'dashboard':
      return <svg {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case 'leads':
      return <svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case 'teams':
      return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'kanban':
      return <svg {...p}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>;
    case 'tickets':
      return <svg {...p}><path d="M12 2H2v10l9.29 9.29c.39.39 1.02.39 1.41 0l7.59-7.59c.39-.39.39-1.02 0-1.41z"/><path d="m20 12-8-8"/><line x1="7" x2="7.01" y1="7" y2="7" strokeWidth="3" strokeLinecap="round"/></svg>;
    case 'bookings':
      return <svg {...p}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="9" x2="15" y1="9" y2="15"/><line x1="15" x2="9" y1="9" y2="15"/></svg>;
    case 'campaigns':
      return <svg {...p}><path d="m3 11 18-5v12L3 13v-2Z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>;
    case 'analytics':
      return <svg {...p}><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>;
    case 'executive':
      return <svg {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
    case 'box':
      return <svg {...p}><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
    case 'inventory':
      return <svg {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10"/><path d="M7 12h6"/></svg>;
    case 'supplychain':
      return <svg {...p}><path d="M12 2 2 7v10l10 5 10-5V7Z"/><path d="M2 7l10 5 10-5"/><path d="M12 12v10"/></svg>;
    case 'users':
      return <svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'settings':
      return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
    case 'devtools':
      return <svg {...p}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>;
    case 'rtm':
      return <svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case 'email':
      return <svg {...p}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
    case 'personal':
      return <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case 'calendar':
      return <svg {...p}><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
    case 'payroll':
      return <svg {...p}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>;
    case 'training':
      return <svg {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
    case 'talent':
      return <svg {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
    case 'partnerships':
      return <svg {...p}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    default:
      return null;
  }
};

const CRM_ROLES = [
  'Super CRM Administrator','Sales Agent','Sales Manager','Customer Support Agent',
  'Customer Support Manager','Marketing Specialist','Marketing Manager','Business Analyst',
  'CRM Developer','CRM Consultant','System Architect','Executive User','RTM Team Member',
];

const HRM_ROLES = [
  'HRM System Administrator','HR Manager','HR Specialist (Generalist)',
  'Recruitment Specialist (Talent Acquisition)','Payroll Specialist','HR Business Partner',
  'Training and Development Specialist','Performance Management Specialist',
  'Attendance and Time Officer','Employee (General User)','HR Director / Executive HR User',
  'RTM Team Member',
];

// 1. CORE CRM NAV ITEMS
const CRM_NAV_ITEMS = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard', roles: null },
  { label: 'Leads', icon: 'leads', path: '/leads', roles: ['Super CRM Administrator','Sales Agent','Sales Manager','Marketing Specialist','Marketing Manager','Executive User','System Architect','Business Analyst'] },
  { label: 'Teams', icon: 'teams', path: '/teams', roles: ['Super CRM Administrator','System Architect','Sales Manager','Sales Agent','Customer Support Manager','Customer Support Agent','Marketing Manager','Marketing Specialist'] },
  { label: 'Sales Dashboard', icon: 'kanban', path: '/kanban', roles: ['Super CRM Administrator','Sales Agent','Sales Manager','Executive User','System Architect','Business Analyst'] },
  { label: 'Technical Issues', icon: 'tickets', path: '/tickets', roles: null },
  { label: 'Bookings', icon: 'bookings', path: '/bookings', roles: ['Sales Agent','Sales Manager','Customer Support Agent','Customer Support Manager','CRM Developer','CRM Consultant','System Architect','Super CRM Administrator'], businessModel: ['service', 'both'] },
  { label: 'Products', icon: 'box', path: '/products', roles: ['Super CRM Administrator','System Architect','Sales Agent','Sales Manager','Executive User'], businessModel: ['product', 'both'] },
  { label: 'Campaigns', icon: 'campaigns', path: '/campaigns', roles: ['Super CRM Administrator','Marketing Specialist','Marketing Manager','Executive User','Business Analyst','System Architect'] },
  { label: 'Analytics', icon: 'analytics', path: '/analytics', roles: ['Super CRM Administrator','Executive User','Business Analyst','System Architect'] },
  { label: 'RTM Monitor', icon: 'rtm', path: '/rtm', roles: ['RTM Team Member','Super CRM Administrator','HRM System Administrator','HR Manager'] },
];

// 2. MANAGEMENT CORE NAV ITEMS
const MANAGEMENT_CORE_NAV_ITEMS = [
  { label: 'Executive Dashboard', icon: 'executive', path: '/executive', roles: ['Super CRM Administrator','Executive User','Business Analyst','System Architect'] },
  { label: 'User Management', icon: 'users', path: '/users', roles: ['Super CRM Administrator','System Architect'] },
  { label: 'System Settings', icon: 'settings', path: '/settings', roles: ['Super CRM Administrator'] },
  { label: 'CRM Dev Tools', icon: 'devtools', path: '/devtools', roles: ['CRM Developer','System Architect','Super CRM Administrator'] },
];

// 3. CORE INVENTORY SUB ITEMS
const INVENTORY_SUB_ITEMS = [
  { label: 'Dashboard', path: '/inventory', icon: 'dashboard' },
  { label: 'Items Catalog', path: '/inventory/items', icon: 'box' },
  { label: 'Stock Overview', path: '/inventory/stock', icon: 'analytics' },
  { label: 'Transactions', path: '/inventory/transactions', icon: 'teams' },
  { label: 'Receiving', path: '/inventory/receiving', icon: 'box' },
  { label: 'Shipping', path: '/inventory/shipping', icon: 'box' },
  { label: 'Pick Tasks', path: '/inventory/pick-tasks', icon: 'teams' },
  { label: 'Transfers', path: '/inventory/transfers', icon: 'teams' },
  { label: 'Adjustments', path: '/inventory/adjustments', icon: 'analytics' },
  { label: 'Cycle Counts', path: '/inventory/cycle-counts', icon: 'calendar' },
  { label: 'Physical Inventory', path: '/inventory/physical-inventories', icon: 'analytics' },
  { label: 'Warehouses', path: '/inventory/warehouses', icon: 'dashboard', roles: ['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager'] },
  { label: 'Reports', path: '/inventory/reports', icon: 'analytics', roles: ['Super CRM Administrator', 'System Architect', 'Inventory Manager', 'Warehouse Manager', 'Inventory Clerk'] },
];

// 4. CORE SUPPLY CHAIN SUB ITEMS
const SUPPLY_CHAIN_SUB_ITEMS = [
  { label: 'Overview', path: '/supply-chain', icon: 'dashboard' },
  { label: 'Demand Planning', path: '/supply-chain/planning', icon: 'analytics' },
  { label: 'Procurement', path: '/supply-chain/procurement', icon: 'box' },
  { label: 'Orders', path: '/supply-chain/orders', icon: 'teams' },
  { label: 'Logistics', path: '/supply-chain/logistics', icon: 'supplychain' },
  { label: 'Vendors', path: '/supply-chain/vendors', icon: 'teams' },
  { label: 'Reports', path: '/supply-chain/reports', icon: 'analytics' },
];

// 5. CORE HRM NAV ITEMS
const HRM_NAV_ITEMS = [
  { label: 'HRM Dashboard', icon: 'dashboard', path: '/hrm', roles: null },
  { label: 'Personal & Staff', icon: 'personal', path: '/hrm/personal', roles: ['Super CRM Administrator','HRM System Administrator','HR Manager','HR Specialist (Generalist)','HR Business Partner','Employee (General User)'] },
  { label: 'Payroll', icon: 'payroll', path: '/hrm/payroll', roles: ['Super CRM Administrator','HRM System Administrator','HR Manager','Payroll Specialist','Employee (General User)'] },
  { label: 'Training & Development', icon: 'training', path: '/hrm/training', roles: ['Super CRM Administrator','HRM System Administrator','HR Manager','Training and Development Specialist','Employee (General User)'] },
  { label: 'Talent Acquisition', icon: 'talent', path: '/hrm/talent', roles: ['Super CRM Administrator','HRM System Administrator','HR Manager','Recruitment Specialist (Talent Acquisition)'] },
  { label: 'BD & People Culture', icon: 'partnerships', path: '/hrm/partnerships', roles: ['Super CRM Administrator','HRM System Administrator','HR Manager','HR Business Partner','Employee (General User)'] },
];

// 6. MY WORKSPACE NAV ITEMS
const WORKSPACE_NAV_ITEMS = [
  { label: 'Internal Emails', icon: 'email', path: '/emails' },
  { label: 'Sent Emails', icon: 'email', path: '/emails/sent' },
  { label: 'My Schedule', icon: 'calendar', path: '/ess/schedule' },
  { label: 'My Payroll & Payslip', icon: 'payroll', path: '/ess/payroll' },
];

const Sidebar = () => {
  const { user, logout, hasAnyPermission, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 6 Mini Sidebar Department States
  const [crmOpen, setCrmOpen] = useState(true);
  const [managementCoreOpen, setManagementCoreOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(true);
  const [supplyChainOpen, setSupplyChainOpen] = useState(true);
  const [hrmOpen, setHrmOpen] = useState(true);
  const [workspaceOpen, setWorkspaceOpen] = useState(true);

  // Auto expand active department based on current route
  useEffect(() => {
    const p = location.pathname;
    if (p.startsWith('/inventory')) {
      setInventoryOpen(true);
    } else if (p.startsWith('/supply-chain')) {
      setSupplyChainOpen(true);
    } else if (p.startsWith('/hrm')) {
      setHrmOpen(true);
    } else if (p.startsWith('/ess') || p.startsWith('/emails')) {
      setWorkspaceOpen(true);
    } else if (['/executive', '/users', '/settings', '/devtools'].some(route => p.startsWith(route))) {
      setManagementCoreOpen(true);
    } else {
      setCrmOpen(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const canSee = (item) => {
    // 1. Permission-based evaluation
    if (item.permissions && Array.isArray(item.permissions) && item.permissions.length > 0) {
      if (!hasAnyPermission(item.permissions)) return false;
    }
    // 2. Legacy role-based evaluation (fallback)
    else if (item.roles && Array.isArray(item.roles) && item.roles.length > 0) {
      if (!item.roles.includes(user?.role)) return false;
    }

    // 3. Business model compatibility evaluation
    if (item.businessModel) {
      const bm = user?.businessModel || 'service';
      if (!item.businessModel.includes(bm)) return false;
    }
    return true;
  };

  const isUserProfile = location.pathname.startsWith('/users/') && location.pathname !== '/users';
  const isInventoryActive = location.pathname.startsWith('/inventory');
  const isSupplyChainActive = location.pathname.startsWith('/supply-chain');

  const isSuperAdmin = user?.role === 'Super CRM Administrator' || user?.role === 'System Architect';
  const showCRM = isSuperAdmin || CRM_ROLES.includes(user?.role) || hasPermission('crm.leads.view');
  const showHRM = isSuperAdmin || HRM_ROLES.includes(user?.role) || hasPermission('hrm.staff.view_list');
  const bm = user?.businessModel || 'service';
  const showERP = ['product', 'both'].includes(bm) || hasPermission('wms.items.view');

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : '?';

  // Filtered lists for counter badges
  const filteredCrmItems = CRM_NAV_ITEMS.filter(canSee);
  const filteredManagementCoreItems = MANAGEMENT_CORE_NAV_ITEMS.filter(canSee);
  const filteredInventoryItems = INVENTORY_SUB_ITEMS.filter(canSee);
  const filteredSupplyChainItems = SUPPLY_CHAIN_SUB_ITEMS.filter(canSee);
  const filteredHrmItems = HRM_NAV_ITEMS.filter(canSee);
  const filteredWorkspaceItems = WORKSPACE_NAV_ITEMS.filter(canSee);

  return (
    <aside className="sidebar" aria-label="Workspace navigation">
      {/* Sidebar Header Brand */}
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img src={logo} alt="Core360 Logo" className="sidebar-logo-img" />
          <div className="sidebar-brand-meta">
            <span className="sidebar-logo-text">CORE360</span>
            <span className="sidebar-brand-subtitle">ENTERPRISE WORKSPACE</span>
          </div>
        </div>
      </div>

      {/* Main Nav Scroll Container */}
      <nav className="sidebar-nav">

        {/* 1. MINI SIDEBAR: CRM CORE */}
        {showCRM && (
          <div className="mini-sidebar-group">
            <div
              className="mini-sidebar-sticky-header crm-header"
              onClick={() => setCrmOpen(!crmOpen)}
              title="CRM Core Department"
            >
              <div className="mini-sidebar-header-left">
                <span className="mini-sidebar-icon"><SidebarIcon name="dept-crm" /></span>
                <span className="mini-sidebar-title">1. CRM Core</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="mini-sidebar-badge">{filteredCrmItems.length}</span>
                <span className="mini-sidebar-arrow" style={{ transform: crmOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▾</span>
              </div>
            </div>

            {crmOpen && (
              <div className="mini-sidebar-body">
                {filteredCrmItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  >
                    <span className="sidebar-link-icon"><SidebarIcon name={item.icon} /></span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. MINI SIDEBAR: MANAGEMENT CORE */}
        {filteredManagementCoreItems.length > 0 && (
          <div className="mini-sidebar-group">
            <div
              className="mini-sidebar-sticky-header management-header"
              onClick={() => setManagementCoreOpen(!managementCoreOpen)}
              title="Management Core Department"
            >
              <div className="mini-sidebar-header-left">
                <span className="mini-sidebar-icon"><SidebarIcon name="settings" /></span>
                <span className="mini-sidebar-title">2. Management Core</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="mini-sidebar-badge">{filteredManagementCoreItems.length}</span>
                <span className="mini-sidebar-arrow" style={{ transform: managementCoreOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▾</span>
              </div>
            </div>

            {managementCoreOpen && (
              <div className="mini-sidebar-body">
                {filteredManagementCoreItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `sidebar-link${isActive || (item.path === '/users' && isUserProfile) ? ' active' : ''}`
                    }
                  >
                    <span className="sidebar-link-icon"><SidebarIcon name={item.icon} /></span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. MINI SIDEBAR: INVENTORY CORE */}
        {showERP && (
          <div className="mini-sidebar-group">
            <div
              className="mini-sidebar-sticky-header inventory-header"
              onClick={() => setInventoryOpen(!inventoryOpen)}
              title="Inventory Core Department"
            >
              <div className="mini-sidebar-header-left">
                <span className="mini-sidebar-icon"><SidebarIcon name="dept-inventory" /></span>
                <span className="mini-sidebar-title">3. Inventory Core</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="mini-sidebar-badge">{filteredInventoryItems.length}</span>
                <span className="mini-sidebar-arrow" style={{ transform: inventoryOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▾</span>
              </div>
            </div>

            {inventoryOpen && (
              <div className="mini-sidebar-body">
                {filteredInventoryItems.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    className={({ isActive }) =>
                      `sidebar-link${isActive || (sub.path === '/inventory' && isInventoryActive) ? ' active' : ''}`
                    }
                  >
                    <span className="sidebar-link-icon"><SidebarIcon name={sub.icon} /></span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. MINI SIDEBAR: SUPPLY CHAIN CORE */}
        {showERP && (
          <div className="mini-sidebar-group">
            <div
              className="mini-sidebar-sticky-header supply-header"
              onClick={() => setSupplyChainOpen(!supplyChainOpen)}
              title="Supply Chain Core Department"
            >
              <div className="mini-sidebar-header-left">
                <span className="mini-sidebar-icon"><SidebarIcon name="dept-supply" /></span>
                <span className="mini-sidebar-title">4. Supply Chain Core</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="mini-sidebar-badge">{filteredSupplyChainItems.length}</span>
                <span className="mini-sidebar-arrow" style={{ transform: supplyChainOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▾</span>
              </div>
            </div>

            {supplyChainOpen && (
              <div className="mini-sidebar-body">
                {filteredSupplyChainItems.map((sub) => (
                  <NavLink
                    key={sub.path}
                    to={sub.path}
                    className={({ isActive }) =>
                      `sidebar-link${isActive || (sub.path === '/supply-chain' && isSupplyChainActive) ? ' active' : ''}`
                    }
                  >
                    <span className="sidebar-link-icon"><SidebarIcon name={sub.icon} /></span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. MINI SIDEBAR: HRM CORE */}
        {showHRM && (
          <div className="mini-sidebar-group">
            <div
              className="mini-sidebar-sticky-header hrm-header"
              onClick={() => setHrmOpen(!hrmOpen)}
              title="HRM Core Department"
            >
              <div className="mini-sidebar-header-left">
                <span className="mini-sidebar-icon"><SidebarIcon name="dept-hrm" /></span>
                <span className="mini-sidebar-title">5. HRM Core</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="mini-sidebar-badge">{filteredHrmItems.length}</span>
                <span className="mini-sidebar-arrow" style={{ transform: hrmOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▾</span>
              </div>
            </div>

            {hrmOpen && (
              <div className="mini-sidebar-body">
                {filteredHrmItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  >
                    <span className="sidebar-link-icon"><SidebarIcon name={item.icon} /></span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 6. MINI SIDEBAR: MY WORKSPACE */}
        <div className="mini-sidebar-group">
          <div
            className="mini-sidebar-sticky-header workspace-header"
            onClick={() => setWorkspaceOpen(!workspaceOpen)}
            title="My Personal Workspace"
          >
            <div className="mini-sidebar-header-left">
              <span className="mini-sidebar-icon"><SidebarIcon name="dept-workspace" /></span>
              <span className="mini-sidebar-title">6. My Workspace</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="mini-sidebar-badge">{filteredWorkspaceItems.length}</span>
              <span className="mini-sidebar-arrow" style={{ transform: workspaceOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▾</span>
            </div>
          </div>

          {workspaceOpen && (
            <div className="mini-sidebar-body">
              {filteredWorkspaceItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                >
                  <span className="sidebar-link-icon"><SidebarIcon name={item.icon} /></span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
                </NavLink>
              ))}
            </div>
          )}
        </div>

      </nav>

      {/* Sidebar Footer User Card */}
      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={() => navigate(`/users/${user?._id}`)} style={{ cursor: 'pointer' }}>
          <div className="sidebar-user-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.firstName} {user?.lastName}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
        </div>
        <button
          className="sidebar-link btn-danger"
          onClick={handleLogout}
          style={{ marginTop: 8, width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}
        >
          <span className="sidebar-link-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" x2="9" y1="12" y2="12"/>
            </svg>
          </span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
