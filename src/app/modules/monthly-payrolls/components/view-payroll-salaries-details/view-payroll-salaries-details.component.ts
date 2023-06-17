import { Component } from '@angular/core';
import { MonthlyPayrollSummaryModel } from '@modules/monthly-payrolls/model/monthly-payrolls.model';
import { MonthlyPayrollsState } from '@modules/monthly-payrolls/state/monthly-payrolls.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';

@Component({
  selector: 'app-view-payroll-salaries-details',
  templateUrl: './view-payroll-salaries-details.component.html',
  styleUrls: ['./view-payroll-salaries-details.component.scss']
})
export class ViewPayrollSalariesDetailsComponent {
  @ViewSelectSnapshot(MonthlyPayrollsState.payrollSalariesSummary) public payrollSalariesSummary:MonthlyPayrollSummaryModel;
  constructor() { }


}
