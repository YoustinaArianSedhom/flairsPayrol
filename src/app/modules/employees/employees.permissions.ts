import { SystemRoles } from "@core/modules/authorization/model/authorization.config";
import { PermissionModel } from "@core/modules/authorization/model/authorization.model";

export const EmployeesPermissions: PermissionModel[] = [
    {
        name: 'UPDATE_PROFILE_ROLES',
        roles: [SystemRoles.ITSupport],
    }, {
        name: 'VIEW_PROFILE_DETAILS',
        roles: [SystemRoles.Payroll],
    }, {
        name: 'ARCHIVE_PROFILE',
        roles: [SystemRoles.Payroll]
    }, {
        name: 'SUBMIT_PROFILE',
        roles: [SystemRoles.Payroll]
    }, {
        name:'VIEW_WORKFLOW_HISTORY',
        roles:[SystemRoles.Payroll, SystemRoles.PayrollManager]
    }
] 
