import { State, Action, StateContext } from '@ngxs/store';
import { MyTeamStateModel } from './my-team.state.model';
import * as MY_TEAM_ACTIONS from './my-team.actions';
import { MyTeamService } from '../model/my-team.service';
import { tap } from 'rxjs/operators';
import { PaginationModel } from '@core/http/apis.model';
import * as MY_TEAM_MODELS from '../model/my-team.models';
import { Injectable } from '@angular/core';
import { downloadFile } from '@shared/helpers/download-file.helper';



@Injectable()
@State<MyTeamStateModel>({
  name: 'myTeams',
  defaults: new MyTeamStateModel(),
})
export class MyTeamState {

  constructor(
    private _mainService: MyTeamService
  ) { }




  @Action(MY_TEAM_ACTIONS.GetMyTeamMembers)
  public getMyTeamMembers({ getState, patchState }: StateContext<MyTeamStateModel>) {
    const { pagination: { pageNumber, pageSize }, filtration } = getState();
    return this._mainService.getMyTeamMembers({ pageSize, pageNumber }, { ...filtration }).pipe(
      tap(({ records: members, totalPages, recordsTotalCount }: PaginationModel<MY_TEAM_MODELS.TeamMemberModel>) => patchState({
        members,
        pagination: { ...getState().pagination, totalPages, recordsTotalCount }
      }))
    )
  }



  @Action(MY_TEAM_ACTIONS.SearchMyTeamMembers)
  public searchMyTeamMembers({ getState, patchState, dispatch }: StateContext<MyTeamStateModel>, { searchQuery }: MY_TEAM_ACTIONS.SearchMyTeamMembers) {
    patchState({
      filtration: { ...getState().filtration, searchQuery },
      pagination: { ...getState().pagination, pageNumber: 0 }
    })


    dispatch(new MY_TEAM_ACTIONS.GetMyTeamMembers())
  }



  @Action(MY_TEAM_ACTIONS.PaginateMyTeamMembers)
  public paginateMyTeamMembers({ patchState, dispatch }: StateContext<MyTeamStateModel>, { pagination }: MY_TEAM_ACTIONS.PaginateMyTeamMembers) {
    patchState({ pagination })


    dispatch(new MY_TEAM_ACTIONS.GetMyTeamMembers())
  }

  @Action(MY_TEAM_ACTIONS.FilterMyTeamMembers)
  public filterMyTeamMembers({ patchState, getState, dispatch }: StateContext<MyTeamStateModel>, { filtration }: MY_TEAM_ACTIONS.FilterMyTeamMembers) {
    patchState({
      filtration: { ...getState().filtration, ...filtration },
      pagination: { ...getState().pagination, pageNumber: 0 }
    })
    dispatch(new MY_TEAM_ACTIONS.GetMyTeamMembers())

  }

  @Action(MY_TEAM_ACTIONS.ResestMyTeamMembers)
  public ResestMyTeamMembers({ patchState, getState, dispatch }: StateContext<MyTeamStateModel>) {
    patchState({
      filtration: { directSubsOnly:false, searchQuery: null },
      pagination: { ...getState().pagination, pageNumber: 0 }
    })
    dispatch(new MY_TEAM_ACTIONS.GetMyTeamMembers())

  }

  @Action(MY_TEAM_ACTIONS.GetMyTeamDetails)
  public GetMyTeamDetails({
    getState,
    patchState,
  }: StateContext<MyTeamStateModel>) {
    return this._mainService
      .getMyTeamDetails()
      .pipe(tap((teamDetails: MY_TEAM_MODELS.TeamDetails) => patchState({ teamDetails })));
  }

  @Action(MY_TEAM_ACTIONS.UpdateMyTeamDetails)
  public UpdateMyTeamDetails(
    { getState, patchState }: StateContext<MyTeamStateModel>,
    { teamDetails }: MY_TEAM_ACTIONS.UpdateMyTeamDetails
  ) {
    const { filtration } = getState();
    return this._mainService.updateMyTeamDetails(teamDetails);
  }

  @Action(MY_TEAM_ACTIONS.GetMyCurrentMonthlyTeamBudget)
  public GetMyCurrentMonthlyTeamBudget({ patchState }: StateContext<MyTeamStateModel>) {
    return this._mainService.getMyCurrentMonthlyTeamBudget().pipe(
      tap((currentBudget: MY_TEAM_MODELS.CurrentBudgetModel) => patchState({ currentBudget }))
    )
  }

  @Action(MY_TEAM_ACTIONS.GetCurrentMonthlyTeamBudgetByProfileId)
  public GetCurrentMonthlyTeamBudgetByProfileId({ patchState }: StateContext<MyTeamStateModel>, { profileId }: MY_TEAM_ACTIONS.GetCurrentMonthlyTeamBudgetByProfileId) {
    return this._mainService.getCurrentMonthlyTeamBudgetByProfileId(profileId).pipe(
      tap((managerCurrentBudget: MY_TEAM_MODELS.CurrentBudgetModel) => patchState({ managerCurrentBudget }))
    )
  }

  @Action(MY_TEAM_ACTIONS.GetProfileAssignedTeamBudget)
  public GetProfileAssignedTeamBudget({ patchState }: StateContext<MyTeamStateModel>, { profileId }: MY_TEAM_ACTIONS.GetProfileAssignedTeamBudget) {
    return this._mainService.getProfileAssignedTeamBudget(profileId).pipe(
      tap((profileAssignedTeamBudget: MY_TEAM_MODELS.ProfileAssignedTeamBudgetModel) => patchState({ profileAssignedTeamBudget }))
    )
  }

  @Action(MY_TEAM_ACTIONS.AssignTeamBudget)
  public AssignTeamBudget({ }, { body }: MY_TEAM_ACTIONS.AssignTeamBudget) {
    return this._mainService.assignTeamBudget(body).pipe(
      tap((res: MY_TEAM_MODELS.ProfileAssignedTeamBudgetModel) => res)
    )
  }

  @Action(MY_TEAM_ACTIONS.GetTeamLoyaltyBonusHistory)
  public GetTeamLoyaltyBonusHistory({ patchState }: StateContext<MyTeamStateModel>, { profileId }: MY_TEAM_ACTIONS.GetTeamLoyaltyBonusHistory) {
    return this._mainService.getLoyaltyHistoryForSubEmployee(profileId).pipe(
      tap((loyaltyBonusHistory: MY_TEAM_MODELS.MyTeamLoyaltyBonusModel) => patchState({ loyaltyBonusHistory }))
    )
  }

  @Action(MY_TEAM_ACTIONS.ExportMyTeam)
  public exportMyTeam( {getState,}: StateContext<MyTeamStateModel>) {
    const state = getState();
    return this._mainService.exportMyTeam(state.filtration).pipe(
      tap((res: Blob) => {
        downloadFile(res, state.teamDetails.name , res.type);
      })
    )
  }

}
