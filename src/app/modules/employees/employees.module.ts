import { NgModule } from '@angular/core';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesManageComponent } from './pages/employees-manage/employees-manage.component';
import { EmployeesTableComponent } from './components/employees-table/employees-table.component';

import { NgxsModule } from '@ngxs/store';
import { EmployeesState } from './state/employees.state';
import { EmployeesSyncModule } from './modules/employees-sync/employees-sync.module';
import { EmployeeRolesFormComponent } from './components/employee-roles-form/employee-roles-form.component';
import { EmployeeProfileState } from './modules/employee-profile/state/employee-profile.state';
import { SalaryDetailsState } from './modules/employee-salary/state/salary-details.state';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [EmployeesManageComponent, EmployeesTableComponent, EmployeeRolesFormComponent],
  imports: [
    EmployeesRoutingModule,
    EmployeesSyncModule,
    NgxsModule.forFeature([EmployeesState, EmployeeProfileState, SalaryDetailsState]),

   SharedModule
  ]
})
export class EmployeesModule { }
