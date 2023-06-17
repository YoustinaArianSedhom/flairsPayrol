import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import {
  TeamDetails,
  TeamFiltrationModel,
  TeamMemberModel,
  CurrentBudgetModel,
  ProfileAssignedTeamBudgetModel,
  MyTeamLoyaltyBonusModel,
} from '../model/my-team.models';

export class MyTeamStateModel {
  public members: TeamMemberModel[];
  public pagination: PaginationConfigModel;
  public filtration: TeamFiltrationModel;
  public teamDetails: TeamDetails;
  public currentBudget: CurrentBudgetModel;
  public managerCurrentBudget: CurrentBudgetModel;
  public profileAssignedTeamBudget: ProfileAssignedTeamBudgetModel;
  public loyaltyBonusHistory: MyTeamLoyaltyBonusModel;

  constructor() {
    this.members = [];
    this.pagination = {
      totalPages: 0,
      recordsTotalCount: 0,
      pageNumber:0,
      pageSize:10
    };
    this.filtration = {
      directSubsOnly: false,
      subsInRoleManagerOnly: false,
      month: null,
      year: null,
      statuses: [],
      searchQuery: ''
    };
    this.teamDetails = null;
    this.currentBudget = null;
    this.managerCurrentBudget = null;
    this.profileAssignedTeamBudget = null;
    this.loyaltyBonusHistory = null;
  }
}
