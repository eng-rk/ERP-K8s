import { NavLink } from 'react-router-dom';

export default function AccountingQuickAccess() {
  return (
    <NavLink
      to="/accounting"
      aria-label="Open Accounting Core"
      className={({ isActive }) => `accounting-sidebar-link${isActive ? ' active' : ''}`}
      style={({ isActive }) => ({
        position: 'fixed',
        left: 12,
        top: 430,
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        width: 220,
        boxSizing: 'border-box',
        padding: '10px 12px',
        borderRadius: 7,
        textDecoration: 'none',
        fontWeight: 700,
        border: '1px solid #dbe3ea',
        background: isActive ? '#eef6ff' : '#ffffff',
        color: '#18324a',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      })}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span aria-hidden="true" style={{ fontSize: 16 }}>▣</span>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          4. Accounting Core
        </span>
      </span>
      <span aria-hidden="true" style={{ fontSize: 12, opacity: 0.7 }}>▸</span>
    </NavLink>
  );
}
