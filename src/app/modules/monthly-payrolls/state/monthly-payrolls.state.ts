import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { downloadFile } from '@shared/helpers/download-file.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { tap } from 'rxjs/operators';
import { MonthlyPayrollsService } from '../model/monthly-payrolls.service';
import * as monthlyPayrollsActions from './monthly-payrolls.actions';
import * as MONTHLY_PAYROLL_MODEL from '@modules/monthly-payrolls/model/monthly-payrolls.model'

export class MonthlyPayrollsStateModel {
  // As interface
  public records!: MONTHLY_PAYROLL_MODEL.MonthlyPayrollModel[];
  public filtration!: MONTHLY_PAYROLL_MODEL.MonthlyPayrollsFiltrationModel;
  public pagination!: PaginationConfigModel;
  public detailsSearchQuery: string;
  public insuranceStatusFilter: number;
  public transferDateFilter:string;
  public payrollSummary!: MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel;
  public payrollSalariesSummary!: MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel;
  public payrollDetails: MONTHLY_PAYROLL_MODEL.MonthlyPayrollDetailsModel[];
  public payrollDetailsPagination: PaginationConfigModel;
  public appliedTransferMessage: string;
  public monthlyPayrollTransferDates: MONTHLY_PAYROLL_MODEL.MonthlyPayrollTransferDateModel[];
  public suspensionStatusFilter: boolean;
  public countOfProfileShouldApplied: number;
  public countOfProfileShouldRemovedFromApplied: number;
  public profileShouldApplied: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel[];
  public profileShouldRemovedFromApplied: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel[];
  public profileShouldAppliedPagination: PaginationConfigModel;
  public profileShouldRemovedFromAppliedPagination: PaginationConfigModel;
  
  // As Defaults
  constructor() {
    this.appliedTransferMessage = null
    this.records = [];
    this.payrollSummary = null;
    this.payrollDetails = [];
    this.transferDateFilter = 'all';
    this.filtration = {
      statuses: [0, 1, 2],
      searchQuery: '',
      entityId: null,
    };
    this.detailsSearchQuery = null;
    this.insuranceStatusFilter = null;
    this.pagination = {
      totalPages: 0,
      recordsTotalCount: 0
    };
    this.payrollDetailsPagination = {
      totalPages: 0,
      recordsTotalCount: 0
    }
    this.monthlyPayrollTransferDates = null;
    this.payrollSalariesSummary = null;
    this.suspensionStatusFilter = null;
    this.countOfProfileShouldApplied = null;
    this.countOfProfileShouldRemovedFromApplied = null;
    this.profileShouldApplied = null
    this.profileShouldRemovedFromApplied = null
    this.profileShouldAppliedPagination = {
      pageNumber:0,
      pageSize:10
    }
    this.profileShouldRemovedFromAppliedPagination = {
      pageNumber:0,
      pageSize:10
    }
  }
}

@Injectable()
@State<MonthlyPayrollsStateModel>({
  name: 'monthlyPayrolls',
  defaults: new MonthlyPayrollsStateModel()
})
export class MonthlyPayrollsState {

  constructor(private _monthlyPayrollService: MonthlyPayrollsService) { }


  @Selector()
  static records(state: MonthlyPayrollsStateModel): MONTHLY_PAYROLL_MODEL.MonthlyPayrollModel[] {
    return state.records;
  }
  @Selector()
  static searchQuery(state: MonthlyPayrollsStateModel): string {
    return state.filtration.searchQuery;
  }

  @Selector()
  static pagination(state: MonthlyPayrollsStateModel): PaginationConfigModel {
    return { ...state.pagination };

  }
  @Selector()
  static statuses(state: MonthlyPayrollsStateModel): number[] {
    return [...state.filtration.statuses]
  }

  @Selector()
  static filtration(state: MonthlyPayrollsStateModel): MONTHLY_PAYROLL_MODEL.MonthlyPayrollsFiltrationModel {
    return { ...state.filtration }
  }

  @Selector()
  static payrollSummary(state: MonthlyPayrollsStateModel): MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel {
    return state.payrollSummary;
  }

  @Selector()
  static payrollDetails(state: MonthlyPayrollsStateModel): MONTHLY_PAYROLL_MODEL.MonthlyPayrollDetailsModel[] {
    return state.payrollDetails;
  }

  @Selector()
  static payrollDetailsPagination(state: MonthlyPayrollsStateModel): PaginationConfigModel {
    return { ...state.payrollDetailsPagination };

  }

