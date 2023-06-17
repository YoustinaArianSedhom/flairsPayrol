import { Selector } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import * as MY_TEAM_MODELS from '../model/my-team.models';
import { MyTeamState } from './my-team.state';
import { MyTeamStateModel } from './my-team.state.model';

export class MyTeamStateSelectors {
  @Selector([MyTeamState]) static members(
    state: MyTeamStateModel
  ): MY_TEAM_MODELS.TeamMemberModel[] {
    return state.members;
  }

  @Selector([MyTeamState]) static filtration(
    state: MyTeamStateModel
  ): MY_TEAM_MODELS.TeamFiltrationModel {
    return state.filtration;
  }

  @Selector([MyTeamState]) static paginationConfig(
    state: MyTeamStateModel
  ): PaginationConfigModel {
    return state.pagination;
  }

  @Selector([MyTeamState]) static searchQuery(state: MyTeamStateModel): string {
    return state.filtration?.searchQuery;
  }

  @Selector([MyTeamState]) static teamDetails(
    state: MyTeamStateModel
  ): MY_TEAM_MODELS.TeamDetails {
    return state.teamDetails;
  }

  @Selector([MyTeamState]) static currentBudget(state: MyTeamStateModel) : MY_TEAM_MODELS.CurrentBudgetModel { return state.currentBudget}
  @Selector([MyTeamState]) static managerCurrentBudget(state: MyTeamStateModel) : MY_TEAM_MODELS.CurrentBudgetModel { return state.managerCurrentBudget}

  @Selector([MyTeamState]) static currentBudgetRecords(state: MyTeamStateModel) : MY_TEAM_MODELS.BudgetItemsDetail[] { return state.currentBudget.budgetItemsDetails}
  @Selector([MyTeamState]) static managerCurrentBudgetRecords(state: MyTeamStateModel) : MY_TEAM_MODELS.BudgetItemsDetail[] { return state.managerCurrentBudget.budgetItemsDetails}
  @Selector([MyTeamState]) static profileAssignedTeamBudget(state: MyTeamStateModel) : MY_TEAM_MODELS.ProfileAssignedTeamBudgetModel { return state.profileAssignedTeamBudget}

  @Selector([MyTeamState]) static loyaltyBonusHistoryRecords(state:MyTeamStateModel) : MY_TEAM_MODELS.MyTeamLoyaltyBonusModel { return state.loyaltyBonusHistory}
}
