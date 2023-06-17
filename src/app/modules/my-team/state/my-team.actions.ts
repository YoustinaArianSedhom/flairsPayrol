import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TeamFiltrationModel, TeamDetails, AssignTeamBudgetFormBodyModel } from '../model/my-team.models';

export class GetMyTeamMembers {
  static readonly type = '[MY-TEAM] Get My team members';
}

export class SearchMyTeamMembers {
  static readonly type = '[MY-TEAM] Search My Team Members';
  constructor(public searchQuery: string) { }
}

export class PaginateMyTeamMembers {
  static readonly type = '[MY-TEAM] Paginate My Team Members';
  constructor(public pagination: PaginationConfigModel) { }
}

export class FilterMyTeamMembers {
  static readonly type = '[MY-TEAM] Filter My Team Members';
  constructor(public filtration: TeamFiltrationModel) { }
}

export class ResestMyTeamMembers {
  static readonly type = '[MY-TEAM] Reset My Team Members';
}

export class GetMyTeamDetails {
  static readonly type = '[MY-TEAM] Get My Team Details';
}

export class UpdateMyTeamDetails {
  static readonly type = '[MY-TEAM] Update My Team Details';
  constructor(public teamDetails: TeamDetails) { }
}

export class GetMyCurrentMonthlyTeamBudget {
  static readonly type = '[MY-TEAM] Get My Current Monthly Team Budget';
}

export class GetCurrentMonthlyTeamBudgetByProfileId {
  static readonly type = '[MY-TEAM] Get Current Monthly Team Budget By Profile Id';
  constructor(public profileId: number) { }
}
export class GetProfileAssignedTeamBudget {
  static readonly type = '[MY-TEAM] Get Profile Assigned Team Budget';
  constructor(public profileId: number) { }
}

export class AssignTeamBudget {
  static readonly type = '[MY-TEAM] Assign Team Budget';
  constructor(public body: AssignTeamBudgetFormBodyModel) { }
}
export class GetTeamLoyaltyBonusHistory {
  static readonly type = '[MY-TEAM] Get Team Loyalty Bonus History';
  constructor(public profileId: number) { }
}
export class ExportMyTeam {
  static readonly type = '[MY-TEAM] Export My Team';
}
