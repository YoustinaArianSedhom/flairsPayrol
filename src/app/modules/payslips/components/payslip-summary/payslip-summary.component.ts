import { Component } from '@angular/core';
import { PayslipsSummaryModel } from '@modules/payslips/model/payslips.model';
import { PayslipsState } from '@modules/payslips/state/payslips.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';

@Component({
  selector: 'app-payslip-summary',
  templateUrl: './payslip-summary.component.html',
  styles: [
  ]
})
export class PayslipSummaryComponent {

  constructor() { }

  @ViewSelectSnapshot(PayslipsState.payslipsSummary) public summary: PayslipsSummaryModel;

}