  @Selector() static detailsSearchQuery(state: MonthlyPayrollsStateModel): string {
    return state.detailsSearchQuery;
  }

  @Selector()
  static transferredPayroll(state: MonthlyPayrollsStateModel): string {
    return state.appliedTransferMessage;
  }

  @Selector() static monthlyPayrollTransferDates(state: MonthlyPayrollsStateModel): MONTHLY_PAYROLL_MODEL.MonthlyPayrollTransferDateModel[] { return state.monthlyPayrollTransferDates }

  @Selector() static payrollSalariesSummary(state: MonthlyPayrollsStateModel): MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel {return state.payrollSalariesSummary}
  @Selector() static countOfProfileShouldApplied(state: MonthlyPayrollsStateModel): number {return state.countOfProfileShouldApplied}
  @Selector() static countOfProfileShouldRemovedFromApplied(state: MonthlyPayrollsStateModel): number {return state.countOfProfileShouldRemovedFromApplied}

  @Selector() static profileShouldApplied(state: MonthlyPayrollsStateModel): MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel[] {
    return state.profileShouldApplied
  }

  @Selector() static profileShouldRemovedFromApplied(state: MonthlyPayrollsStateModel): MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel[] {
    return state.profileShouldRemovedFromApplied
  }

  @Selector() static profileShouldAppliedPagination(state: MonthlyPayrollsStateModel): PaginationConfigModel {
    return state.profileShouldAppliedPagination;
  }

  @Selector() static profileShouldRemovedFromAppliedPagination(state: MonthlyPayrollsStateModel): PaginationConfigModel {
    return state.profileShouldRemovedFromAppliedPagination;
  }

  @Action(monthlyPayrollsActions.GetMonthlyPayrolls)
  public getMonthlyPayrolls({ patchState, getState }: StateContext<MonthlyPayrollsStateModel>) {
    const { pagination, filtration } = getState()
    return this._monthlyPayrollService.getAllPayrolls(
      filtration,
      { pageNumber: pagination.pageNumber, pageSize: pagination.pageSize }).pipe(
        tap(({ records, pageSize, pageNumber, recordsTotalCount, totalPages }: PaginationModel<MONTHLY_PAYROLL_MODEL.MonthlyPayrollModel>) => {
          patchState({
            records,
            pagination: { ...getState().pagination, pageSize, pageNumber, recordsTotalCount, totalPages }
          });
        })
      )
  }

  @Action(monthlyPayrollsActions.SearchMonthlyPayrolls)
  public searchMonthlyPayrolls({ patchState, dispatch, getState }: StateContext<MonthlyPayrollsStateModel>, { term }: monthlyPayrollsActions.SearchMonthlyPayrolls) {
    patchState({
      filtration: { ...getState().filtration, searchQuery: term },
      pagination: { ...getState().pagination, pageNumber: 0 }
    })

    dispatch(new monthlyPayrollsActions.GetMonthlyPayrolls())

  }


  @Action(monthlyPayrollsActions.PaginateMonthlyPayrolls)
  public paginateMonthlyPayrolls({ getState, patchState, dispatch }: StateContext<MonthlyPayrollsStateModel>, { config }: monthlyPayrollsActions.PaginateMonthlyPayrolls) {
    patchState({ pagination: { ...getState().pagination, ...config } })
    dispatch(new monthlyPayrollsActions.GetMonthlyPayrolls())
  }




  @Action(monthlyPayrollsActions.FilterMonthlyPayrolls)
  public filterMonthlyPayrolls({ patchState, getState, dispatch }: StateContext<MonthlyPayrollsStateModel>, { filtration }: monthlyPayrollsActions.FilterMonthlyPayrolls) {
    patchState({
      filtration: { ...getState().filtration, ...filtration },
      pagination: { ...getState().pagination, pageNumber: 0 }
    })

    dispatch(new monthlyPayrollsActions.GetMonthlyPayrolls())
  }


  @Action(monthlyPayrollsActions.CreateMonthlyPayroll)
  public createMonthlyPayroll({ dispatch }: StateContext<MonthlyPayrollsStateModel>, { body }: monthlyPayrollsActions.CreateMonthlyPayroll) {
    return this._monthlyPayrollService.createPayroll(body).pipe(
      tap(() => dispatch(new monthlyPayrollsActions.GetMonthlyPayrolls()))
    )
  }



