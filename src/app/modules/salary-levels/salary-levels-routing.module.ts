import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalariesManageComponent } from './pages/salaries-manage/salaries-manage.component';

const routes: Routes = [
  {
    path: '',
    component: SalariesManageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalaryLevelsRoutingModule { }
