import { Injectable } from '@angular/core';
import { LoansService } from '../model/loans.service';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreateLoanResponseModel, GetLoanByIDResponseModel, loansFiltrationModel, loansModel, LoanStatusModel, PaymentPlanListModel, PaymentPlanModel } from '../model/loans.models';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import * as LOANS_ACTIONS from './loans.actions';
import { PaginationModel } from '@core/http/apis.model';
import { tap } from 'rxjs/operators';
import { removeItem, patch } from '@ngxs/store/operators';
import { downloadFile } from '@shared/helpers/download-file.helper';

export class LoansStateModel {
  public loans: loansModel[];
  public loan: GetLoanByIDResponseModel;
  public createLoanResponse: CreateLoanResponseModel;
  public createLoanAsDraftResponse: CreateLoanResponseModel;
  public applyDraftLoan: CreateLoanResponseModel;
  public pagination: PaginationConfigModel;
  public filtration: loansFiltrationModel;
  public paymentPlan: PaymentPlanModel;
  public loanStatus: LoanStatusModel[];

  constructor() {
    this.loans = [];
    this.pagination = {
      totalPages: 0,
      recordsTotalCount: 0,
    };
    this.filtration = {query: ''};
    this.loanStatus = []
  }
}

@Injectable()
@State<LoansStateModel>({
  name: 'loans',
  defaults: new LoansStateModel(),
})
export class LoansState {
  constructor(private _mainService: LoansService) {}

  @Selector() static loans(state: LoansStateModel): loansModel[] {
    return state.loans;
  }

  @Selector() static filters(state: LoansStateModel): loansFiltrationModel {
    return state.filtration;
  }

  @Selector() static paymentPlan(state: LoansStateModel): PaymentPlanModel {
    return state.paymentPlan;
  }

  @Selector() static paymentPlanList(state: LoansStateModel): PaymentPlanListModel[] {
    return state.paymentPlan.paymentPlan;
  }

  @Selector() static pagination(state: LoansStateModel): PaginationConfigModel {
    return state.pagination;
  }

  @Selector() static loan(state: LoansStateModel): GetLoanByIDResponseModel {
    return state.loan;
  }

  @Selector() static loanPaymentPlan(state: LoansStateModel): PaymentPlanModel[] {
    return state.loan.paymentPlan;
  }

  @Selector() static createLoanResponse(state: LoansStateModel): CreateLoanResponseModel {
    return state.createLoanResponse;
  }

  @Selector() static createLoanAsDraftResponse(state: LoansStateModel): CreateLoanResponseModel {
    return state.createLoanAsDraftResponse;
  }

  @Selector() static applyDraftLoan(state: LoansStateModel): CreateLoanResponseModel {
    return state.applyDraftLoan;
  }

  @Selector() static loanDtatus(state: LoansStateModel): LoanStatusModel[] {
    return state.loanStatus;
  }

  @Action(LOANS_ACTIONS.getAllLoans)
  public getAllLoans({ getState, patchState }: StateContext<LoansStateModel>) {
    const {
      pagination: { pageNumber, pageSize },
      filtration,
    } = getState();
    return this._mainService
      .getAllLoans({ pageSize, pageNumber }, filtration)
      .pipe(
        tap(
          ({
            records: loans,
            totalPages,
            recordsTotalCount,
          }: PaginationModel<loansModel>) =>
            patchState({
              loans,
              pagination: {
                ...getState().pagination,
                totalPages,
                recordsTotalCount,
              },
            })
        )
      );
  }

  @Action(LOANS_ACTIONS.PaginateLoans)
  public paginateLoans(
    { getState, patchState, dispatch }: StateContext<LoansStateModel>,
    { config }: LOANS_ACTIONS.PaginateLoans
  ) {
    patchState({ pagination: { ...getState().pagination, ...config } });
    dispatch(new LOANS_ACTIONS.getAllLoans());
  }

