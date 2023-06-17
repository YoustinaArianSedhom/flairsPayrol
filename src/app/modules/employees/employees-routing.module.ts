import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SyncHelperGuard } from '@core/modules/authorization/guards/syncHelper.guard';
import { EmployeesManageComponent } from './pages/employees-manage/employees-manage.component';
import { PayrollGuard } from '../../core/modules/authorization/guards/payroll.guard';
import { isITSupportGuard } from '@core/modules/authorization/guards/it-support.guard';

const routes: Routes = [{
  path: '',
  canActivate: [SyncHelperGuard],
  data: {
    syncGuards: [PayrollGuard, isITSupportGuard],
  },
  component: EmployeesManageComponent
},{
  path: 'view',
  loadChildren: () => import('@modules/employees/modules/employee-profile/employee-profile.module').then(m => m.EmployeeProfileModule)
},
{
  path: 'manage',
  canLoad: [PayrollGuard],
  loadChildren: () => import('@modules/employees/modules/employee-salary/employee-salary.module').then(m => m.EmployeeSalaryModule)
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
