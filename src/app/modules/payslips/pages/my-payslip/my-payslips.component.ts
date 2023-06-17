import { Component, OnDestroy, OnInit } from '@angular/core';
import { payslipTableModeType } from '@modules/payslips/model/payslips.config';
import { PayslipsSummaryModel } from '@modules/payslips/model/payslips.model';
import { GetMyPayslips, GetMyPayslipsSummary } from '@modules/payslips/state/payslips.actions';
import { PayslipsState, PayslipsStateModel } from '@modules/payslips/state/payslips.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { StateOverwrite } from 'ngxs-reset-plugin';

@Component({
  selector: 'app-my-payslip',
  templateUrl: './my-payslips.component.html',
  styles: [
  ]
})
export class MyPayslipsComponent implements OnInit, OnDestroy {

  constructor(private _store: Store) { }

  @ViewSelectSnapshot(PayslipsState.payslipsSummary) public summary: PayslipsSummaryModel;

  public mode: payslipTableModeType = 'self';
  ngOnInit(): void {
    this.fireGetMyPayslipsSummary();
    this.fireGetMyPayslips();
  }



  @Dispatch() public fireGetMyPayslipsSummary() { return new GetMyPayslipsSummary()}
  @Dispatch() public fireGetMyPayslips() {return new GetMyPayslips()}

  ngOnDestroy() {
    this._store.dispatch(new StateOverwrite([PayslipsState, new PayslipsStateModel()]))
  }

}
