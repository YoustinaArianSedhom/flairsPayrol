import { PaginationModel } from '@core/http/apis.model';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, filter } from 'rxjs/operators';
import * as HR_DATA_ACTIONS from './hr-data.actions'
import * as HR_MODELS from '../models/hr-data.models';
import { Injectable } from '@angular/core';
import { HrDataService } from '../models/hr-data.service';
import { downloadFile } from '../../../shared/helpers/download-file.helper';

export class HRDataStateModel {
   public HRProfilesData: HR_MODELS.HRDataModel[];
   public query: string;
   public pagination: PaginationConfigModel;
   public filter: HR_MODELS.HRDataFilterModel;
   public allProfileStatuses: HR_MODELS.StatusModel[];
   public departments: HR_MODELS.DepartmentModel[];
   public managers: HR_MODELS.ManagerModel[];

   constructor() {
      this.HRProfilesData = null;
      this.query = '';
      this.pagination = {
         pageNumber: 0,
         pageSize: 10
      }
      this.filter = {
         query: '',
         managersIds: null,
         departmentsCodes: null,
         statuses: [1]
      }
      this.allProfileStatuses = [];
      this.departments = [];
      this.managers = [];
   }

}

@Injectable()
@State<HRDataStateModel>({
   name: 'HRData',
   defaults: new HRDataStateModel(),
})
export class HRDataState {
   constructor(private _mainService: HrDataService) { }

   @Selector() static HRProfilesData(state: HRDataStateModel): HR_MODELS.HRDataModel[] { return state.HRProfilesData }

   @Selector() static pagination(state: HRDataStateModel): PaginationConfigModel {
      return state.pagination;
   }
   @Selector() static allProfileStatuses(state: HRDataStateModel): HR_MODELS.StatusModel[] { return state.allProfileStatuses }
   @Selector() static filter(state: HRDataStateModel): HR_MODELS.HRDataFilterModel { return state.filter };
   @Selector() static query(state: HRDataStateModel): string { return state.filter.query; }
   @Selector() static departments(state: HRDataStateModel): HR_MODELS.DepartmentModel[] { return state.departments }
   @Selector() static managers(state: HRDataStateModel): HR_MODELS.ManagerModel[] { return state.managers }

   @Action(HR_DATA_ACTIONS.GetProfilesHRData)
   public GetProfilesHRData({ getState, patchState }: StateContext<HRDataStateModel>) {
      const { pagination: { pageNumber, pageSize }, filter } = getState();
      return this._mainService.getProfilesHRData({ pageNumber, pageSize }, filter).pipe(
         tap(
            ({ records: HRProfilesData, recordsTotalCount, totalPages }: PaginationModel<HR_MODELS.HRDataModel>) => {
               patchState({
                  HRProfilesData,
                  pagination: {
                     ...getState().pagination,
                     totalPages,
                     recordsTotalCount
                  }
               })
            }
         )
      )
   }

   @Action(HR_DATA_ACTIONS.FilterHRDataProfiles)
   public FilterHRDataProfiles({ getState, patchState, dispatch }: StateContext<HRDataStateModel>, { filtration }: HR_DATA_ACTIONS.FilterHRDataProfiles) {
      patchState({
         filter: {
            ...getState().filter,
            ...filtration
         },
         pagination: {
            ...getState().pagination,
            pageNumber: 0,
            pageSize: 10
         }
      })
      dispatch(new HR_DATA_ACTIONS.GetProfilesHRData())
   }

   @Action(HR_DATA_ACTIONS.ClearFilterHRDataProfiles)
   public ClearFilterHRDataProfiles({ patchState, dispatch }: StateContext<HRDataStateModel>) {
      patchState({
         filter:{
            query: '',
            managersIds: null,
            departmentsCodes: null,
            statuses: [1]
         },
         pagination: {
            pageNumber: 0,
            pageSize: 10
         }
      })
      dispatch(new HR_DATA_ACTIONS.GetProfilesHRData())
   }

   @Action(HR_DATA_ACTIONS.PaginateProfilesHRData)
   public PaginateProfilesHRData({ dispatch, patchState }: StateContext<HRDataStateModel>, { pagination }: HR_DATA_ACTIONS.PaginateProfilesHRData) {
      patchState({ pagination });
      dispatch(new HR_DATA_ACTIONS.GetProfilesHRData())
   }

   @Action(HR_DATA_ACTIONS.GetAllProfileStatuses)
   public GetAllProfileStatuses({ patchState }: StateContext<HRDataStateModel>) {
      return this._mainService.getAllProfileStatuses().pipe(
         tap((allProfileStatuses: HR_MODELS.StatusModel[]) => patchState({ allProfileStatuses }))
      )
   }

   @Action(HR_DATA_ACTIONS.FindDepartments)
   public FindDepartments({ patchState }: StateContext<HRDataStateModel>) {
      return this._mainService.findDepartments().pipe(
         tap((departments: HR_MODELS.DepartmentModel[]) => patchState({ departments: departments.map(item=> ({...item, id: item.code})) }))
      )
   }

   @Action(HR_DATA_ACTIONS.FindManagers)
   public FindManagers({ patchState }: StateContext<HRDataStateModel>){
      return this._mainService.findManagers().pipe(
         tap((managers: HR_MODELS.ManagerModel[]) => patchState({ managers }))
      )
   }

   @Action(HR_DATA_ACTIONS.ExportProfilesHRDataToExcel)
   public ExportProfilesHRDataToExcel({ getState }: StateContext<HRDataStateModel>) {
      const { filter } = getState();
      return this._mainService.exportProfilesHRDataToExcel(filter).pipe(
         tap((res: Blob) => {
            downloadFile(res, 'Hr-Data', res.type)
         })
      )
   }

}
