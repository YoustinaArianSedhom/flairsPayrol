import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';

import { State, Action, StateContext, Selector } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { tap } from 'rxjs/operators';
import {
  TeamMemberModel,
  TeamFiltrationModel
} from '../model/all-teams.models';
import { AllTeamsService } from '../model/all-teams.service';
import * as ALL_TEAMS_ACTIONS from './all-teams.actions';

export class AllTeamsStateModel {
  public allTeams: TeamMemberModel[];
  public searchQuery: string;
  public pagination: PaginationConfigModel;
  public filtration: TeamFiltrationModel;

  constructor() {
    this.allTeams = [];
    this.searchQuery = '';
    this.pagination = {
      totalPages: 0,
      recordsTotalCount: 0,
    };
    this.filtration = null;
  }
}

@Injectable()
@State<AllTeamsStateModel>({
  name: 'allTeams',
  defaults: new AllTeamsStateModel(),
})
export class AllTeamsState {
  constructor(private _mainService: AllTeamsService) { }

  @Selector() static allTeams(state: AllTeamsStateModel): TeamMemberModel[] {
    return state.allTeams;
  }

  @Selector() static filters(state: AllTeamsStateModel): TeamFiltrationModel {
    return state.filtration;
  }

  @Selector() static pagination(
    state: AllTeamsStateModel
  ): PaginationConfigModel {
    return state.pagination;
  }

  @Selector() static searchQuery(state: AllTeamsStateModel): string {
    return state.searchQuery;
  }



  @Action(ALL_TEAMS_ACTIONS.GetAllTeams)
  public GetMyHrTeamMembers({
    getState,
    patchState,
  }: StateContext<AllTeamsStateModel>) {
    const {
      pagination: { pageNumber, pageSize },
      searchQuery,
    } = getState();
    return this._mainService
      .getAllTeams({ pageSize, pageNumber }, searchQuery)
      .pipe(
        tap(
          ({
            records: allTeams,
            totalPages,
            recordsTotalCount,
          }: PaginationModel<TeamMemberModel>) =>
            patchState({
              allTeams,
              pagination: {
                ...getState().pagination,
                totalPages,
                recordsTotalCount,
              },
            })
        )
      );
  }


  @Action(ALL_TEAMS_ACTIONS.SearchAllTeams)
  public SearchMyHrTeamMembers(
    { getState, patchState, dispatch }: StateContext<AllTeamsStateModel>,
    { searchQuery }: ALL_TEAMS_ACTIONS.SearchAllTeams
  ) {
    patchState({
      searchQuery,
      pagination: { ...getState().pagination, pageNumber: 0 },
    });

    dispatch(new ALL_TEAMS_ACTIONS.GetAllTeams());
  }


  @Action(ALL_TEAMS_ACTIONS.PaginateAllTeams)
  public PaginateMyHrTeamMembers(
    { patchState, dispatch }: StateContext<AllTeamsStateModel>,
    { pagination }: ALL_TEAMS_ACTIONS.PaginateAllTeams
  ) {
    patchState({ pagination });

    dispatch(new ALL_TEAMS_ACTIONS.GetAllTeams());
  }


  @Action(ALL_TEAMS_ACTIONS.UpdateTeamPaidAllocation)
  public updateTeamPaidAllocation({ dispatch }: StateContext<AllTeamsStateModel>, { teamId, hasPaidAllocation }: ALL_TEAMS_ACTIONS.UpdateTeamPaidAllocation) {
    return this._mainService.updateTeamPaidAllocation(teamId, hasPaidAllocation).pipe(
      tap(
        (res) => dispatch(new ALL_TEAMS_ACTIONS.GetAllTeams())
      )
    )
  }
}
