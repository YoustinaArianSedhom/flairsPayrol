import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { tap } from 'rxjs/operators';
import { EmployeeModel, FiltrationModel } from '../model/employees.model';
import { EmployeesService } from '../model/employees.service';
import { EmployeeProfileState } from '../modules/employee-profile/state/employee-profile.state';
import { EmployeeBankDetailsModel } from '../modules/employee-salary/model/salary-details.model';
import { EmployeesSyncState } from '../modules/employees-sync/state/employees-sync.state';
import * as employeesActions from './employees.actions';

export class EmployeesStateModel {


  // As interface
  public records!: EmployeeModel[];
  public filters!: FiltrationModel
  public pagination!: PaginationConfigModel;
  public sort: {
    sortField: number;
    sortType: number;
  }

  public employeeProfile: {
    bankDetails: EmployeeBankDetailsModel;
    employee: EmployeeModel
  }

  // As Defaults
  constructor() {
    this.records = [],
      this.filters = {
        statuses: [0, 1],
        roles: [],
        searchQuery: ''
      },
      this.pagination = {
        totalPages: 0,
        recordsTotalCount: 0
      },
      this.sort = {
        sortField: 1,
        sortType: 1
      }
  }
}

@Injectable()
@State<EmployeesStateModel>({
  name: 'employees',
  defaults: new EmployeesStateModel(),
  children: [EmployeesSyncState, EmployeeProfileState]
})
export class EmployeesState {

  constructor(
    private _employeesService: EmployeesService
  ) { }



  @Selector()
  static records(state: EmployeesStateModel): EmployeeModel[] {
    return state.records;
  }
  @Selector()
  static searchQuery(state: EmployeesStateModel): string {
    return state?.filters?.searchQuery;
  }

  @Selector()
  static pagination(state: EmployeesStateModel): PaginationConfigModel {
    return { ...state.pagination };

  }
  @Selector()
  static filters(state: EmployeesStateModel): number[] {
    const x = [...state.filters.statuses]
    return x;
  }
  @Selector() static filtration(state: EmployeesStateModel): FiltrationModel { return state.filters}



  @Action(employeesActions.GetEmployees)
  public getEmployees({ patchState, getState }: StateContext<EmployeesStateModel>) {
    const { pagination, filters } = getState()
    return this._employeesService.get(
      { pageNumber: pagination.pageNumber, pageSize: pagination.pageSize },
      {  ...filters }).pipe(
        tap(({ records, pageSize, pageNumber, recordsTotalCount, totalPages }: PaginationModel<EmployeeModel>) => {
          patchState({
            records,
            pagination: { ...getState().pagination, pageSize, pageNumber, recordsTotalCount, totalPages }
          });
        })
      )
  }

  @Action(employeesActions.SearchEmployees)
  public searchEmployees({ patchState, dispatch, getState }: StateContext<EmployeesStateModel>, { term }: employeesActions.SearchEmployees) {
    patchState({
      filters: {
        ...getState().filters,
        searchQuery: term
      },
      pagination: { ...getState().pagination, pageNumber: 0 }
    })

    dispatch(new employeesActions.GetEmployees())

  }

  @Action(employeesActions.ResetFilterEmployees)
  public ResetFilterEmployees({ patchState, dispatch, getState }: StateContext<EmployeesStateModel>) {
    patchState({
      filters: {
        statuses: [0, 1],
        searchQuery: '',
        roles: []
      },
      pagination: { ...getState().pagination, pageNumber: 0 }
    })

    dispatch(new employeesActions.GetEmployees())

  }


  @Action(employeesActions.PaginateEmployees)
  public paginateEmployees({ getState, patchState, dispatch }: StateContext<EmployeesStateModel>, { config }: employeesActions.PaginateEmployees) {
    patchState({ pagination: { ...getState().pagination, ...config } })
    dispatch(new employeesActions.GetEmployees())
  }




  @Action(employeesActions.FilterEmployees)
  public filterEmployees({ patchState, getState, dispatch }: StateContext<EmployeesStateModel>, { filtration }: employeesActions.FilterEmployees) {
    patchState({
      filters: { ...getState().filters, ...filtration },
      pagination: { ...getState().pagination, pageNumber: 0 }
    })

    dispatch(new employeesActions.GetEmployees())
  }


  @Action(employeesActions.SubmitEmployee)
  public submitEmployee({ setState }: StateContext<EmployeesStateModel>, { id }: employeesActions.SubmitEmployee) {
    return this._employeesService.submit(id).pipe(
      tap((employee: EmployeeModel) => {
        setState(patch({
          records: updateItem<EmployeeModel>(employee => employee.id === id, employee),
        }))
      })
    )
  }


  @Action(employeesActions.ArchiveEmployee)
  public archiveEmployee({ setState }: StateContext<EmployeesStateModel>, { id }: employeesActions.ArchiveEmployee) {
    return this._employeesService.archive(id).pipe(
      tap((employee: EmployeeModel) => {
        setState(patch({
          records: updateItem<EmployeeModel>(employee => employee.id === id, employee),
        }))
      })
    )
  }

  @Action(employeesActions.UpdateEmployeeRoles)
  public updateEmployeeRoles({ setState, patchState, getState }: StateContext<EmployeesStateModel>, { body, from }: employeesActions.UpdateEmployeeRoles) {
    return this._employeesService.updateEmployeeRoles(body).pipe(
      tap((employee: EmployeeModel) => {
        if (from === 'outside') {
          setState(patch({
            records: updateItem<EmployeeModel>(employee => employee.id === body.profileId, employee)
          }))
        }
        else if (from === 'inside') {
          patchState({
            employeeProfile: {
              ...getState().employeeProfile,
              employee,
              bankDetails: { bankAccountName: employee.bankAccountName, bankAccountNumber: employee.bankAccountNumber, bankName: employee.bankName }
            }
          })
        }
      })
    )
  }
}
