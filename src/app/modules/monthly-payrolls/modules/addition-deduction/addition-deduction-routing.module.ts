import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdditionDeductionManageComponent } from './views/addition-deduction-manage/addition-deduction-manage.component';

const routes: Routes = [{
  path: '',
  component: AdditionDeductionManageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdditionDeductionRoutingModule { }
