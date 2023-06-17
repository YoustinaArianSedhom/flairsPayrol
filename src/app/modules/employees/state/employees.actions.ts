import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import { openedFromType, FiltrationModel } from "../model/employees.model";

export class SearchEmployees {
  static readonly type = '[Employees] Search Employees';
  constructor(public term: string) { }
}

export class FilterEmployees {
  static readonly type = '[Employees] Filter Employees';
  constructor(public filtration: FiltrationModel) {}
}

export class ResetFilterEmployees {
  static readonly type = '[Employees] Reset Employees';
  constructor() {}
}


export class GetEmployees {
  static readonly type = '[Employees] Get All Employees';
}



export class SortEmployees {
  static readonly type = '[Employees] Sort Employees';
  constructor(public sort: { sortField: number, sortType: number }) { }
}

export class PaginateEmployees {
  static readonly type = '[Employees] Paginate Employees';
  constructor(public config: PaginationConfigModel) { }
}

export class ArchiveEmployee {
  static readonly type = '[Employee] Archive Employee';
  constructor(public id: number) { }
}


export class SubmitEmployee {
  static readonly type = '[Employees] Submit Employee';
  constructor(public id: number) { }
}


export class UpdateEmployeeRoles {
  static readonly type = '[Employees] Update Employee Roles';
  constructor(public body: {profileId: number; newRoles: string[]}, public from: openedFromType) {}
}



