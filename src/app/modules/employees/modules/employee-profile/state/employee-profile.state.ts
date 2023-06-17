import { Injectable } from '@angular/core';
import { EmployeeModel } from '@modules/employees/model/employees.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { tap } from 'rxjs/operators';
import { SalaryDetailsState } from '../../employee-salary/state/salary-details.state';
import { EmployeeProfileService } from '../model/employee-profile.service';
import * as EMPLOYEE_PROFILE_ACTIONS from './employee-profile.actions';
import * as EMPLOYEE_PROFILE_MODELS from '@modules/employees/modules/employee-profile/model/employee-profile.model'
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { PaginationModel } from '@core/http/apis.model';
import { OrgConfigInst } from '@core/config/organization.config';

export class EmployeeProfileStateModel {
  public employee: EmployeeModel
  public employeeWorkflows: EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowsModel[]
  public pagination: PaginationConfigModel
  public employeeWorkflowDetails: EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowDetailsModel[]

  constructor() {
    this.employee = null
    this.employeeWorkflows = [];
    this.pagination = {
      pageNumber: OrgConfigInst.CRUD_CONFIG.paginationDefaults.startAt,
      pageSize: OrgConfigInst.CRUD_CONFIG.paginationDefaults.size,
    };
    this.employeeWorkflowDetails = [];

  }

}

@Injectable()
@State<EmployeeProfileStateModel>({
  name: 'employeeProfile',
  children: [SalaryDetailsState],
  defaults: new EmployeeProfileStateModel()
})
export class EmployeeProfileState {

  constructor(
    private _employeeProfileService: EmployeeProfileService
  ) { }

  @Selector()
  static employee(state: EmployeeProfileStateModel): EmployeeModel {
    return state.employee;
  }
  @Selector()
  static employeeWorkflows(state: EmployeeProfileStateModel): EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowsModel[] {
    return state.employeeWorkflows;
  }
  @Selector()
  static pagination(state: EmployeeProfileStateModel): PaginationConfigModel {
    return { ...state.pagination };
  }
  @Selector()
  static employeeWorkflowDetails(state: EmployeeProfileStateModel): EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowDetailsModel[] {
    return state.employeeWorkflowDetails;
  }



  @Action(EMPLOYEE_PROFILE_ACTIONS.GetEmployeeDetails)
  public getEmployeeDetails({ patchState }: StateContext<EmployeeProfileStateModel>, { id }: EMPLOYEE_PROFILE_ACTIONS.GetEmployeeDetails) {
    return this._employeeProfileService.getEmployeeDetails(id).pipe(
      tap((employee: EmployeeModel) => patchState({

        employee
      }))
    )
  }


  @Action(EMPLOYEE_PROFILE_ACTIONS.ClearEmployeeDetails)
  public clearEmployeeDetails(ctx: StateContext<EmployeeProfileStateModel>) {
    ctx.patchState({ employee: null, pagination: { pageNumber: 0, pageSize: 10 } })
  }


  @Action(EMPLOYEE_PROFILE_ACTIONS.GetEmployeeWorkflows)
  public getEmployeeProfileWorkflows({ getState, patchState }: StateContext<EmployeeProfileStateModel>, { memberOrganizationEmail }: EMPLOYEE_PROFILE_ACTIONS.GetEmployeeWorkflows) {
    const { pagination: { pageNumber, pageSize } } = getState()
    return this._employeeProfileService.getEmployeeWorkflows({ pageNumber, pageSize }, memberOrganizationEmail).pipe(
      tap(
        ({ records, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowsModel>) => {
          patchState({
            employeeWorkflows: records,
            pagination: { pageSize, pageNumber, totalPages, recordsTotalCount }
          })
        }
      )
    )
  }

  @Action(EMPLOYEE_PROFILE_ACTIONS.PaginateEmployeeWorkflows)
  public paginateEmployeeWorkflows({ patchState, dispatch }: StateContext<EmployeeProfileStateModel>, { pagination, memberOrganizationEmail }: EMPLOYEE_PROFILE_ACTIONS.PaginateEmployeeWorkflows) {
    patchState({ pagination })
    dispatch(new EMPLOYEE_PROFILE_ACTIONS.GetEmployeeWorkflows(memberOrganizationEmail))
  }


  @Action(EMPLOYEE_PROFILE_ACTIONS.GetEmployeeWorkflowDetails)
  public getEmployeeWorkflowDetails({ patchState }: StateContext<EmployeeProfileStateModel>, { id }: EMPLOYEE_PROFILE_ACTIONS.GetEmployeeWorkflowDetails) {
    return this._employeeProfileService.getEmployeeWorkflowDetails(id).pipe(
      tap(
        (employeeWorkflowDetails: EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowDetailsModel[]) => patchState({ employeeWorkflowDetails })
      )
    )
  }
}
