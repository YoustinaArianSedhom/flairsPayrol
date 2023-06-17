import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';

import { State, Action, StateContext, Selector } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { tap } from 'rxjs/operators';
import {
  HRTeamMemberModel,
  HRTeamFiltrationModel,
  TeamModel,
} from '../model/hr-management.models';
import { HrManagementService } from '../model/hr-management.service';
import * as HR_MANAGEMENT_ACTIONS from './hr-management.actions';

export class HRTeamStateModel {
  public HrTeamMembers: HRTeamMemberModel[];
  public Teams: TeamModel[];
  public searchQuery: string;
  public pagination: PaginationConfigModel;
  public filtration: HRTeamFiltrationModel;

  constructor() {
    this.HrTeamMembers = [];
    this.Teams = null;
    this.searchQuery = '';
    this.pagination = {
      totalPages: 0,
      recordsTotalCount: 0,
    };
    this.filtration = null;
  }
}

@Injectable()
@State<HRTeamStateModel>({
  name: 'myHrTeams',
  defaults: new HRTeamStateModel(),
})
export class MyHrTeamState {
  constructor(private _mainService: HrManagementService) {}

  @Selector() static members(state: HRTeamStateModel): HRTeamMemberModel[] {
    return state.HrTeamMembers;
  }

  @Selector() static filters(state: HRTeamStateModel): HRTeamFiltrationModel {
    return state.filtration;
  }

  @Selector() static pagination(
    state: HRTeamStateModel
  ): PaginationConfigModel {
    return state.pagination;
  }

  @Selector() static searchQuery(state: HRTeamStateModel): string {
    return state.searchQuery;
  }

  @Selector() static teams(state: HRTeamStateModel): TeamModel[] {
    return state.Teams;
  }

  @Action(HR_MANAGEMENT_ACTIONS.GetMyHrTeamMembers)
  public GetMyHrTeamMembers({
    getState,
    patchState,
  }: StateContext<HRTeamStateModel>) {
    const {
      pagination: { pageNumber, pageSize },
      searchQuery,
    } = getState();
    return this._mainService
      .getMyHRTeamMembers({ pageSize, pageNumber }, searchQuery)
      .pipe(
        tap(
          ({
            records: HrTeamMembers,
            totalPages,
            recordsTotalCount,
          }: PaginationModel<HRTeamMemberModel>) =>
            patchState({
              HrTeamMembers,
              pagination: {
                ...getState().pagination,
                totalPages,
                recordsTotalCount,
              },
            })
        )
      );
  }

  @Action(HR_MANAGEMENT_ACTIONS.searchTeams)
  public searchTeams(
    { patchState }: StateContext<HRTeamStateModel>,
    { query }: HR_MANAGEMENT_ACTIONS.searchTeams
  ) {
    return this._mainService.searchTeams(query).pipe(
      tap((teams: TeamModel[]) =>
        patchState({
          Teams: teams,
        })
      )
    );
  }

  @Action(HR_MANAGEMENT_ACTIONS.SearchMyHrTeamMembers)
  public SearchMyHrTeamMembers(
    { getState, patchState, dispatch }: StateContext<HRTeamStateModel>,
    { searchQuery }: HR_MANAGEMENT_ACTIONS.SearchMyHrTeamMembers
  ) {
    patchState({
      searchQuery,
      pagination: { ...getState().pagination, pageNumber: 0 },
    });

    dispatch(new HR_MANAGEMENT_ACTIONS.GetMyHrTeamMembers());
  }

  @Action(HR_MANAGEMENT_ACTIONS.AssignHrTeam)
  public AssignHrTeam(
    {  dispatch }: StateContext<HRTeamStateModel>,
    { team }: HR_MANAGEMENT_ACTIONS.AssignHrTeam
  ) {
    return this._mainService.assignHrTeam(team).pipe(
      tap(
        (res)=>dispatch(new HR_MANAGEMENT_ACTIONS.GetMyHrTeamMembers())
      )
    );
  }

  @Action(HR_MANAGEMENT_ACTIONS.UnAssignHrTeam)
  public UnAssignHrTeam(
    { getState, patchState, dispatch }: StateContext<HRTeamStateModel>,
    { team }: HR_MANAGEMENT_ACTIONS.AssignHrTeam
  ) {
    return this._mainService.unAssignHrTeam(team).pipe(
      tap(
        (res)=>dispatch(new HR_MANAGEMENT_ACTIONS.GetMyHrTeamMembers())
      )
    );
  }

  @Action(HR_MANAGEMENT_ACTIONS.PaginateMyHrTeamMembers)
  public PaginateMyHrTeamMembers(
    { patchState, dispatch }: StateContext<HRTeamStateModel>,
    { pagination }: HR_MANAGEMENT_ACTIONS.PaginateMyHrTeamMembers
  ) {
    patchState({ pagination });

    dispatch(new HR_MANAGEMENT_ACTIONS.GetMyHrTeamMembers());
  }

}
