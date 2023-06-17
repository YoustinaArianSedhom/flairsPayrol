import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import * as MONTHLY_PAYROLL_MODEL from '@modules/monthly-payrolls/model/monthly-payrolls.model'
export class GetMonthlyPayrolls {
  static readonly type = '[MonthlyPayrolls] Get All MonthlyPayrolls';
}

export class SearchMonthlyPayrolls {
  static readonly type = '[MonthlyPayrolls] Search MonthlyPayrolls';
  constructor(public term: string) { }
}

export class FilterMonthlyPayrolls {
  static readonly type = '[MonthlyPayrolls] Filter MonthlyPayrolls';
  constructor(public filtration: MONTHLY_PAYROLL_MODEL.MonthlyPayrollsFiltrationModel) {}
}


export class PaginateMonthlyPayrolls {
  static readonly type = '[MonthlyPayrolls] Paginate MonthlyPayrolls';
  constructor(public config: PaginationConfigModel) { }
}

export class CreateMonthlyPayroll {
  static readonly type = '[MonthlyPayrolls] Create Monthly Payroll';
  constructor(public body: MONTHLY_PAYROLL_MODEL.MonthlyPayrollAddingModel) {}
}

export class GetMonthlyPayrollSummary {
  static readonly type = '[MonthlyPayrolls] Get Monthly Payroll Summary';
  constructor(public payrollId: number) {}
}

export class GetMonthlyPayrollDetails {
  static readonly type = '[MonthlyPayrolls] Get Monthly Payroll Details';
  constructor(public payrollId: number) {}
}

export class PaginateMonthlyPayrollDetails {
  static readonly type = '[MonthlyPayrolls] Paginate Monthly Payroll Details'
  constructor(public pagination: PaginationConfigModel) {}
}

export class SearchMonthlyPayrollDetails {
  static readonly type = '[MonthlyPayrolls] Search Monthly Payroll Details';
  constructor(public detailsSearchQuery: string) {}
}

export class FilterMonthlyPayrollDetails {
  static readonly type = '[MonthlyPayrolls] Filter Monthly Payroll Details';
  constructor(public insuranceStatusFilter: number) {}
}

export class ResetFilterMonthlyPayrollDetails {
  static readonly type = '[MonthlyPayrolls] reset Filter Monthly Payroll Details';
  constructor() {}
}

export class DeleteMonthlyPayroll {
  static readonly type = '[MonthlyPayrolls] Delete Monthly Payroll';
  constructor(public payrollId: number) {}
}

export class OpenMonthlyPayroll {
  static readonly type = '[MonthlyPayrolls] Open Monthly Payroll';
  constructor(public payrollId: number) {}
}

export class CloseMonthlyPayroll {
  static readonly type = '[MonthlyPayrolls] Close Monthly Payroll';
  constructor(public payrollId: number) {}
}

export class PublishMonthlyPayroll {
  static readonly type = '[MonthlyPayrolls] Publish Monthly Payroll';
  constructor(public payrollId: number) {}
}
export class TransferMonthlyPayroll {
  static readonly type = '[MonthlyPayrolls] Transfer Monthly Payroll';
  constructor(public payrollId: number) {}
}

export class GetPayrollTransferDates{
  static readonly type = '[MonthlyPayrolls] Get Payroll Transfer Dates';
  constructor(public payrollId: number) {}
}

export class FilterMonthlyPayrollWithTransferDate{
  static readonly type = '[MonthlyPayrolls] Filter MonthlyPayroll With Transfer Date';
  constructor(public transferDateFilter: string) {}
}

export class ExportMonthlyPayroll {
  static readonly type = '[MonthlyPayrolls] Export Monthly Payroll';
  constructor(public config: MONTHLY_PAYROLL_MODEL.MonthlyPayrollExportingModel) {}
}

export class ClearMonthlyPayrollSummaryAndDetails {
  static readonly type = '[MonthlyPayrolls] Clear Monthly Payroll Summary And Details'
}

export class SendMonthlyPayrollNotificationViaEmail {
  static readonly type = '[MonthlyPayroll] Send Monthly Payroll Notification Via Email';
  constructor(public payrollId: number, public emailType: number) {}
}
export class ExportOnePercentDeductionReport {
  static readonly type = '[MonthlyPayroll] Export Monthly Payroll One Percent Deduction Report';
  constructor(public payrollId: number, public MonthlyPayrollName: string) {}
}

export class GetPayrollSalariesSummary {
  static readonly type = '[MonthlyPayroll] Get Payroll Salaries Summary';
  constructor(public payrollId: number) {}
}

export class FilterMonthlyPayrollWithSuspensionStatus {
  static readonly type = '[MonthlyPayrolls] Filter MonthlyPayroll With Suspension Status';
  constructor(public suspensionStatusFilter: boolean) {}
}
export class GetCountOfProfilesShouldBeApplied {
  static readonly type = '[MonthlyPayroll] Get Count Of Profiles Should Be Applied';
  constructor(public payrollId: number) {}
}
export class GetCountOfProfilesShouldBeRemovedFromApplying {
  static readonly type = '[MonthlyPayroll] Get Count Of Profiles Should Be Removed From Applying';
  constructor(public payrollId: number) {}
}
export class GetProfilesShouldBeApplied {
  static readonly type = '[MonthlyPayroll] Get Profiles Should Be Applied';
  constructor(public payrollId: number) {}
}
export class GetProfilesShouldBeRemovedFromApplying {
  static readonly type = '[MonthlyPayroll] Get Profiles Should Be Removed From Applying';
  constructor(public payrollId: number) {}
}
export class ProfilesShouldBeAppliedPagination {
  static readonly type = '[MonthlyPayroll] Get Profiles Should Be Applied Pagination';
    constructor(public pagination: PaginationConfigModel, public payrollId: number, public action: string) {}
}
export class ProfilesShouldBeRemovedFromApplyingPagination {
  static readonly type = '[MonthlyPayroll] Get Profiles Should Be Removed From Applying Pagination';
  constructor(public pagination: PaginationConfigModel, public payrollId: number, public action: string) {}
}
export class ApplyLoyalty {
  static readonly type = '[MonthlyPayroll] Apply Loyalty';
  constructor(public payrollId: number, public profileIds: number[]) {}
}
export class RemoveAppliedLoyalty {
  static readonly type = '[MonthlyPayroll] Remove Applied Loyalty';
  constructor(public payrollId: number, public profileIds: number[]) {}
}
export class SelectLoyaltyBonus {
  static readonly type = '[MonthlyPayroll] Select Loyalty Bonus ';
  constructor(public task: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel, public checked: boolean, public action: string) { }
}

export class SelectAllLoyaltyBonus {
  static readonly type = '[MonthlyPayroll] Select All Loyalty Bonus ';
  constructor(public checked: boolean, public action: string) { }
}
export class ExportPayrollLoyaltyDetails {
  static readonly type = '[MonthlyPayroll] Export Payroll Loyalty Details Report';
  constructor(public payrollId: number, public monthlyPayrollName: string) {}
}