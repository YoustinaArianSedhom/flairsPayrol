import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { switchMap, tap } from 'rxjs/operators';
import { ProfileLevelSummary, ProfilesLevelsSummariesFiltrationModel } from '../model/profiles-levels.model';
import { ProfilesLevelsService } from '../model/profiles-levels.service';
import * as ProfilesLevelsActions from './profiles-levels.actions';

export class ProfilesLevelsStateModel {
  public records: ProfileLevelSummary[];
  public searchQuery: string;
  public filtration: ProfilesLevelsSummariesFiltrationModel;
  public pagination: PaginationConfigModel;
  

  public constructor () {
    this.records = [];
    this.searchQuery = null;
    this.filtration = {
      entityId: 1,
    }
    this.pagination = {}
  }
}

@Injectable()
@State<ProfilesLevelsStateModel>({
  name: 'profilesLevels',
  defaults: new ProfilesLevelsStateModel()
})
export class ProfilesLevelsState {
  constructor(private readonly _ProfilesLevelsService: ProfilesLevelsService) {}


  @Selector() static records(state: ProfilesLevelsStateModel): ProfileLevelSummary[] {
    return state.records;
  }

  @Selector() static searchQuery(state: ProfilesLevelsStateModel): string {
    return state.searchQuery;
  }

  @Selector() static filtration(state: ProfilesLevelsStateModel): ProfilesLevelsSummariesFiltrationModel {
    return state.filtration;
  }

  @Selector() static pagination(state: ProfilesLevelsStateModel): PaginationConfigModel {
    return {...state.pagination}
  }


  @Action(ProfilesLevelsActions.GetProfilesLevelsSummaries)
  public getProfilesLevelsSummaries({getState, patchState}: StateContext<ProfilesLevelsStateModel>) {
    const {pagination: {pageNumber, pageSize}, filtration, searchQuery} = getState();
    return this._ProfilesLevelsService.getProfilesLevelsSummaries({pageNumber, pageSize}, {...filtration, searchQuery}).pipe(
      tap(({records, recordsTotalCount, totalPages, pageNumber, pageSize}: PaginationModel<ProfileLevelSummary>) => patchState({
        records,
        pagination: {recordsTotalCount, totalPages, pageNumber, pageSize}
      }))
    )
  }


  @Action(ProfilesLevelsActions.SearchProfilesLevelsSummaries)
  public searchProfilesLevelsSummaries({getState, patchState, dispatch}: StateContext<ProfilesLevelsStateModel>, {searchQuery}: ProfilesLevelsActions.SearchProfilesLevelsSummaries) {
    patchState({
      searchQuery,
      pagination: {...getState().pagination, pageNumber: 0}
    })
    dispatch(new ProfilesLevelsActions.GetProfilesLevelsSummaries())
  }


  @Action(ProfilesLevelsActions.FilterProfilesLevelsSummaries)
  public filterProfilesLevelsSummaries({getState, patchState, dispatch}: StateContext<ProfilesLevelsStateModel>, {filtration}: ProfilesLevelsActions.FilterProfilesLevelsSummaries) {
    patchState({
      filtration: {...getState().filtration, ...filtration},
      pagination: {...getState().pagination, pageNumber: 0}
    })
    dispatch(new ProfilesLevelsActions.GetProfilesLevelsSummaries())
  }

  @Action(ProfilesLevelsActions.ResetProfilesLevelsSummaries)
  public ResetProfilesLevelsSummaries({getState, patchState, dispatch}: StateContext<ProfilesLevelsStateModel>) {
    patchState({
      filtration: { entityId: 1,},
      searchQuery: null,
      pagination: {...getState().pagination, pageNumber: 0}
    })
    dispatch(new ProfilesLevelsActions.GetProfilesLevelsSummaries())
  }


  @Action(ProfilesLevelsActions.PaginateProfilesLevelsSummaries)
  public paginateProfilesLevelsSummaries({patchState, dispatch}: StateContext<ProfilesLevelsStateModel>, {pagination}: ProfilesLevelsActions.PaginateProfilesLevelsSummaries) {
    patchState({pagination})
    dispatch(new ProfilesLevelsActions.GetProfilesLevelsSummaries())
  }


  @Action(ProfilesLevelsActions.UpdateProfileLevel)
  public UpdateProfileLevel({dispatch}: StateContext<ProfilesLevelsStateModel>, {config}: ProfilesLevelsActions.UpdateProfileLevel) {
    return this._ProfilesLevelsService.updateProfileLevel(config).pipe(
      switchMap(() => dispatch(new ProfilesLevelsActions.GetProfilesLevelsSummaries()))
    )
  }

  @Action(ProfilesLevelsActions.UpdateProfilePersonalInfo)
  public UpdateProfilePersonalInfo({dispatch}: StateContext<ProfilesLevelsStateModel>, {config}: ProfilesLevelsActions.UpdateProfilePersonalInfo) {
    return this._ProfilesLevelsService.UpdatePersonalInfo(config).pipe(
      switchMap(() => dispatch(new ProfilesLevelsActions.GetProfilesLevelsSummaries()))
    )
  }
}
