import { Component, OnInit } from '@angular/core';
import { LayoutService } from '@modules/layout/model/layout.service';
import { loansFiltrationModel, LoanStatusModel } from '@modules/loans/model/loans.models';
import { ExportLoan, FilterLoans, GetLoanStatus } from '@modules/loans/state/loans.actions';
import { LoansState } from '@modules/loans/state/loans.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';

@Component({
  selector: 'app-list-loans',
  templateUrl: './list-loans.component.html',
  styleUrls: ['./list-loans.component.scss']
})
export class ListLoansComponent implements OnInit {

  public pageTitle = 'Loan Management';
  public StatusesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Status',
    multiple: false,
    value: this._store.selectSnapshot(LoansState.filters).loanStatus ?? null,
  }
  @ViewSelectSnapshot(LoansState.filters) public filters: loansFiltrationModel;
  @ViewSelectSnapshot(LoansState.loanDtatus) public statuses: LoanStatusModel[];
  constructor(private _layoutService: LayoutService, private _store: Store) { }

  ngOnInit(): void {
    this._layoutService.setTitle(this.pageTitle);
    this.getLoanStatus();
  }



  resetFilter(){
    this.StatusesSelectConfig = { ...this.StatusesSelectConfig, value: null }
    this.fireResetAction()
  }

  @Dispatch() public fireSearchAction(term: string) { return new FilterLoans({query:term}) }
  @Dispatch() public filterStatuses(status: number) { return new FilterLoans({loanStatus:status}) }
  @Dispatch() public fireResetAction() { return new FilterLoans({query:'', loanStatus: undefined}) }
  @Dispatch() public exportLoan() { return new ExportLoan() }
  @Dispatch() public getLoanStatus() { return new GetLoanStatus() }
  

}
