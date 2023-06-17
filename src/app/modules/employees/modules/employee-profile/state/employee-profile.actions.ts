import { PaginationConfigModel } from "@shared/modules/pagination/model/pagination.model";

export class GetEmployeeDetails {
  static readonly type = '[Employee Profile] Get Employee Details';
  constructor(public id: number) { }
}

export class ClearEmployeeDetails {
  static readonly type = '[Employee Details] Clear Employee Details';
}


export class GetEmployeeWorkflows {
  static readonly type = '[Employee Profile] Get Employee Workflows'
  constructor(public memberOrganizationEmail: string) { }
}
export class PaginateEmployeeWorkflows {
  static readonly type = '[Employee Profile] Paginate Employee Workflows'
  constructor(
    public pagination: PaginationConfigModel,
    public memberOrganizationEmail: string) { }
}

export class GetEmployeeWorkflowDetails {
  static readonly type = '[Employee Profile] Get Employee Workflow Details'
  constructor(public id: string) { }
}