  @Action(monthlyPayrollsActions.GetMonthlyPayrollSummary)
  public getMonthlyPayrollSummary({ patchState }: StateContext<MonthlyPayrollsStateModel>, { payrollId }: monthlyPayrollsActions.GetMonthlyPayrollSummary) {
    return this._monthlyPayrollService.getMonthlyPayrollSummary(payrollId).pipe(
      tap((payrollSummary: MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel) => patchState({ payrollSummary }))
    )
  }

  @Action(monthlyPayrollsActions.GetPayrollSalariesSummary)
  public GetPayrollSalariesSummary({ patchState }: StateContext<MonthlyPayrollsStateModel>, { payrollId }: monthlyPayrollsActions.GetPayrollSalariesSummary) {
    return this._monthlyPayrollService.getPayrollSalariesSummary(payrollId).pipe(
      tap((payrollSalariesSummary: MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel) => patchState({ payrollSalariesSummary }))
    )
  }

  @Action(monthlyPayrollsActions.GetMonthlyPayrollDetails)
  public getMonthlyPayrollDetails({ patchState, getState }: StateContext<MonthlyPayrollsStateModel>, { payrollId }: monthlyPayrollsActions.GetMonthlyPayrollSummary) {
    const { payrollDetailsPagination: { pageSize, pageNumber }, detailsSearchQuery: searchQuery, insuranceStatusFilter, transferDateFilter, suspensionStatusFilter } = getState();
    console.log('inther', getState().filtration)
    return this._monthlyPayrollService.getMonthlyPayrollDetails({ insuranceStatusFilter, payrollId, searchQuery, transferDateFilter, suspensionStatusFilter }, { pageNumber, pageSize }).pipe(
      tap(({ records: payrollDetails, pageSize, pageNumber, recordsTotalCount, totalPages }: PaginationModel<MONTHLY_PAYROLL_MODEL.MonthlyPayrollDetailsModel>) => patchState({
        payrollDetails,
        payrollDetailsPagination: { ...getState().pagination, pageSize, pageNumber, recordsTotalCount, totalPages }
      }))
    )
  }

  @Action(monthlyPayrollsActions.PaginateMonthlyPayrollDetails)
  public paginateMonthlyPayrollDetails({ patchState, getState, dispatch }: StateContext<MonthlyPayrollsStateModel>, { pagination }: monthlyPayrollsActions.PaginateMonthlyPayrollDetails) {
    patchState({
      payrollDetailsPagination: { ...getState().payrollDetailsPagination, ...pagination }
    })
    dispatch(new monthlyPayrollsActions.GetMonthlyPayrollDetails(getState().payrollSummary.id))
  }


  @Action(monthlyPayrollsActions.SearchMonthlyPayrollDetails)
  public searchMonthlyPayrollDetails({ patchState, dispatch, getState }: StateContext<MonthlyPayrollsStateModel>, { detailsSearchQuery }: monthlyPayrollsActions.SearchMonthlyPayrollDetails) {
    patchState({
      detailsSearchQuery,
      payrollDetailsPagination: { ...getState().payrollDetailsPagination, pageNumber: 0 }
    });
    dispatch(new monthlyPayrollsActions.GetMonthlyPayrollDetails(getState().payrollSummary.id));
  }

  @Action(monthlyPayrollsActions.FilterMonthlyPayrollDetails)
  public FilterMonthlyPayrollDetails({ patchState, dispatch, getState }: StateContext<MonthlyPayrollsStateModel>, { insuranceStatusFilter }: monthlyPayrollsActions.FilterMonthlyPayrollDetails) {
    patchState({
      insuranceStatusFilter,
      payrollDetailsPagination: { ...getState().payrollDetailsPagination, pageNumber: 0 }
    });
    dispatch(new monthlyPayrollsActions.GetMonthlyPayrollDetails(getState().payrollSummary.id));
  }

  @Action(monthlyPayrollsActions.FilterMonthlyPayrollWithTransferDate)
  public FilterMonthlyPayrollWithTransferDate({ patchState, dispatch, getState }: StateContext<MonthlyPayrollsStateModel>, { transferDateFilter }: monthlyPayrollsActions.FilterMonthlyPayrollWithTransferDate) {
    patchState({
      transferDateFilter,
      payrollDetailsPagination: { ...getState().payrollDetailsPagination, pageNumber: 0 }
    });
    dispatch(new monthlyPayrollsActions.GetMonthlyPayrollDetails(getState().payrollSummary.id));
  }

