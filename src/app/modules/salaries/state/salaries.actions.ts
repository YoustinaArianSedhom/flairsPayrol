import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";
import { EmployeeFilterModel } from "../model/salaries.interface";

export class GetEmployeeSalarySummaries {
  static readonly type = '[Salaries] Get Profiles Salaries Summaries';
}

export class SearchEmployeeSalarySummaries {
  static readonly type = '[Salaries] Search In Employees Salaries';
  constructor(public term: string) { }
}

export class ResetEmployeeSalarySummaries {
  static readonly type = '[Salaries] Reset Employees Salaries';
  constructor() { }
}

export class SortEmployeeSalarySummaries {
  static readonly type = '[Salaries] Sort Salaries';
  constructor(public sort: {sortField: number, sortType: number}) {}
}

export class PaginateEmployeesSalariesSummaries {
  static readonly type = '[Salaries] Paginate Employees Salaries Summaries';
  constructor(public pagination: PaginationConfigModel) {}
}
export class FilterEmployeeSalarySummariesByEntityId {
  static readonly type = '[Salaries] Filter Salaries by entity id';
  constructor(public filters: {entityId: any}) {}
}

export class FilterEmployeeSalarySummaries {
  static readonly type = '[Salaries] Filter Salaries';
  constructor(public filters: EmployeeFilterModel) {}
}
