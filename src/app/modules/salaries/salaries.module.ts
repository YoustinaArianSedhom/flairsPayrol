import { NgModule } from '@angular/core';
import { EmployeesSalariesListComponent } from './components/employees-salaries-list/employees-salaries-list.component';
import { EmployeesSalariesListTableComponent } from './components/employees-salaries-list-table/employees-salaries-list-table.component';
import { SalariesRoutingModule } from './salaries-routing.module';
import { EmployeeSalaryDetailsState } from './state/salaries.state';
import { NgxsModule } from '@ngxs/store';
import { EntitiesState } from '@modules/entities/state/entities.state';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [EmployeesSalariesListComponent, EmployeesSalariesListTableComponent],
  imports: [
    SalariesRoutingModule,
    NgxsModule.forFeature([EmployeeSalaryDetailsState, EntitiesState]),
    SharedModule
  ]
})
export class SalariesModule { }
