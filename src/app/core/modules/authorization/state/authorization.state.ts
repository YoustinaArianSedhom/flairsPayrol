import { State, NgxsOnInit, StateContext, Selector, Action } from '@ngxs/store';
import { PermissionsListModel, SystemRolesModel } from '../model/authorization.model';
import { AuthorizationService } from '../model/authorization.service';
import { SystemPermissions } from '../authorization.rules';
import { InstallPermissions, LoadSystemRoles, SetGrantedRoles } from './authorization.actions';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { SystemRoles } from '../model/authorization.config';

export class AuthorizationStateModel {
  public permissions: PermissionsListModel;
  public systemRoles: SystemRolesModel
  public grantedRoles: string[]


  constructor() {
    this.permissions = {};
    this.systemRoles = {
      updatableRoles: [],
      nonUpdatableRoles: [],
      allRoles: []
    };
    this.grantedRoles = []
  }
}

@Injectable()
@State<AuthorizationStateModel>({
  name: 'authorization',
  defaults: new AuthorizationStateModel()
})
export class AuthorizationState implements NgxsOnInit {
  constructor(
    private _authorizationService: AuthorizationService
  ) { }






  @Selector()
  static permissions(state: AuthorizationStateModel): PermissionsListModel {
    return state.permissions;
  }

  @Selector() 
  static updatableRoles(state: AuthorizationStateModel): string[] {
    return state.systemRoles.updatableRoles
  }

  @Selector() 
  static nonUpdatableRoles(state: AuthorizationStateModel): string[] {
    return state.systemRoles.nonUpdatableRoles
  }

  @Selector() static allRoles(state: AuthorizationStateModel): string[] { return state?.systemRoles?.allRoles}

  @Selector() static isEmployee(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.Employee)
  }

  @Selector() static isManager(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.Manager)
  }

  @Selector() static isPayroll(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.Payroll)
  }

  @Selector() static isPayrollManager(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.PayrollManager)
  }

  @Selector() static isITSupport(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.ITSupport)
  }

  @Selector() static isCEO(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.CEO)
  }

  @Selector() static isLD(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.LD)
  }
  @Selector() static isFinance(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.Finance)
  }

  @Selector() static isHR(state:AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.HR)
  }

  @Selector() static isHRManager(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.HRManager)
  }

  @Selector() static isPL(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.PL)
  }

  @Selector() static isBusinessPartner(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.BusinessPartner)
  }

  @Selector() static isITHelpDesk(state: AuthorizationStateModel): boolean {
    return state.grantedRoles.includes(SystemRoles.IT_HELP_DESK)
  }

  // Installing an dummy permissions list for avoiding accessing from undefined exception
  ngxsOnInit(ctx: StateContext<AuthorizationStateModel>) {
    ctx.dispatch(new InstallPermissions(ctx.getState().grantedRoles));
    // ctx.dispatch(new LoadSystemRoles)
  }
  
  @Action(InstallPermissions)
  public installPermissions(ctx: StateContext<AuthorizationStateModel>, {roles}: InstallPermissions) {
    ctx.patchState({
      permissions: {...this._authorizationService.setUserPermissions(SystemPermissions, roles)}
    });
  }

  @Action(LoadSystemRoles)
  public loadSystemRoles({patchState}: StateContext<AuthorizationStateModel>) {
    return this._authorizationService.loadSystemRoles().pipe(
      tap((systemRoles: SystemRolesModel) => patchState({systemRoles}))
    )
  }

  @Action(SetGrantedRoles)
  public setGrantedRoles({patchState, dispatch}: StateContext<AuthorizationStateModel>, {roles}: SetGrantedRoles) {
    patchState({grantedRoles: roles})
    dispatch(new InstallPermissions(roles))
  }
}
