import { NgModule } from '@angular/core';

import { EmployeeProfileRoutingModule } from './employee-profile-routing.module';
import { EmployeeProfileComponent } from './pages/employee-profile/employee-profile.component';
import { EmployeeBankDetailsFormComponent } from '../employee-salary/components/employee-bank-details-form/employee-bank-details-form.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { SharedModule } from '@shared/shared.module';
import { TableEmployeeHistoryComponent } from './components/table-employee-history/table-employee-history.component';
import { RequestDetailsComponent } from './components/request-details/request-details.component';


@NgModule({
  declarations: [EmployeeProfileComponent, EmployeeBankDetailsFormComponent, PersonalInfoComponent, TableEmployeeHistoryComponent, RequestDetailsComponent],
  imports: [
    EmployeeProfileRoutingModule,
    SharedModule

  ]
})
export class EmployeeProfileModule { }
