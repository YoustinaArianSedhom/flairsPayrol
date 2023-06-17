// List of roles to be used as the single trusted reference for all available roles cross over the whole system
export enum SystemRoles {
    Employee = 'Employee',
    Manager = 'Direct Lead',
    PayrollManager = 'Manager',
    ITSupport = 'App Support',
    Payroll = 'Payroll',
    Finance = 'Finance',
    HR = 'HR',
    CEO = 'CEO',
    HRManager = 'HR Manager',
    BusinessPartner = 'Business Partner',
    PL = 'P&L',
    LD = 'Learning And Development',
    IT_HELP_DESK = 'IT Helpdesk'
}

export const ROLES_key = 'profileRoles';
