import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';

export class GetAllTeams {
  static readonly type = '[ALL-TEAMS] Get all teams';
}

export class SearchAllTeams {
  static readonly type = '[ALL-TEAMS] Search all teams';
  constructor(public searchQuery: string) { }
}

export class PaginateAllTeams {
  static readonly type = '[ALL-TEAMS] Paginate all teams';
  constructor(public pagination: PaginationConfigModel) { }
}

export class UpdateTeamPaidAllocation {
  static readonly type = '[ALL-TEAMS] Update Team Paid Allocation';
  constructor(public teamId: number, public hasPaidAllocation: boolean) { }
}