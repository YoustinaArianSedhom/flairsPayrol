import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { EntityModel, GlobalDeductionModel, GlobalAdditionModel } from '../model/entities.model';

export class GetAllCountries {
  static readonly type = '[Countries] Get List of All Countries';
}
export class GetAllEntities {
  static readonly type = '[Entities] Get List of All Entities';
}

export class PaginateEntities {
  static readonly type = '[Entities] Paginate Entities';
  constructor(public config: PaginationConfigModel) { }
}

export class GetEntitySummary {
  static readonly type = '[Entities] Get Entity Summary';
  constructor(public id: number) { }
}

export class GetProfilesInEntity {
  static readonly type = '[Entities] Get Entity profiles';
  constructor() { }
}
export class PaginateEntityProfiles {
  static readonly type = '[Entities] Paginate Entities Profiles';
  constructor(public config: PaginationConfigModel) { }
}
export class AddNewEntity {
  static readonly type = '[Entities] Add New Entity';
  constructor(public entity: EntityModel) { }
}
export class UpdateEntity {
  static readonly type = '[Entities] Update An Entity';
  constructor(public entity: EntityModel) { }
}

export class DeleteEntity {
  static readonly type = '[Entities] Delete An Entity';
  constructor(public id: number) { }
}
export class GetCountryNameById {
  static readonly type = '[Entities] Get Country Name By Id';
  constructor(public id: number) { }
}
export class SearchEntities {
  static readonly type = '[Entities] Search in Entities';
  constructor(public term: string) { }
}
export class SearchEntitiesProfiles {
  static readonly type = '[Entities] Search in Entities Profiles';
  constructor(public term: string) { }
}


//TODO global deduction to be separated
export class GetGlobalDeductions {
  static readonly type = '[Global Deduction] Get Global Deduction By Entity Id';
  constructor(public entityId: number) { }
}
export class AddNewGlobalDeduction {
  static readonly type = '[Global Deduction] Add Global Deduction To An Entity';
  constructor(public globalDeduction: GlobalDeductionModel) { }
}
export class UpdateGlobalDeduction {
  static readonly type = '[Global Deduction] Update Global Deduction of An Entity';
  constructor(public globalDeduction: GlobalDeductionModel) { }
}
export class DeleteGlobalDeduction {
  static readonly type = '[Global Deduction] Delete Global Deduction of An Entity';
  constructor(public globalDeductionId: number) { }
}

/* __________________________________ Global Additions  __________________________________*/

export class GetGlobalAdditions {
  static readonly type = '[Global Addition] Get Global Additions By Entity Id';
  constructor(public entityId: number) { }
}

export class AddNewGlobalAddition {
  static readonly type = '[Global Addition] Add New Global Addition';
  constructor(public globalAddition: GlobalAdditionModel) { }
}

export class UpdateGlobalAddition {
  static readonly type = '[Global Addition] Update Global Addition';
  constructor(public globalAddition: GlobalAdditionModel) { }
}

export class DeleteGlobalAddition {
  static readonly type = '[Global Addition] Delete Global Addition';
  constructor(public globalAdditionId: number) { }
}

/* __________________________________ Global Additions And Deductions  __________________________________*/

export class GetGlobalAdditionDeduction {
  static readonly type = '[Global Addition Deduction] Get Global Addition Deduction';
  constructor(public entityId: number) { }
} 
