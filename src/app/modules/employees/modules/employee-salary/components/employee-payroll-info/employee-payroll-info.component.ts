import { EmployeeUnsuspendSalaryComponent } from './../employee-unsuspend-salary/employee-unsuspend-salary.component';
import { SalaryDetailsState } from './../../state/salary-details.state';
import { MatDialog } from '@angular/material/dialog';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { Component, Input} from '@angular/core';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PayrollInfo } from '../../model/salary-details.model';
import { EmployeeSuspendSalaryComponent } from '../employee-suspend-salary/employee-suspend-salary.component';
import * as SALARY_MODEL from '@modules/employees/modules/employee-salary/model/salary-details.model'

@Component({
  selector: 'app-employee-payroll-info',
  templateUrl: './employee-payroll-info.component.html',
  styles: [
  ]
})
export class EmployeePayrollInfoComponent {

  @ViewSelectSnapshot(AuthorizationState.isPayroll) public isPayroll: boolean
  @ViewSelectSnapshot(SalaryDetailsState.personalInfo) public personalInfo: SALARY_MODEL.EmployeePersonalInfo;
  constructor(private _matDialog: MatDialog) { 
  }

  @Input() public payrollInfo: PayrollInfo;

  public viewSuspendSalary() {
    this._matDialog.open(EmployeeSuspendSalaryComponent, {
      panelClass: ['FormDialog']
    })
  }

  public viewUnSuspendSalary() {
    this._matDialog.open(EmployeeUnsuspendSalaryComponent, {
      panelClass: ['FormDialog']
    })
  }


}