  @Action(monthlyPayrollsActions.FilterMonthlyPayrollWithSuspensionStatus)
  public FilterMonthlyPayrollWithSuspensionStatus({patchState, getState, dispatch}: StateContext<MonthlyPayrollsStateModel>, {suspensionStatusFilter}: monthlyPayrollsActions.FilterMonthlyPayrollWithSuspensionStatus) {
    patchState({
      suspensionStatusFilter,
      payrollDetailsPagination: {...getState().payrollDetailsPagination, pageNumber: 0 }
    });
    dispatch(new monthlyPayrollsActions.GetMonthlyPayrollDetails(getState().payrollSummary.id))
  }

  @Action(monthlyPayrollsActions.ResetFilterMonthlyPayrollDetails)
  public ResetFilterMonthlyPayrollDetails({ patchState, dispatch, getState }: StateContext<MonthlyPayrollsStateModel>) {
    patchState({
      detailsSearchQuery: null,
      insuranceStatusFilter: null,
      transferDateFilter:'All',
      suspensionStatusFilter:null,
      payrollDetailsPagination: { ...getState().payrollDetailsPagination, pageNumber: 0 }
    });
    dispatch(new monthlyPayrollsActions.GetMonthlyPayrollDetails(getState().payrollSummary.id));
  }


  @Action(monthlyPayrollsActions.DeleteMonthlyPayroll)
  public deleteMonthlyPayroll({ }: StateContext<MonthlyPayrollsStateModel>, { payrollId }: monthlyPayrollsActions.DeleteMonthlyPayroll) {
    return this._monthlyPayrollService.deleteMonthlyPayroll(payrollId)
  }

  @Action(monthlyPayrollsActions.OpenMonthlyPayroll)
  public openMonthlyPayroll({ patchState, getState }: StateContext<MonthlyPayrollsStateModel>, { payrollId }: monthlyPayrollsActions.OpenMonthlyPayroll) {
    return this._monthlyPayrollService.openMonthlyPayroll(payrollId).pipe(
      tap(({ status }) => patchState({ payrollSummary: { ...getState().payrollSummary, status, lastModifiedDate: new Date() } }))
    )
  }

  @Action(monthlyPayrollsActions.CloseMonthlyPayroll)
  public closeMonthlyPayroll({ patchState, getState }: StateContext<MonthlyPayrollsStateModel>, { payrollId }: monthlyPayrollsActions.CloseMonthlyPayroll) {
    return this._monthlyPayrollService.closeMonthlyPayroll(payrollId).pipe(
      tap(({ status }) => patchState({ payrollSummary: { ...getState().payrollSummary, status, lastModifiedDate: new Date() } }))
    )
  }

  @Action(monthlyPayrollsActions.PublishMonthlyPayroll)
  public publishMonthlyPayroll({ patchState, getState }: StateContext<MonthlyPayrollsStateModel>, { payrollId }: monthlyPayrollsActions.PublishMonthlyPayroll) {
    return this._monthlyPayrollService.publishMonthlyPayroll(payrollId).pipe(
      tap(({ status }) => patchState({ payrollSummary: { ...getState().payrollSummary, status, lastModifiedDate: new Date() } }))
    )
  }
  // for applying transfers
  @Action(monthlyPayrollsActions.TransferMonthlyPayroll)
  public applyPayrollTransfers({ patchState }: StateContext<MonthlyPayrollsStateModel>, { payrollId }: monthlyPayrollsActions.TransferMonthlyPayroll) {
    return this._monthlyPayrollService.applyPayrollTransfers(payrollId).pipe(
      tap((result: MONTHLY_PAYROLL_MODEL.TransferPayroll) => {
        patchState({ appliedTransferMessage: result.message })
      })
    )
  }

  @Action(monthlyPayrollsActions.GetPayrollTransferDates)
  public GetPayrollTransferDates( { patchState }: StateContext<MonthlyPayrollsStateModel>,{ payrollId }:monthlyPayrollsActions.GetPayrollTransferDates){
    return this._monthlyPayrollService.getPayrollTransferDates(payrollId).pipe(
      tap((monthlyPayrollTransferDates: MONTHLY_PAYROLL_MODEL.MonthlyPayrollTransferDateModel[])=> patchState({monthlyPayrollTransferDates}))
    )
  }

