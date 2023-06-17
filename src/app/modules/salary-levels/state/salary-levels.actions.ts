import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { SalaryLevelModel } from '../model/salaries-level.model';

export class SearchSalaryLevels {
  static readonly type = '[Salary Levels] Search';
  constructor(public term: string) { }
}


export class GetSalaryLevels {
  static readonly type = '[Salary Levels] Get Salary Levels';
}

export class SortSalaryLevels {
  static readonly type = '[Salary Levels] Sort Salary Levels';
  constructor(public sort: {sortField: number, sortType: number}) {}
}
export class PaginateSalaryLevels {
  static readonly type = '[Salary Levels] Paginate Salary Levels';
  constructor(public config: PaginationConfigModel) {}
}

export class AddSalaryLevel {
  static readonly type = '[Salary Levels] Add Salary Level';
  constructor (public record: SalaryLevelModel) {}
}

export class UpdateSalaryLevel {
  static readonly type = '[Salary Levels] Update Salary Level';
  constructor(public record: SalaryLevelModel) {}
}


export class RemoveSalaryLevel {
  static readonly type = '[Salary Levels] Remove Salary Level';
  constructor(public id: number) {}
}
