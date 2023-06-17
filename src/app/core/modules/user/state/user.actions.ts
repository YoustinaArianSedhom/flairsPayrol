import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { UserModel } from '../model/user.model';

export class SetUser {
  static readonly type = '[User] Set User';
  constructor(public user: UserModel) { }
}

export class loadUserInfo {
  static readonly type = '[User] Load info';
}

export class GetUserProperty {
  static readonly type = '[User] Get User Property';
  constructor(public propertyName: string) {}
}


export class UpdateUserProperty {
  static readonly type = '[User] Update User Property';
  constructor(public property: string, public value: string) {}
}

export class UpdateRoles {
  static readonly type = '[User] Update User Roles';
  constructor(public roles: string[]) {}
}
export class GetMyProfileDetails {
  static readonly type = '[User] Get Profile Details';
  constructor() {}
}

export class ResetUserInfo {
  static readonly type = '[User] Reset User Info';
}


export class GetMyWorkflows {
  static readonly type = '[User] Get My Workflows'
  constructor() { }
}
export class PaginateMyWorkflows {
  static readonly type = '[User] Paginate My Workflows'
  constructor( public pagination: PaginationConfigModel) { }
}

export class GetMyWorkflowDetails {
  static readonly type = '[User] Get My Workflow Details'
  constructor(public id: string) { }
}
