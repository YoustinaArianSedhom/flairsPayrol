import { ProfileModel } from '@core/modules/user/model/user.model';
import * as SALARY_DETAILS_Models from '@modules/employees/modules/employee-salary/model/salary-details.model';
export class GetPersonalInfo {
  static readonly type = '[Employee Salary] Get Employee Personal Info';
  constructor(public id: number) {}
}
export class GetBankInfo {
  static readonly type = '[Employee Salary] Get Employee Bank Info';
  constructor(public id: number) {}
}
export class GetPayrollInfo {
  static readonly type = '[Employee Salary] Get Employee Payroll Info';
  constructor(public id: number) {}
}
export class GetEntitiesInfo {
  static readonly type = '[Employee Salary] Get Employee Entity Info';
  constructor(public id: number) {}
}
export class GetEntitiesHistory {
  static readonly type = '[Employee Salary] Get Employee Entities History';
  constructor(public id: number) {}
}
export class GetDefaultMonthlyPersonalExemption {
  static readonly type = '[Employee Salary] Get Default Monthly Personal Exemption';
  constructor() {}
}
export class GetMonthlySocialInsurance {
  static readonly type = '[Employee Salary] Get Monthly Social Insurance';
  constructor(sum: number) {}
}
export class GetMonthlyNetSalary {
  static readonly type = '[Employee Salary] Get Monthly Net Salary';
  constructor(netSalary: SALARY_DETAILS_Models.monthlyNetSalary) {}
}
export class JoinEntity {
  static readonly type = '[Employee Salary] Join Entity';
  constructor(public entity: SALARY_DETAILS_Models.JoinEntityModel) {}
}
export class LeaveEntity {
  static readonly type = '[Employee Salary] Leave Entity';
  constructor(public config: SALARY_DETAILS_Models.LeaveEntityModel) {}
}

export class UpdateJoinedEntityInfo {
  static readonly type = '[Employee Salary] Update Joined Entity Details';
  constructor(public entity: SALARY_DETAILS_Models.JoinEntityModel) {}
}

export class UpdateEmployeeBankDetails {
  static readonly type = '[Employee Profile] Update Employee Bank Details';
  constructor(public bankDetails: SALARY_DETAILS_Models.EmployeeBankDetailsModel) {}
}
export class UpdateEmployeePersonalInfo {
  static readonly type = '[Employee Profile] Update Employee Personal Info';
  constructor(public personalInfo: SALARY_DETAILS_Models.EmployeePersonalInfo) {}
}

export class SuspendSalary {
  static readonly type = '[Suspend Salary] Suspend Salary';
  constructor(public suspendSalary: SALARY_DETAILS_Models.SuspendSalaryModel) {}
}
export class GetSalarySuspensionReasons {
  static readonly type = '[Suspension Reasons] Get Salary Suspension Reasons';
}
export class GetSuspensionDetails {
  static readonly type = '[Suspension Details] Get Suspension Details';
  constructor(public personalInfoId: number) {}
}
export class UnSuspendSalary {
  static readonly type = '[UnSuspend Salary] UnSuspend Salary';
  constructor(public unSuspendSalary: SALARY_DETAILS_Models.UnSuspendSalaryModel) {}
}
