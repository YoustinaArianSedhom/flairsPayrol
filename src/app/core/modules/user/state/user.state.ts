import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { UserService } from '../model/user.service';
import { tap } from 'rxjs/operators';
import * as USER_MODELS from '@core/modules/user/model/user.model';
import * as USER_ACTIONS from '@core/modules/user/state/user.actions';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { OrgConfigInst } from '@core/config/organization.config';
import { PaginationModel } from '@core/http/apis.model';

export class UserStateModel {
  public user!: USER_MODELS.UserModel;
  public myProfile!: USER_MODELS.ProfileModel;

  public myWorkflows: USER_MODELS.MyWorkflowsModel[]
  public pagination: PaginationConfigModel
  public myWorkflowDetails: USER_MODELS.MyWorkflowDetailsModel[]

}

@Injectable()
@State<UserStateModel>({
  name: 'flairs_payroll_user',
  defaults: {
    user: {
      profileId: null,
      profileTitle: null,
      profileName: null,
      profileRoles: [],
    },
    myProfile: null,
    myWorkflows: [],
    pagination: {
      pageNumber: OrgConfigInst.CRUD_CONFIG.paginationDefaults.startAt,
      pageSize: OrgConfigInst.CRUD_CONFIG.paginationDefaults.size
    },
    myWorkflowDetails: []
  }
})
export class UserState {
  constructor(
    private _userService: UserService
  ) { }

  @Selector()
  static user(state: UserStateModel): USER_MODELS.UserModel {
    return state.user;
  }

  @Selector()
  static userRoles(state: UserStateModel): string[] {
    return state.user.profileRoles;
  }
  @Selector()
  static myProfile(state: UserStateModel): USER_MODELS.ProfileModel {
    return state.myProfile;
  }

  @Selector()
  static myWorkflows(state: UserStateModel): USER_MODELS.MyWorkflowsModel[] {
    return state.myWorkflows
  }

  @Selector()
  static pagination(state: UserStateModel): PaginationConfigModel {
    return { ...state.pagination };
  }

  @Selector()
  static myWorkflowsDetails(state: UserStateModel): USER_MODELS.MyWorkflowDetailsModel[] {
    return state.myWorkflowDetails
  }


  @Action(USER_ACTIONS.GetMyProfileDetails)
  public getMyProfileDetails({ patchState }: StateContext<UserStateModel>) {
    return this._userService.getMyProfileDetails().pipe(
      tap((myProfile: USER_MODELS.ProfileModel) => patchState({ myProfile })
      )
    )
  }

  @Action(USER_ACTIONS.SetUser)
  setUser(ctx: StateContext<UserStateModel>, { user }: USER_ACTIONS.SetUser) {
    ctx.patchState({ user });
  }

  @Action(USER_ACTIONS.ResetUserInfo)
  public resetUserInfo({ dispatch }: StateContext<UserStateModel>) {
    // alert("we are resetting user info")
    return this._userService.GetMyUserInfo().pipe(
      tap((user: USER_MODELS.UserModel) => dispatch(new USER_ACTIONS.SetUser(user)))
    )
  }



  @Action(USER_ACTIONS.UpdateUserProperty)
  updateUserProperty(ctx: StateContext<UserStateModel>, { property, value }: USER_ACTIONS.UpdateUserProperty) {
    ctx.patchState({ user: { ...ctx.getState().user, [property]: value } });
  }


  @Action(USER_ACTIONS.UpdateRoles)
  public updateRoles({ patchState, getState, dispatch }: StateContext<UserStateModel>, { roles: profileRoles }: USER_ACTIONS.UpdateRoles) {
    patchState({ user: { ...getState().user, profileRoles } });
  }


  @Action(USER_ACTIONS.GetMyWorkflows)
  public getMyWorkflows({ getState, patchState }: StateContext<UserStateModel>) {
    const { pagination: { pageNumber, pageSize } } = getState()
    return this._userService.getMyWorkflows({ pageNumber, pageSize }).pipe(
      tap(
        ({ records, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<USER_MODELS.MyWorkflowsModel>) => {
          patchState({
            myWorkflows: records,
            pagination: { pageSize, pageNumber, totalPages, recordsTotalCount }
          })
        }
      )
    )
  }

  @Action(USER_ACTIONS.PaginateMyWorkflows)
  public paginateMyWorkflows({ patchState, dispatch }: StateContext<UserStateModel>, { pagination }: USER_ACTIONS.PaginateMyWorkflows) {
    patchState({ pagination })
    dispatch(new USER_ACTIONS.GetMyWorkflows())
  }


  @Action(USER_ACTIONS.GetMyWorkflowDetails)
  public getMyWorkflowDetails({ patchState }: StateContext<UserStateModel>, { id }: USER_ACTIONS.GetMyWorkflowDetails) {
    return this._userService.getMyWorkflowDetails(id).pipe(
      tap(
        (myWorkflowDetails: USER_MODELS.MyWorkflowDetailsModel[]) => patchState({ myWorkflowDetails })
      )
    )
  }
}
