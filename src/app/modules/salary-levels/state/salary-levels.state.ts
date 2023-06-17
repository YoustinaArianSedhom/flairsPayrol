import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { insertItem, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { tap } from 'rxjs/operators';
import { SalaryLevelModel } from '../model/salaries-level.model';
import { SalariesLevelService } from '../model/salaries-level.service';
import { AddSalaryLevel, GetSalaryLevels, PaginateSalaryLevels, RemoveSalaryLevel, SearchSalaryLevels, SortSalaryLevels, UpdateSalaryLevel } from './salary-levels.actions';

export class SalaryLevelsStateModel {
  public records!: SalaryLevelModel[];
  public filters!: {};
  public pagination!: PaginationConfigModel;
  public searchQuery: string;
  public sort: {
    sortField: number;
    sortType: number;
  }
}

@State<SalaryLevelsStateModel>({
  name: 'salaryLevels',
  defaults: {
    records: [],
    filters: {},
    pagination: {
      totalPages: 0,
      recordsTotalCount: 0,
      // hidePageSize: true
    },
    searchQuery: '',
    sort: {
      sortField: 1,
      sortType: 1
    }
  }
})
@Injectable()
export class SalaryLevelsState {

  constructor(
    private _SalariesLevelService: SalariesLevelService
  ) { }

  @Selector()
  static records(state: SalaryLevelsStateModel): SalaryLevelModel[] {
    return state.records;
  }
  @Selector()
  static searchQuery(state: SalaryLevelsStateModel): string {
    return state.searchQuery;
  }

  @Selector()
  static pagination(state: SalaryLevelsStateModel): PaginationConfigModel {
    return {...state.pagination};
  }

  @Action(GetSalaryLevels)
  public getSalaries({ getState, patchState }: StateContext<SalaryLevelsStateModel>) {
    const {pagination, searchQuery, sort} = getState()
    return this._SalariesLevelService.get(
      {pageNumber: pagination.pageNumber, pageSize: pagination.pageSize},
      {searchQuery, ...sort} ).pipe(
      tap(({records, pageSize, pageNumber, recordsTotalCount, totalPages}: PaginationModel<SalaryLevelModel>) => {
        patchState({ 
          records,
          pagination: {...getState().pagination, pageSize, pageNumber, recordsTotalCount, totalPages }
        });
      })
    )
  }


  @Action(SearchSalaryLevels)
  public searchSalaryLevels({patchState, getState, dispatch}: StateContext<SalaryLevelsStateModel>, {term}: SearchSalaryLevels) {
    patchState({
      searchQuery: term,
      pagination: {...getState().pagination, pageNumber: 0}
    })

    dispatch(new GetSalaryLevels())
  
  }


  @Action(PaginateSalaryLevels)
  public paginateSalaryLevels({getState, patchState, dispatch}: StateContext<SalaryLevelsStateModel>, {config}: PaginateSalaryLevels) {
    patchState({pagination: {...getState().pagination, ...config}})
    dispatch(new GetSalaryLevels())
  }


  @Action(SortSalaryLevels)
  public sorSalaryLevels({patchState, dispatch}: StateContext<SalaryLevelsStateModel>, {sort}: SortSalaryLevels) {
    patchState({
      sort
    })
    dispatch(new GetSalaryLevels())
  }
  


  @Action(AddSalaryLevel)
  public addSalary({ setState }: StateContext<SalaryLevelsStateModel>, { record }: AddSalaryLevel) {
    return this._SalariesLevelService.create(record).pipe(
      tap((returnedRecord: SalaryLevelModel) => setState(patch({ records: insertItem<SalaryLevelModel>(returnedRecord) }))))
  }

  @Action(UpdateSalaryLevel)
  public updateSalary({ setState }: StateContext<SalaryLevelsStateModel>, { record }: UpdateSalaryLevel) {
    return this._SalariesLevelService.update(record).pipe(
      tap((returnedRecord: SalaryLevelModel) => 
        setState(patch({records: updateItem<SalaryLevelModel>(salaryLevel => salaryLevel.id === returnedRecord.id, returnedRecord)}))
      )
    )
  }


  @Action(RemoveSalaryLevel)
  public removeSalary({ setState }: StateContext<SalaryLevelsStateModel>, { id }: RemoveSalaryLevel) {
    return this._SalariesLevelService.remove(id).pipe(
      tap(() => setState(patch({ records: removeItem<SalaryLevelModel>(salaryLevel => salaryLevel.id === id) })))
    )
  }



}
