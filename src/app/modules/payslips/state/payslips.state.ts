import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { tap } from 'rxjs/operators';
import { ManagerWithSubModel, PayslipModel, PayslipsFiltrationModel, PayslipsSummaryModel, TeamPayslipsAggregatesResultModel } from '../model/payslips.model';
import { PayslipsService } from '../model/payslips.service';
import * as payslipsActions from './payslips.actions';

export class PayslipsStateModel {
  public payslipsSummary: PayslipsSummaryModel;
  public payslips: PayslipModel[];
  public teamPayslips: PayslipModel[];
  public filtration: PayslipsFiltrationModel;
  public lastPublishedPayrollDate: PayslipsFiltrationModel
  public searchQuery: string;

  public myPayslipsPagination: PaginationConfigModel;
  public teamPayslipsPagination: PaginationConfigModel;
  public profilePayslipsPagination: PaginationConfigModel;
  public teamPayslipsAggregates: TeamPayslipsAggregatesResultModel;
  public managersWithSubRoles : ManagerWithSubModel[];

  constructor() {
    this.payslipsSummary = null;
    this.payslips = [];
    this.teamPayslips = []
    this.filtration = {
      from: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      },
      to: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      }
    };
    this.lastPublishedPayrollDate = {
      from: {
        month: null,
        year: null
      },
      to: {
        month: null,
        year: null
      }
    };
    
    this.searchQuery = '';
    this.myPayslipsPagination = {};
    this.teamPayslipsPagination = {};
    this.profilePayslipsPagination = {};
    this.teamPayslipsAggregates = null;
    this.managersWithSubRoles = [];
  }
}


@Injectable()
@State<PayslipsStateModel>({
  name: 'payslips',
  defaults: new PayslipsStateModel()
})
export class PayslipsState {

  constructor(private _payslipsService: PayslipsService) { }


  @Selector() static payslipsSummary(state: PayslipsStateModel): PayslipsSummaryModel {
    return state.payslipsSummary;
  }

  @Selector() static payslips(state: PayslipsStateModel): PayslipModel[] {
    return state.payslips;
  }

  @Selector() static teamPayslips(state: PayslipsStateModel): PayslipModel[] {
    return state.teamPayslips;
  }

  @Selector() static searchQuery(state: PayslipsStateModel): string {
    return state.searchQuery;
  }

  @Selector() static filtration(state: PayslipsStateModel): PayslipsFiltrationModel {
    return state.filtration;
  }

  @Selector() static lastPublishedPayrollDate(state: PayslipsStateModel): PayslipsFiltrationModel {
    return state.lastPublishedPayrollDate;
  }

  @Selector() static myPayslipsPagination(state: PayslipsStateModel): PaginationConfigModel {
    return { ...state.myPayslipsPagination };
  }

  @Selector() static teamPayslipsPagination(state: PayslipsStateModel): PaginationConfigModel {
    return { ...state.teamPayslipsPagination };
  }

  @Selector() static profilePayslipsPagination(state: PayslipsStateModel): PaginationConfigModel {
    return { ...state.profilePayslipsPagination };
  }

  @Selector() static teamPayslipsAggregates(state: PayslipsStateModel): TeamPayslipsAggregatesResultModel {
    return { ...state.teamPayslipsAggregates };
  }

  @Selector() static ManagersWithSubRoles (state: PayslipsStateModel):ManagerWithSubModel[] { return [...state.managersWithSubRoles] }

  /* MY PAYSLIPS SUMMARY */
  @Action(payslipsActions.GetMyPayslipsSummary)
  public getMyPayslipsSummary({ patchState }: StateContext<PayslipsStateModel>) {
    return this._payslipsService.getMyPayslipsSummary().pipe(
      tap((payslipsSummary) => patchState({ payslipsSummary }))
    )
  }

