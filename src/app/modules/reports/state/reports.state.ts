import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import * as REPORTS_MODELS from '@modules/reports/models/reports.model';
import * as REPORTS_ACTIONS from '@modules/reports/state/reports.actions'
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { OrgConfigInst } from '@core/config/organization.config';
import { ReportsService } from '../models/reports.service';
import { PaginationModel } from '@core/http/apis.model';
import { tap } from "rxjs/operators";
import { downloadFile } from '../../../shared/helpers/download-file.helper';



export class ReportsStateModel {
    public reports: REPORTS_MODELS.ReportModel[];
    public filtration: REPORTS_MODELS.ReportsFiltrationModel;
    public pagination: PaginationConfigModel;


    public managersList: REPORTS_MODELS.ManagerModel[];
    public publishedPayrolls: REPORTS_MODELS.PublishedPayrollModel[]

    constructor() {
        this.reports = [];
        this.filtration = {
            onlyDirects: false
        };
        this.pagination = {
            pageSize: OrgConfigInst.CRUD_CONFIG.paginationDefaults.size,
            pageNumber: OrgConfigInst.CRUD_CONFIG.paginationDefaults.startAt
        };
        this.managersList = []
        this.publishedPayrolls = []
    }
}



@Injectable()
@State<ReportsStateModel>({
    name: 'reports',
    defaults: new ReportsStateModel()
})


export class ReportsState {

    constructor(private _reportsService: ReportsService) { }


    @Selector() static reports(state: ReportsStateModel): REPORTS_MODELS.ReportModel[] {
        return state.reports
    }

    @Selector() static pagination(state: ReportsStateModel): PaginationConfigModel {
        return { ...state.pagination }
    }

    @Selector() static filtration(state: ReportsStateModel): REPORTS_MODELS.ReportsFiltrationModel {
        return state.filtration
    }


    @Selector() static managersList(state: ReportsStateModel): REPORTS_MODELS.ManagerModel[] {
        return state.managersList
    }

    @Selector() static publishedPayrolls(state: ReportsStateModel): REPORTS_MODELS.PublishedPayrollModel[] {
        return state.publishedPayrolls
    }



    @Action(REPORTS_ACTIONS.GetReports)
    public getReports({ getState, patchState }: StateContext<ReportsStateModel>) {
        const { pagination: { pageNumber, pageSize }, filtration } = getState();
        return this._reportsService.getReports({ pageNumber, pageSize }, { ...filtration }).pipe(
            tap(({ records, recordsTotalCount, pageNumber, pageSize, totalPages }) => patchState({
                reports: records,
                pagination: { recordsTotalCount, pageNumber, pageSize, totalPages }
            }))
        )
    }


    @Action(REPORTS_ACTIONS.PaginateReports)
    public paginateReports({ dispatch, patchState }: StateContext<ReportsStateModel>, { pagination }: REPORTS_ACTIONS.PaginateReports) {
        patchState({ pagination });

        dispatch(REPORTS_ACTIONS.GetReports);

    }




    @Action(REPORTS_ACTIONS.FilterReports)
    public filterReports({ patchState, getState, dispatch }: StateContext<ReportsStateModel>, { filtration }: REPORTS_ACTIONS.FilterReports) {
        const state = getState();
        patchState({
            filtration: { ...state.filtration, ...filtration },
            pagination: { ...state.pagination, pageNumber: 0 }
        })
        if (getState().filtration.managerId) { dispatch(REPORTS_ACTIONS.GetReports) }

    }

    @Action(REPORTS_ACTIONS.ResetFilterReports)
    public resetFilterReports({ patchState, getState, dispatch }: StateContext<ReportsStateModel>, { filtration }: REPORTS_ACTIONS.FilterReports) {
        const state = getState();
        patchState({
            filtration: { ...state.filtration, ...filtration },
            pagination: { ...state.pagination, pageNumber: 0 },
            reports: []
        })
        //  dispatch(REPORTS_ACTIONS.GetReports) 

    }



    @Action(REPORTS_ACTIONS.GetManagersList)
    public getManagersList({ patchState }: StateContext<ReportsStateModel>, { query }: REPORTS_ACTIONS.GetManagersList) {
        return this._reportsService.searchManagers(query).pipe(
            tap(
                (managersList) => patchState({ managersList })
            )
        )
    }



    @Action(REPORTS_ACTIONS.GetPublishedPayrolls)
    public getPublishedPayrolls({ patchState }: StateContext<ReportsStateModel>, { entityId }: REPORTS_ACTIONS.GetPublishedPayrolls) {
        return this._reportsService.getPublishedPayroll(entityId).pipe(
            tap(
                (publishedPayrolls) => patchState({ publishedPayrolls })
            )
        )
    }

    @Action(REPORTS_ACTIONS.GetExpensesReportAsExcel)
    public GetExpensesReportAsExcel(ctx: StateContext<ReportsStateModel>, { managerName }: REPORTS_ACTIONS.GetExpensesReportAsExcel){
        const filtration = ctx.getState().filtration;
        return this._reportsService.getExpensesReportAsExcel(filtration).pipe(
            tap((res:Blob)=>{console.log(res); downloadFile(res,`${managerName}'s Report.xlsx`, res.type)})
        )
    }

}
