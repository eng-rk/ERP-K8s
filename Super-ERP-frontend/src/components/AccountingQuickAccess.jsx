import { NavLink } from 'react-router-dom';

export default function AccountingQuickAccess() {
  return (
    <NavLink
      to="/accounting"
      aria-label="Open Accounting"
      style={({ isActive }) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 12px',
        borderRadius: 7,
        textDecoration: 'none',
        fontWeight: 600,
        border: '1px solid #dbe3ea',
        background: isActive ? '#eef6ff' : '#ffffff',
        color: '#18324a',
        boxShadow: isActive ? '0 0 0 1px rgba(24,50,74,0.08)' : 'none',
      })}
    >
      <span aria-hidden="true">▣</span>
      <span>Accounting</span>
    </NavLink>
  );
}