  @Action(payslipsActions.GetMyPayslips)
  public getMyPayslips({ getState, patchState }: StateContext<PayslipsStateModel>) {
    const { pageNumber, pageSize } = getState().myPayslipsPagination;
    return this._payslipsService.getMyPayslips({ pageNumber, pageSize }).pipe(
      tap(({ records, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<PayslipModel>) => patchState({
        payslips: records,
        myPayslipsPagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
      }))
    )
  }

  @Action(payslipsActions.PaginateMyPayslips)
  public paginateMyPayslips({ patchState, dispatch }: StateContext<PayslipsStateModel>, { pagination }: payslipsActions.PaginateMyPayslips) {
    patchState({
      myPayslipsPagination: { pageSize: pagination.pageSize, pageNumber: pagination.pageNumber }
    })

    dispatch(new payslipsActions.GetMyPayslips())
  }


  /* MY TEAM PAYSLIPS */
  @Action(payslipsActions.GetMyTeamPayslips)
  public getMyTeamPayslips({ getState, patchState }: StateContext<PayslipsStateModel>) {
    const { filtration, searchQuery, teamPayslipsPagination: { pageNumber, pageSize } } = getState();    
    return this._payslipsService.getTeamPayslips({ ...filtration, searchQuery }, { pageNumber, pageSize }).pipe(
      tap(({ records: teamPayslips, totalPages, recordsTotalCount, pageSize, pageNumber }: PaginationModel<PayslipModel>) => patchState({
        teamPayslips,
        teamPayslipsPagination: { totalPages, recordsTotalCount, pageSize, pageNumber }
      }))
    )
  }

  @Action(payslipsActions.GetLastPublishedPayrollDate)
  public getLastPublishedPayrollDate({ getState, patchState, dispatch }: StateContext<PayslipsStateModel>) {
    const state = getState();
    return this._payslipsService.getLastPublishedPayrollDate().pipe(
      tap(
        (res) => {
          const lastPublishedPayrollDate = new Date(res)
          patchState({
            ...state,
            filtration: {
              ...state.filtration,
              from: {
                month: lastPublishedPayrollDate.getMonth() + 1,
                year: lastPublishedPayrollDate.getFullYear()
              },
              to: {
                month: lastPublishedPayrollDate.getMonth() + 1,
                year: lastPublishedPayrollDate.getFullYear()
              }
            },
            lastPublishedPayrollDate:{
              from: {
                month: lastPublishedPayrollDate.getMonth() + 1,
                year: lastPublishedPayrollDate.getFullYear()
              },
              to: {
                month: lastPublishedPayrollDate.getMonth() + 1,
                year: lastPublishedPayrollDate.getFullYear()
              }
            }
          })
          dispatch(payslipsActions.GetMyTeamPayslips)
          dispatch(payslipsActions.GetTeamPayslipsAggregates)

        }
      )
    )
  }

  @Action(payslipsActions.SearchMyTeamPayslips)
  public searchMyTeamPayslips({ patchState, getState, dispatch }: StateContext<PayslipsStateModel>, { searchQuery }: payslipsActions.SearchMyTeamPayslips) {
    patchState({ searchQuery, teamPayslipsPagination: { ...getState().teamPayslipsPagination, pageNumber: 0 }, filtration: {...getState().filtration, searchQuery: searchQuery} });
    dispatch(new payslipsActions.GetMyTeamPayslips())
  }


  @Action(payslipsActions.FilterMyTeamPayslips)
  public filterMyTeamPayslips({ patchState, getState, dispatch }: StateContext<PayslipsStateModel>, { filtration }: payslipsActions.FilterMyTeamPayslips) {
    patchState({ filtration, teamPayslipsPagination: { ...getState().teamPayslipsPagination, pageNumber: 0 } });
    dispatch(new payslipsActions.GetMyTeamPayslips())
    dispatch(payslipsActions.GetTeamPayslipsAggregates)
  }

  @Action(payslipsActions.ResetFilterMyTeamPayslips)
  public ResetFilterMyTeamPayslips({ patchState, getState, dispatch }: StateContext<PayslipsStateModel>) {
    patchState({
      filtration: {
        ...getState().lastPublishedPayrollDate,
        managerId:null
      },
      searchQuery: null,
      teamPayslipsPagination: {
        ...getState().teamPayslipsPagination,
        pageNumber: 0,
      },
    });
    dispatch(new payslipsActions.GetMyTeamPayslips());
    dispatch(payslipsActions.GetTeamPayslipsAggregates)
  }


  @Action(payslipsActions.PaginateMyTeamPayslips)
  public paginateMyTeamPayslips({ patchState, dispatch }: StateContext<PayslipsStateModel>, { pagination }: payslipsActions.PaginateMyTeamPayslips) {
    patchState({ teamPayslipsPagination: pagination });
    dispatch(new payslipsActions.GetMyTeamPayslips())
  }



  /* PROFILE PAYSLIPS */
  @Action(payslipsActions.GetProfilePayslipsSummary)
  public getProfilePayslipsSummary({ patchState }: StateContext<PayslipsStateModel>, { config }: payslipsActions.GetProfilePayslipsSummary) {
    return this._payslipsService.getProfilePayslipsSummary(config).pipe(
      tap(payslipsSummary => patchState({ payslipsSummary }))
    )
  }

  @Action(payslipsActions.GetProfilePayslips)
  public getProfilePayslips({ getState, patchState }: StateContext<PayslipsStateModel>, { config }: payslipsActions.GetProfilePayslips) {
    const { pageNumber, pageSize } = getState().profilePayslipsPagination;
    return this._payslipsService.getProfilePayslips(config, { pageNumber, pageSize }).pipe(
      tap(({ records: payslips, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<PayslipModel>) => patchState({
        payslips,
        profilePayslipsPagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
      }))
    )
  }

  @Action(payslipsActions.PaginateProfilePayslips)
  public paginateProfilePayslips({ patchState, dispatch }: StateContext<PayslipsStateModel>, { pagination, config }: payslipsActions.PaginateProfilePayslips) {
    patchState({ profilePayslipsPagination: pagination });
    dispatch(new payslipsActions.GetProfilePayslips(config))
  }

  @Action(payslipsActions.GetTeamPayslipsAggregates)
  public GetTeamPayslipsAggregates({ patchState, getState }: StateContext<PayslipsStateModel>) {
    
    return this._payslipsService.getTeamPayslipsAggregates(getState().filtration).pipe(
      tap(
          (teamPayslipsAggregates) => patchState({ teamPayslipsAggregates })
      )
    );
    // .pipe(
    //   tap(({ records: payslips, recordsTotalCount, totalPages, pageNumber, pageSize }: PaginationModel<PayslipModel>) => patchState({
    //     payslips,
    //     profilePayslipsPagination: { recordsTotalCount, totalPages, pageNumber, pageSize }
    //   }))
    // )
  }

  @Action(payslipsActions.FindSubsWithManagerRoles)
  public FindSubsWithManagerRoles({ patchState }: StateContext<PayslipsStateModel>){
    return this._payslipsService.findSubsWithManagerRoles().pipe(
      tap(
        (managersWithSubRoles: ManagerWithSubModel[])=> patchState({managersWithSubRoles})
      )
    )
  }

}