  @Action(LOANS_ACTIONS.FilterLoans)
  public filterLoans(
    { patchState, getState, dispatch }: StateContext<LoansStateModel>,
    { filtration }: LOANS_ACTIONS.FilterLoans
  ) {
    patchState({
      filtration: { ...getState().filtration, ...filtration },
      pagination: { ...getState().pagination, pageNumber: 0 },
    });

    dispatch(new LOANS_ACTIONS.getAllLoans());
  }

  @Action(LOANS_ACTIONS.DeleteLoan)
  public deleteLoan({ setState }: StateContext<LoansStateModel>, { id }: LOANS_ACTIONS.DeleteLoan) {
    return this._mainService
      .deleteLoan(id)
      .pipe(
        tap(() => setState(patch({ loans: removeItem<loansModel>(item => item.id === id) })))
      );
  }

  @Action(LOANS_ACTIONS.getPaymentPlan)
  public getPaymentPlan({patchState}: StateContext<LoansStateModel>, {plan} : LOANS_ACTIONS.getPaymentPlan) {
    return this._mainService
      .getPaymentPlan(plan)
      .pipe(
        tap((records:PaymentPlanModel)=>patchState({paymentPlan:records}))
      );
  }

  @Action(LOANS_ACTIONS.GetById)
  public GetById({patchState}: StateContext<LoansStateModel>, {loanId} : LOANS_ACTIONS.GetById) {
    return this._mainService
      .GetById(loanId)
      .pipe(
        tap((record:GetLoanByIDResponseModel)=>patchState({loan:record}))
      );
  }

  @Action(LOANS_ACTIONS.CreateLoan)
  public CreateLoan({patchState}: StateContext<LoansStateModel>, {data} : LOANS_ACTIONS.CreateLoan) {
    return this._mainService
      .createLoan(data)
      .pipe(
        tap((record:CreateLoanResponseModel)=>patchState({createLoanResponse:record}))
      );
  }

  @Action(LOANS_ACTIONS.CreateLoanAsDraft)
  public CreateLoanAsDraft({patchState}: StateContext<LoansStateModel>, {data} : LOANS_ACTIONS.CreateLoanAsDraft) {
    return this._mainService
      .createLoanAsDraft(data)
      .pipe(
        tap((record:CreateLoanResponseModel)=>patchState({createLoanAsDraftResponse:record}))
      );
  }

  @Action(LOANS_ACTIONS.ApplyDraftLoan)
  public ApplyDraftLoan({patchState}: StateContext<LoansStateModel>, {loanId} : LOANS_ACTIONS.ApplyDraftLoan) {
    return this._mainService
      .ApplyDraftLoan(loanId)
      .pipe(
        tap((record:CreateLoanResponseModel)=>patchState({applyDraftLoan:record}))
      );
  }
  
  @Action(LOANS_ACTIONS.ResetPaymentPlan)
  public ResetPaymentPlan({patchState}: StateContext<LoansStateModel>) {
    return patchState({paymentPlan:null});
  }

  @Action(LOANS_ACTIONS.ExportLoan)
  public exportLoan(ctx: StateContext<LoansStateModel>) {
    return this._mainService.ExportLoan(ctx.getState().filtration).pipe(
      tap((res: Blob) => {
        downloadFile(res, 'loans', res.type);
      })
    )
  }

  @Action(LOANS_ACTIONS.GetLoanStatus)
  public getLoanStatus({patchState}: StateContext<LoansStateModel>) {
    return this._mainService
      .getLoanStatus()
      .pipe(
        tap((records:LoanStatusModel[])=>patchState({loanStatus:records}))
      );
  }

  @Action(LOANS_ACTIONS.UpdateLoan)
  public UpdateLoan(ctx: StateContext<LoansStateModel>, {data} : LOANS_ACTIONS.UpdateLoan) {
    return this._mainService.updateLoan(data)
  }

}
