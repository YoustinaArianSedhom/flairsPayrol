import { EmployeesPermissions } from "@modules/employees/employees.permissions";
import { SystemRoles } from "./model/authorization.config";
import { PermissionModel } from "./model/authorization.model";


export const SystemPermissions: PermissionModel[] = [
    {
        name: 'VIEW_ENTITY',
        roles: [SystemRoles.Finance]
    },
    ...EmployeesPermissions
];
