const { SCOPES } = require('./permissionScopes');

const ROLE_TEMPLATES = [
  {
    roleCode: 'SALES_AGENT',
    displayName: 'Sales Agent',
    description: 'Frontline sales representative with pipeline and deal creation access.',
    isSystemRole: true,
    permissions: [
      { permissionId: 'crm.leads.view', scope: SCOPES.TEAM },
      { permissionId: 'crm.leads.view_sensitive', scope: SCOPES.SELF },
      { permissionId: 'crm.leads.create', scope: SCOPES.SELF },
      { permissionId: 'crm.leads.edit', scope: SCOPES.SELF },
      { permissionId: 'crm.offers.view', scope: SCOPES.SELF },
      { permissionId: 'crm.offers.create', scope: SCOPES.SELF },
      { permissionId: 'crm.offers.apply_standard_discount', scope: SCOPES.SELF },
      { permissionId: 'crm.offers.send_email', scope: SCOPES.SELF },
      { permissionId: 'crm.customers.view', scope: SCOPES.BRANCH }
    ]
  },
  {
    roleCode: 'SALES_MANAGER',
    displayName: 'Sales Manager',
    description: 'Sales team lead managing team leads, approvals, and performance.',
    isSystemRole: true,
    permissions: [
      { permissionId: 'crm.leads.view', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.leads.view_sensitive', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.leads.create', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.leads.edit', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.leads.assign', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.leads.bulk_reassign', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.leads.convert', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.leads.export', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.offers.view', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.offers.create', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.offers.edit', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.offers.approve_discount', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.offers.send_email', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.offers.void', scope: SCOPES.DEPARTMENT },
      { permissionId: 'crm.customers.view', scope: SCOPES.BRANCH },
      { permissionId: 'crm.customers.view_financials', scope: SCOPES.DEPARTMENT }
    ]
  },
  {
    roleCode: 'HR_OFFICER',
    displayName: 'HR Officer',
    description: 'HR Specialist handling employee records, onboarding, and compliance.',
    isSystemRole: true,
    permissions: [
      { permissionId: 'hrm.staff.view_list', scope: SCOPES.DEPARTMENT },
      { permissionId: 'hrm.staff.view_sensitive', scope: SCOPES.DEPARTMENT },
      { permissionId: 'hrm.staff.create', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.staff.edit_profile', scope: SCOPES.DEPARTMENT },
      { permissionId: 'hrm.contracts.view_base_salary', scope: SCOPES.DEPARTMENT },
      { permissionId: 'hrm.contracts.verify_doc', scope: SCOPES.COMPANY },
      { permissionId: 'attendance.rtm.view_live', scope: SCOPES.DEPARTMENT }
    ]
  },
  {
    roleCode: 'HR_MANAGER',
    displayName: 'HR Manager',
    description: 'Head of Human Resources with full staff lifecycle and policy management.',
    isSystemRole: true,
    permissions: [
      { permissionId: 'hrm.staff.view_list', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.staff.view_sensitive', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.staff.create', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.staff.edit_profile', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.staff.delete', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.contracts.view_base_salary', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.contracts.view_net_salary', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.contracts.edit_salary_components', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.contracts.verify_doc', scope: SCOPES.COMPANY },
      { permissionId: 'attendance.rtm.view_live', scope: SCOPES.COMPANY },
      { permissionId: 'attendance.rtm.override_aux', scope: SCOPES.COMPANY }
    ]
  },
  {
    roleCode: 'PAYROLL_SPECIALIST',
    displayName: 'Payroll Specialist',
    description: 'Compensation processor running monthly payroll calculations and banking verification.',
    isSystemRole: true,
    permissions: [
      { permissionId: 'hrm.staff.view_list', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.contracts.view_base_salary', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.contracts.view_net_salary', scope: SCOPES.COMPANY },
      { permissionId: 'payroll.engine.view_runs', scope: SCOPES.COMPANY },
      { permissionId: 'payroll.engine.calculate', scope: SCOPES.COMPANY },
      { permissionId: 'payroll.banking.verify_employee', scope: SCOPES.COMPANY }
    ]
  },
  {
    roleCode: 'PAYROLL_MANAGER',
    displayName: 'Payroll Manager',
    description: 'Payroll Director authorizing payroll runs and approving fund release.',
    isSystemRole: true,
    permissions: [
      { permissionId: 'hrm.staff.view_list', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.contracts.view_base_salary', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.contracts.view_net_salary', scope: SCOPES.COMPANY },
      { permissionId: 'hrm.contracts.edit_net_salary', scope: SCOPES.COMPANY },
      { permissionId: 'payroll.engine.view_runs', scope: SCOPES.COMPANY },
      { permissionId: 'payroll.engine.calculate', scope: SCOPES.COMPANY },
      { permissionId: 'payroll.engine.approve_run', scope: SCOPES.COMPANY },
      { permissionId: 'payroll.engine.release_disbursement', scope: SCOPES.COMPANY },
      { permissionId: 'payroll.banking.verify_employee', scope: SCOPES.COMPANY },
      { permissionId: 'payroll.banking.manage_company', scope: SCOPES.COMPANY }
    ]
  },
  {
    roleCode: 'WAREHOUSE_CLERK',
    displayName: 'Warehouse Clerk',
    description: 'Inventory operator handling receiving, picking, and stock counts.',
    isSystemRole: true,
    permissions: [
      { permissionId: 'wms.items.view', scope: SCOPES.BRANCH },
      { permissionId: 'wms.receiving.view', scope: SCOPES.BRANCH },
      { permissionId: 'wms.receiving.create_order', scope: SCOPES.BRANCH },
      { permissionId: 'wms.receiving.verify_goods', scope: SCOPES.BRANCH },
      { permissionId: 'wms.shipping.view', scope: SCOPES.BRANCH }
    ]
  },
  {
    roleCode: 'WAREHOUSE_MANAGER',
    displayName: 'Warehouse Manager',
    description: 'Warehouse supervisor managing facility inventory, receipts, and adjustments.',
    isSystemRole: true,
    permissions: [
      { permissionId: 'wms.items.view', scope: SCOPES.BRANCH },
      { permissionId: 'wms.items.create', scope: SCOPES.COMPANY },
      { permissionId: 'wms.items.edit', scope: SCOPES.COMPANY },
      { permissionId: 'wms.receiving.view', scope: SCOPES.BRANCH },
      { permissionId: 'wms.receiving.create_order', scope: SCOPES.BRANCH },
      { permissionId: 'wms.receiving.verify_goods', scope: SCOPES.BRANCH },
      { permissionId: 'wms.receiving.post_receipt', scope: SCOPES.BRANCH },
      { permissionId: 'wms.shipping.view', scope: SCOPES.BRANCH },
      { permissionId: 'wms.shipping.post_issue', scope: SCOPES.BRANCH },
      { permissionId: 'wms.adjustments.view', scope: SCOPES.BRANCH },
      { permissionId: 'wms.adjustments.create_request', scope: SCOPES.BRANCH },
      { permissionId: 'wms.adjustments.approve', scope: SCOPES.COMPANY },
      { permissionId: 'wms.audits.physical_inventory', scope: SCOPES.COMPANY }
    ]
  },
  {
    roleCode: 'FINANCE_MANAGER',
    displayName: 'Finance Manager',
    description: 'Corporate Finance Director with treasury, PO approval, and audit access.',
    isSystemRole: true,
    permissions: [
      { permissionId: 'payroll.engine.view_runs', scope: SCOPES.COMPANY },
      { permissionId: 'payroll.banking.manage_company', scope: SCOPES.COMPANY },
      { permissionId: 'scm.procurement.view', scope: SCOPES.COMPANY },
      { permissionId: 'scm.procurement.approve_po', scope: SCOPES.COMPANY },
      { permissionId: 'crm.customers.view_financials', scope: SCOPES.COMPANY },
      { permissionId: 'iam.audit.view', scope: SCOPES.COMPANY }
    ]
  },
  {
    roleCode: 'EXECUTIVE',
    displayName: 'Executive User',
    description: 'C-Suite Executive with global read-only visibility across all operations.',
    isSystemRole: true,
    permissions: [
      { permissionId: 'iam.users.view', scope: SCOPES.GLOBAL },
      { permissionId: 'crm.leads.view', scope: SCOPES.GLOBAL },
      { permissionId: 'crm.offers.view', scope: SCOPES.GLOBAL },
      { permissionId: 'crm.customers.view', scope: SCOPES.GLOBAL },
      { permissionId: 'crm.customers.view_financials', scope: SCOPES.GLOBAL },
      { permissionId: 'wms.items.view', scope: SCOPES.GLOBAL },
      { permissionId: 'scm.procurement.view', scope: SCOPES.GLOBAL },
      { permissionId: 'hrm.staff.view_list', scope: SCOPES.GLOBAL },
      { permissionId: 'hrm.contracts.view_base_salary', scope: SCOPES.GLOBAL },
      { permissionId: 'hrm.contracts.view_net_salary', scope: SCOPES.GLOBAL },
      { permissionId: 'payroll.engine.view_runs', scope: SCOPES.GLOBAL },
      { permissionId: 'attendance.rtm.view_live', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.audit.view', scope: SCOPES.GLOBAL },
      { permissionId: 'admin.settings.view', scope: SCOPES.GLOBAL }
    ]
  },
  {
    roleCode: 'SYSTEM_ADMINISTRATOR',
    displayName: 'System Administrator',
    description: 'System owner with root administrative and IAM configuration capabilities.',
    isSystemRole: true,
    permissions: [
      { permissionId: 'iam.users.view', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.users.view_sensitive', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.users.create', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.users.edit', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.users.deactivate', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.users.activate', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.users.lock', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.users.unlock', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.users.reset_password', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.users.force_password', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.users.assign_role', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.users.export', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.audit.view', scope: SCOPES.GLOBAL },
      { permissionId: 'iam.audit.export', scope: SCOPES.GLOBAL },
      { permissionId: 'admin.settings.view', scope: SCOPES.GLOBAL },
      { permissionId: 'admin.settings.update_business_model', scope: SCOPES.GLOBAL },
      { permissionId: 'admin.settings.manage_gateways', scope: SCOPES.GLOBAL },
      { permissionId: 'admin.devtools.seed_database', scope: SCOPES.GLOBAL }
    ]
  }
];

module.exports = {
  ROLE_TEMPLATES
};
