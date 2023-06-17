import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeGuard } from '@core/modules/authorization/guards/employee.guard';
import { PayrollManagerGuard } from '@core/modules/authorization/guards/payroll-manager.guard';
import { MyPayslipsComponent } from './pages/my-payslip/my-payslips.component';
import { ProfilePayslipsComponent } from './pages/profile-payslips/profile-payslips.component';
import { TeamPayslipsComponent } from './pages/team-payslips/team-payslips.component';

import { PayslipsComponent } from './payslips.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [EmployeeGuard],
    component: MyPayslipsComponent
  }, {
    path: 'my-payslip',
    canActivate: [EmployeeGuard],
    component: MyPayslipsComponent
  }, {
    path: 'team-payslips',
    canActivate: [PayrollManagerGuard],
    component: TeamPayslipsComponent
  }, {
    path: 'view/:id',
    canActivate: [PayrollManagerGuard],
    component: ProfilePayslipsComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayslipsRoutingModule { }
