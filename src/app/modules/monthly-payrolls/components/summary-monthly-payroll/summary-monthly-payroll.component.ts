import { Component } from '@angular/core';
import { monthlyPayrollStatuses, MonthlyPayrollStatusesEnum } from '@modules/monthly-payrolls/model/monthly-payrolls.config';
import { MonthlyPayrollSummaryModel } from '@modules/monthly-payrolls/model/monthly-payrolls.model';
import { MonthlyPayrollsState } from '@modules/monthly-payrolls/state/monthly-payrolls.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';

@Component({
  selector: 'app-summary-monthly-payroll',
  templateUrl: './summary-monthly-payroll.component.html',
  styleUrls: ['./summary-monthly-payroll.component.scss']
})
export class SummaryMonthlyPayrollComponent {

  constructor() { }

  @ViewSelectSnapshot(MonthlyPayrollsState.payrollSummary) public summary: MonthlyPayrollSummaryModel;
  public payrollStatusesEnum = MonthlyPayrollStatusesEnum;
  public payrollStatuses = monthlyPayrollStatuses;

}