  @Action(monthlyPayrollsActions.ExportMonthlyPayroll)
  public exportMonthlyPayroll(ctx: StateContext<MonthlyPayrollsStateModel>, { config }: monthlyPayrollsActions.ExportMonthlyPayroll) {
    return this._monthlyPayrollService.exportMonthlyPayroll(config).pipe(
      tap((res: Blob) => {
        const nameAddition = config.exportType === 0 ? '-Salaries' : config.exportType === 3 ? '-Loans' : '-Allocations_And_Additions'
        console.log(res.type);
        downloadFile(res, ctx.getState().payrollSummary.name.replace(/[&\/\\#,+()$~%.:*?<>{}]/g, '') + nameAddition, res.type);
        ctx.patchState({ payrollSummary: { ...ctx.getState().payrollSummary, lastModifiedDate: new Date() } })
      })
    )
  }

  @Action(monthlyPayrollsActions.ExportOnePercentDeductionReport)
  public exportOnePercentDeductionReport(ctx: StateContext<MonthlyPayrollsStateModel>, { payrollId, MonthlyPayrollName }: monthlyPayrollsActions.ExportOnePercentDeductionReport) {
    return this._monthlyPayrollService.exportOnePercentDeductionReport(payrollId).pipe(
      tap((res: Blob) => {
        const nameAddition = '-Detailed-Report'
        downloadFile(res, MonthlyPayrollName + nameAddition, res.type);
        // ctx.patchState({payrollSummary: {...ctx.getState().payrollSummary, lastModifiedDate: new Date()}})
      })
    )
  }


  @Action(monthlyPayrollsActions.SendMonthlyPayrollNotificationViaEmail)
  public sentMonthlyPayrollNotificationViaEmail(ctx: StateContext<MonthlyPayrollsStateModel>, { payrollId, emailType }: monthlyPayrollsActions.SendMonthlyPayrollNotificationViaEmail) {
    return this._monthlyPayrollService.sendMonthlyPayrollNotificationViaEmail({ payrollId, emailType })
  }

  @Action(monthlyPayrollsActions.ClearMonthlyPayrollSummaryAndDetails)
  public clearMonthlyPayrollSummaryAndDetails({ patchState }: StateContext<MonthlyPayrollsStateModel>) {
    patchState({ 
      payrollSummary: null, 
      payrollDetails: [],    
      detailsSearchQuery: null,
      insuranceStatusFilter: null,
      transferDateFilter:'All',
      suspensionStatusFilter:null,
      payrollDetailsPagination: { pageNumber: 0, pageSize: 10 } })
  }
  
  @Action(monthlyPayrollsActions.GetCountOfProfilesShouldBeApplied)
  public getCountOfProfilesShouldBeApplied({ patchState }: StateContext<MonthlyPayrollsStateModel>, { payrollId }: monthlyPayrollsActions.GetCountOfProfilesShouldBeApplied) {
    return this._monthlyPayrollService.getCountOfProfilesShouldBeApplied(payrollId).pipe(
      tap((countOfProfileShouldApplied: number)=> patchState({countOfProfileShouldApplied}))

    )
  }

  @Action(monthlyPayrollsActions.GetCountOfProfilesShouldBeRemovedFromApplying)
  public getCountOfProfilesShouldBeRemovedFromApplying({ patchState }: StateContext<MonthlyPayrollsStateModel>, { payrollId }: monthlyPayrollsActions.GetCountOfProfilesShouldBeRemovedFromApplying) {
    return this._monthlyPayrollService.getCountOfProfilesShouldBeRemovedFromApplying(payrollId).pipe(
      tap((countOfProfileShouldRemovedFromApplied: number)=> patchState({countOfProfileShouldRemovedFromApplied}))

    )
  }

  @Action(monthlyPayrollsActions.GetProfilesShouldBeApplied)
  public getProfilesShouldBeApplied({ getState,patchState }: StateContext<MonthlyPayrollsStateModel>, { payrollId }: monthlyPayrollsActions.GetProfilesShouldBeApplied) {
    const { profileShouldAppliedPagination: { pageNumber, pageSize } } = getState();
    return this._monthlyPayrollService.getProfilesShouldBeApplied(payrollId, { pageNumber, pageSize }).pipe(
      tap(({ records: profileShouldApplied, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel>) => patchState({
        profileShouldApplied,
        profileShouldAppliedPagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
      }))
    )
  }

  @Action(monthlyPayrollsActions.GetProfilesShouldBeRemovedFromApplying)
  public getProfilesShouldBeRemovedFromApplying({ getState, patchState }: StateContext<MonthlyPayrollsStateModel>, { payrollId }: monthlyPayrollsActions.GetCountOfProfilesShouldBeApplied) {
    const { profileShouldRemovedFromAppliedPagination: { pageNumber, pageSize } } = getState();
    return this._monthlyPayrollService.getProfilesShouldBeRemovedFromApplying(payrollId, { pageNumber, pageSize }).pipe(
      tap(({ records: profileShouldRemovedFromApplied, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel>) => patchState({
        profileShouldRemovedFromApplied,
        profileShouldRemovedFromAppliedPagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
      }))
    )
  }

  @Action(monthlyPayrollsActions.ProfilesShouldBeAppliedPagination)
  public profilesShouldBeAppliedPagination({ patchState, dispatch }: StateContext<MonthlyPayrollsStateModel>,{ pagination, payrollId, action }: monthlyPayrollsActions.ProfilesShouldBeAppliedPagination) {
      patchState({ profileShouldAppliedPagination: pagination })
      if(action != 'reset') {
        dispatch(new monthlyPayrollsActions.GetProfilesShouldBeApplied(payrollId))
      }
  }

  @Action(monthlyPayrollsActions.ProfilesShouldBeRemovedFromApplyingPagination)
  public profilesShouldBeRemovedFromApplyingPagination({ patchState, dispatch }: StateContext<MonthlyPayrollsStateModel>,{ pagination, payrollId, action }: monthlyPayrollsActions.ProfilesShouldBeRemovedFromApplyingPagination) {
      patchState({ profileShouldRemovedFromAppliedPagination: pagination })
      if(action != 'reset') {
        dispatch(new monthlyPayrollsActions.GetProfilesShouldBeRemovedFromApplying(payrollId))
      }
  }

  @Action(monthlyPayrollsActions.ApplyLoyalty)
  public applyLoyalty({}: StateContext<MonthlyPayrollsStateModel>,{payrollId, profileIds }: monthlyPayrollsActions.ApplyLoyalty) {
    return this._monthlyPayrollService.applyLoyalty(payrollId, profileIds).pipe(
      tap((result)=>{})
    )
  }

  @Action(monthlyPayrollsActions.RemoveAppliedLoyalty)
  public removeAppliedLoyalty({}: StateContext<MonthlyPayrollsStateModel>,{payrollId, profileIds }: monthlyPayrollsActions.RemoveAppliedLoyalty) {
    return this._monthlyPayrollService.removeAppliedLoyalty(payrollId, profileIds).pipe(
      tap((result)=>{})
    )  
  }

  @Action(monthlyPayrollsActions.SelectLoyaltyBonus)
  public selectLoyaltyBonus({ patchState, getState }: StateContext<MonthlyPayrollsStateModel>, { task, checked, action }: monthlyPayrollsActions.SelectLoyaltyBonus) {
    if(action === 'insert') {
      patchState({
        profileShouldApplied: getState().profileShouldApplied.map(item => item.profileId === task.profileId ? { ...item, checked: checked } : item)
      })
    } else {
      patchState({
        profileShouldRemovedFromApplied: getState().profileShouldRemovedFromApplied.map(item => item.profileId === task.profileId ? { ...item, checked: checked } : item)
      })
    }
  }

  @Action(monthlyPayrollsActions.SelectAllLoyaltyBonus)
  public selectAllLoyaltyBonus({ patchState, getState }: StateContext<MonthlyPayrollsStateModel>, { checked, action }: monthlyPayrollsActions.SelectLoyaltyBonus) {
    if(action === 'insert') {
      patchState({
        profileShouldApplied: getState().profileShouldApplied.map(item => { return { ...item, checked: checked } })
      })
    } else {
      patchState({
        profileShouldRemovedFromApplied: getState().profileShouldRemovedFromApplied.map(item => { return { ...item, checked: checked } })
      })
    }
  }

  @Action(monthlyPayrollsActions.ExportPayrollLoyaltyDetails)
  public ExportPayrollLoyaltyDetails(ctx: StateContext<MonthlyPayrollsStateModel>, { payrollId, monthlyPayrollName }: monthlyPayrollsActions.ExportPayrollLoyaltyDetails) {
    return this._monthlyPayrollService.exportPayrollLoyaltyDetails(payrollId).pipe(
      tap((res: Blob) => {
        downloadFile(res, monthlyPayrollName + '-Detailed-Report', res.type);
      })
    )
  }
}
