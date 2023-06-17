import { NgModule } from '@angular/core';
import { EmployeeSalaryRoutingModule } from './employee-salary-routing.module';
import { EmployeePersonalInfoComponent } from './components/employee-personal-info/employee-personal-info.component';
import { EmployeeSalaryComponent } from './pages/employee-salary/employee-salary.component';
import { EmployeeBankInfoComponent } from './components/employee-bank-info/employee-bank-info.component';
import { EmployeePayrollInfoComponent } from './components/employee-payroll-info/employee-payroll-info.component';
import { EmployeeEntityInfoComponent } from './components/employee-entity-info/employee-entity-info.component';
import { PersonalInfoFormComponent } from './components/personal-info-form/personal-info-form.component';
import { LeaveEntityFormComponent } from './components/leave-entity-form/leave-entity-form.component';
import { SharedModule } from '@shared/shared.module';
import { EmployeeEntityFormComponent } from './components/employee-entity-form/employee-entity-form.component';
import { EmployeeSuspendSalaryComponent } from './components/employee-suspend-salary/employee-suspend-salary.component';
import { EmployeeUnsuspendSalaryComponent } from './components/employee-unsuspend-salary/employee-unsuspend-salary.component';



@NgModule({
  declarations: [
    EmployeePersonalInfoComponent, 
    EmployeeSalaryComponent, 
    EmployeeBankInfoComponent, 
    EmployeePayrollInfoComponent, 
    EmployeeEntityInfoComponent, 
    PersonalInfoFormComponent, 
    LeaveEntityFormComponent, 
    EmployeeEntityFormComponent, EmployeeSuspendSalaryComponent, EmployeeUnsuspendSalaryComponent],
  imports: [
    EmployeeSalaryRoutingModule,
    SharedModule
  ],
  exports:[
    EmployeePersonalInfoComponent
  ]
})
export class EmployeeSalaryModule { }
