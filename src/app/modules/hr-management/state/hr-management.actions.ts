import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import {
  HRTeamMemberModel,
  HRTeamFiltrationModel,
  AssignHRModel,
} from '../model/hr-management.models';

export class GetMyHrTeamMembers {
  static readonly type = '[HR-MANAGEMENT] Get My HR team members';
}

export class SearchMyHrTeamMembers {
  static readonly type = '[HR-MANAGEMENT] Search My HR Team Members';
  constructor(public searchQuery: string) {}
}

export class PaginateMyHrTeamMembers {
  static readonly type = '[HR-MANAGEMENT] Paginate My HR Team Members';
  constructor(public pagination: PaginationConfigModel) {}
}


export class searchTeams {
  static readonly type = '[HR-MANAGEMENT] Search Teams';
  constructor(public query: string) {}
}

export class AssignHrTeam {
  static readonly type = '[HR-MANAGEMENT] Assign Hr Team';
  constructor(public team: AssignHRModel) {}
}

export class UnAssignHrTeam {
  static readonly type = '[HR-MANAGEMENT] Unassign Hr Team';
  constructor(public team: AssignHRModel) {}
}
