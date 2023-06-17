import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { tap } from 'rxjs/operators';
import { SalariesService } from '../model/salaries.service';
import { EmployeeFilterModel, EmployeeSalaryDetailsModel } from '../model/salaries.interface';
import { FilterEmployeeSalarySummaries, FilterEmployeeSalarySummariesByEntityId, GetEmployeeSalarySummaries, PaginateEmployeesSalariesSummaries, ResetEmployeeSalarySummaries, SearchEmployeeSalarySummaries, SortEmployeeSalarySummaries } from './salaries.actions'


export class EmployeeSalaryDetailsStateModel {
  public employeeSalaryDetails: EmployeeSalaryDetailsModel[];
  public filters!: EmployeeFilterModel;
  public pagination!: PaginationConfigModel;
  public searchQuery: string;
  public sort: {
    sortField: number;
    sortType: number;
  }

}

@Injectable()
@State<EmployeeSalaryDetailsStateModel>({
  name: 'EmployeeSalaryDetails',
  defaults: {
    employeeSalaryDetails: [],
    filters: {
      entityId: 1,
    },
    pagination: {
      totalPages: 0,
      recordsTotalCount: 0
    },
    searchQuery: '',
    sort: {
      sortField: 1,
      sortType: 1
    }
  }
})
export class EmployeeSalaryDetailsState {


  constructor(
    private _salariesService: SalariesService
  ) { }


  @Selector()
  static employeeSalaryDetails(state: EmployeeSalaryDetailsStateModel): EmployeeSalaryDetailsModel[] {
    return state.employeeSalaryDetails;
  }
  @Selector()
  static searchQuery(state: EmployeeSalaryDetailsStateModel): string {
    return state.searchQuery;
  }
  @Selector()
  static filters(state: EmployeeSalaryDetailsStateModel): EmployeeFilterModel {
    return state.filters;
  }
  @Selector() static pagination(state: EmployeeSalaryDetailsStateModel): PaginationConfigModel {
    return state.pagination
  }


  @Action(GetEmployeeSalarySummaries)
  public getEmployeeSalarySummaries(ctx: StateContext<EmployeeSalaryDetailsStateModel>) {
    const { pagination, searchQuery, sort, filters } = ctx.getState()
    return this._salariesService.getEmployeeSalarySummaries(
      { pageNumber: pagination.pageNumber, pageSize: pagination.pageSize },
      { searchQuery, ...sort, ...filters }).pipe(
        tap(({ records, pageNumber, pageSize, totalPages, recordsTotalCount }: PaginationModel<EmployeeSalaryDetailsModel>) => ctx.patchState({
          employeeSalaryDetails: [...records],
          pagination: {recordsTotalCount, pageNumber, pageSize, totalPages}
        }))
      )
  }

  @Action(SearchEmployeeSalarySummaries)
  public searchSalaryLevels(ctx: StateContext<EmployeeSalaryDetailsStateModel>, { term }: SearchEmployeeSalarySummaries) {
    ctx.patchState({
      searchQuery: term,
      pagination: { ...ctx.getState().pagination, pageNumber: 0 }

    })
    ctx.dispatch(new GetEmployeeSalarySummaries())
  }

  @Action(ResetEmployeeSalarySummaries)
  public resetEmployeeSalarySummaries(ctx: StateContext<EmployeeSalaryDetailsStateModel>) {
    ctx.patchState({
      searchQuery: null,
      filters: {
        entityId: 1,
      },
      pagination: { ...ctx.getState().pagination, pageNumber: 0 }

    })
    ctx.dispatch(new GetEmployeeSalarySummaries())
  }

  @Action(SortEmployeeSalarySummaries)
  public sortEmployeeSalarySummaries(ctx: StateContext<EmployeeSalaryDetailsStateModel>, { sort }: SortEmployeeSalarySummaries) {
    ctx.patchState({
      sort
    })
    ctx.dispatch(new GetEmployeeSalarySummaries())
  }
  @Action(FilterEmployeeSalarySummariesByEntityId)
  public filterEmployeeSalarySummaries(
    ctx: StateContext<EmployeeSalaryDetailsStateModel>,
    { filters }: FilterEmployeeSalarySummariesByEntityId) {
    ctx.patchState({
      filters, pagination: { ...ctx.getState().pagination, pageNumber: 0 }
    })
    ctx.dispatch(new GetEmployeeSalarySummaries())
  }

  @Action(FilterEmployeeSalarySummaries)
  public FilterEmployeeSalarySummaries(
    ctx: StateContext<EmployeeSalaryDetailsStateModel>,
    { filters }: FilterEmployeeSalarySummaries) {
    ctx.patchState({
      filters:{...ctx.getState().filters,...filters}, pagination: { ...ctx.getState().pagination, pageNumber: 0 }
    })
    ctx.dispatch(new GetEmployeeSalarySummaries())
  }


  @Action(PaginateEmployeesSalariesSummaries)
  public paginateEmployeesSalariesSummaries(ctx: StateContext<EmployeeSalaryDetailsStateModel>, {pagination}: PaginateEmployeesSalariesSummaries) {
    ctx.patchState({pagination}),
    ctx.dispatch(GetEmployeeSalarySummaries)
  }



}

