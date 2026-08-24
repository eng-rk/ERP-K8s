import { NavLink } from 'react-router-dom';

export default function AccountingQuickAccess() {
  return (
    <NavLink
      to="/accounting"
      aria-label="Open Accounting"
      className={({ isActive }) => `accounting-sidebar-link${isActive ? ' active' : ''}`}
      style={({ isActive }) => ({
        position: 'fixed',
        left: 12,
        top: 190,
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: 220,
        boxSizing: 'border-box',
        padding: '9px 12px',
        borderRadius: 7,
        textDecoration: 'none',
        fontWeight: 600,
        border: '1px solid #dbe3ea',
        background: isActive ? '#eef6ff' : '#ffffff',
        color: '#18324a',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      })}
    >
      <span aria-hidden="true">▣</span>
      <span>Accounting</span>
    </NavLink>
  );
}
