import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import { PayslipsFiltrationModel, PayslipsProfileModel } from "../model/payslips.model";


export class GetMyPayslipsSummary {
  static readonly type = '[Payslips] Get My Payslips Summary';
}

export class GetMyPayslips {
  static readonly type = "[Payslips] Get My Payslips";
}

export class PaginateMyPayslips {
  static readonly type = "[Payslips] Paginate My Payslips"
  constructor(public pagination: PaginationConfigModel) {}
}

export class GetLastPublishedPayrollDate {
  static readonly type = '[Payslips] Get Last Published Payroll Date'
}

export class GetMyTeamPayslips {
  static readonly type = '[Payslips] Get My Team Payslips';
}

export class SearchMyTeamPayslips {
  static readonly type = '[Payslips] Search My Team Payslips';
  constructor(public searchQuery: string) {}
}

export class FilterMyTeamPayslips {
  static readonly type = '[Payslips] Filter My Team Payslips';
  constructor(public filtration: PayslipsFiltrationModel) {}
}

export class ResetFilterMyTeamPayslips {
  static readonly type = '[Payslips] Reset Filter My Team Payslips';
  constructor() {}
}

export class PaginateMyTeamPayslips {
  static readonly type = '[Payslips] Paginate My Team Payslips';
  constructor(public pagination: PaginationConfigModel) {}
}

export class GetProfilePayslips {
  static readonly type = '[Payslips] Get Profile Payslips';
  constructor(public config: PayslipsProfileModel) {}
}

export class GetProfilePayslipsSummary {
  static readonly type = '[Payslips] Get Profile Payslips Summary';
  constructor(public config: PayslipsProfileModel) {}
}

export class PaginateProfilePayslips {
  static readonly type = '[Payslips] Paginate Profile Payslips';
  constructor(public pagination: PaginationConfigModel, public config: PayslipsProfileModel) {}
}

export class GetTeamPayslipsAggregates {
  static readonly type = '[Payslips] Get Team Payslips Aggregates';
  constructor() {}
}

export class FindSubsWithManagerRoles {
  static readonly type = '[Payslips] Find Subs With Manager Roles';
}
