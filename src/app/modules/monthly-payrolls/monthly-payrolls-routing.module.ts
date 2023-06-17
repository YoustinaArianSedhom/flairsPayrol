import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageMonthlyPayrollsComponent } from './pages/manage-monthly-payrolls/manage-monthly-payrolls.component';
import { MonthlyPayrollPageComponent } from './pages/monthly-payroll-page/monthly-payroll-page.component';

const routes: Routes = [{
  path: '',
  component: ManageMonthlyPayrollsComponent,
}, {
  path: 'view/:id',
  component: MonthlyPayrollPageComponent
},
{
  path: 'addition-deduction',
  loadChildren: () => import('@modules/monthly-payrolls/modules/addition-deduction/addition-deduction.module').then(m => m.AdditionDeductionModule)
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonthlyPayrollsRoutingModule { }
