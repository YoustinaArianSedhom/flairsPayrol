import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeesSalariesListComponent } from './components/employees-salaries-list/employees-salaries-list.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesSalariesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalariesRoutingModule { }
