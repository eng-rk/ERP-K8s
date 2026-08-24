import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { createPortal } from 'react-dom';

const AccountingIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sidebar-svg-icon" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
);

export default function AccountingQuickAccess() {
  const [open, setOpen] = useState(true);
  const [host, setHost] = useState(null);

  useEffect(() => {
    const sidebarNav = document.querySelector('.sidebar-nav');
    if (!sidebarNav) return undefined;

    const supplyGroup = sidebarNav.querySelector('.supply-header')?.closest('.mini-sidebar-group');
    const accountingHost = document.createElement('div');
    accountingHost.className = 'mini-sidebar-group accounting-core-portal';

    if (supplyGroup) sidebarNav.insertBefore(accountingHost, supplyGroup);
    else sidebarNav.appendChild(accountingHost);

    const renumber = () => {
      const supplyTitle = sidebarNav.querySelector('.supply-header .mini-sidebar-title');
      const hrmTitle = sidebarNav.querySelector('.hrm-header .mini-sidebar-title');
      const workspaceTitle = sidebarNav.querySelector('.workspace-header .mini-sidebar-title');
      if (supplyTitle) supplyTitle.textContent = '5. Supply Chain Core';
      if (hrmTitle) hrmTitle.textContent = '6. HRM Core';
      if (workspaceTitle) workspaceTitle.textContent = '7. My Workspace';
    };
    renumber();

    const frame = window.requestAnimationFrame(() => setHost(accountingHost));

    return () => {
      window.cancelAnimationFrame(frame);
      accountingHost.remove();
    };
  }, []);

  if (!host) return null;

  return createPortal(
    <>
      <div
        className="mini-sidebar-sticky-header accounting-header"
        onClick={() => setOpen((value) => !value)}
        title="Accounting Core Department"
      >
        <div className="mini-sidebar-header-left">
          <span className="mini-sidebar-icon"><AccountingIcon /></span>
          <span className="mini-sidebar-title">4. Accounting Core</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="mini-sidebar-badge">1</span>
          <span className="mini-sidebar-arrow" style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▾</span>
        </div>
      </div>

      {open && (
        <div className="mini-sidebar-body">
          <NavLink
            to="/accounting"
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="sidebar-link-icon"><AccountingIcon /></span>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dashboard</span>
          </NavLink>
        </div>
      )}
    </>,
    host,
  );
}
