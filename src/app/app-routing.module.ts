import { AuthorizedLayoutComponent } from './modules/layout/authorized-layout/authorized-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestLayoutComponent } from '@modules/layout/guest-layout/guest-layout.component';
import { AuthGuard } from '@core/auth/auth.guard';
import { ForbiddenComponent } from '@core/modules/authorization/forbidden/forbidden.component';
import { FinanceGuard } from '@core/modules/authorization/guards/finance.guard';
import { HRGuard } from '@core/modules/authorization/guards/hr.guard';
import { isITSupportGuard } from '@core/modules/authorization/guards/it-support.guard';
import { SomethingWentWrongComponent } from '@core/components/something-went-wrong/something-went-wrong.component';
import { PayrollManagerGuard } from '@core/modules/authorization/guards/payroll-manager.guard';
import { HrManagerFinanceGuard } from '@core/modules/authorization/guards/hr-manager-finance.guard';
import { CEOGuard } from '@core/modules/authorization/guards/CEO.guard';
import { ManagerGuard } from '@core/modules/authorization/guards/manager.guard';
import { BusinessPartnerGuard } from '@core/modules/authorization/guards/businessPartner.guard';
import { allManagersGuard } from '@core/modules/authorization/guards/allManagers.guard';
import { PLGuard } from '@core/modules/authorization/guards/PL.guard';
import { SyncHelperGuard } from '@core/modules/authorization/guards/syncHelper.guard';
import { HRManagerGuard } from './core/modules/authorization/guards/hr-manager.guard';
import { PayrollGuard } from './core/modules/authorization/guards/payroll.guard';
const routes: Routes = [
  {
    path: 'auth',
    component: GuestLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@core/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },

  // AUTHORIZED ROUTES
  {
    path: '',
    component: AuthorizedLayoutComponent,
    // canLoad: [AuthGuard],
    children: [
      {
        path: 'home',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('@modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'my-profile',
        canLoad: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('@core/modules/user/user.module').then(
                (m) => m.UserModule
              ),
          },
        ],
      },
      {
        path: 'all-teams',
        canLoad: [AuthGuard, allManagersGuard],
        loadChildren: () =>
          import('@modules/all-teams/all-teams.module').then((m) => m.AllTeamsModule),
      },
      {
        path: 'teams',
        canLoad: [AuthGuard, PayrollManagerGuard],
        loadChildren: () =>
          import('@modules/my-team/my-team.module').then((m) => m.MyTeamModule),
      },

      {
        path: 'salary-levels',
        canLoad: [AuthGuard, HRManagerGuard],
        loadChildren: () =>
          import('@modules/salary-levels/salary-levels.module').then(
            (m) => m.SalaryLevelsModule
          ),
      },
      {
        path: 'entities',
        canLoad: [AuthGuard, PayrollGuard],
        loadChildren: () =>
          import('@modules/entities/entities.module').then(
            (m) => m.EntitiesModule
          ),
      },
      {
        path: 'employees',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('@modules/employees/employees.module').then(
            (m) => m.EmployeesModule
          ),
      },
      {
        path: 'hr-management',
        canLoad: [AuthGuard, HRManagerGuard],
        loadChildren: () =>
          import('@modules/hr-management/hr-management.module').then(
            (m) => m.HrManagementModule
          ),
      },
      {
        path: 'hr-data',
        canActivate: [SyncHelperGuard],
        data: {
          syncGuards: [AuthGuard, HRGuard, HRManagerGuard, FinanceGuard, PayrollGuard],
        },
        loadChildren: () =>
          import('@modules/hr-data/hr-data.module').then(
            (m) => m.HrDataModule
          ),
      },
      {
        path: 'employees-salaries',
        data: {
          syncGuards: [HRManagerGuard, PayrollGuard],
        },
        loadChildren: () =>
          import('@modules/salaries/salaries.module').then(
            (m) => m.SalariesModule
          ),
      },
      {
        path: 'loan-management',
        canLoad: [AuthGuard, PayrollGuard],
        loadChildren: () =>
          import('@modules/loans/loans.module').then(
            (m) => m.LoansModule
          ),
      },
      {
        path: 'monthly-payrolls',
        canLoad: [AuthGuard, PayrollGuard],
        loadChildren: () =>
          import('@modules/monthly-payrolls/monthly-payrolls.module').then(
            (m) => m.MonthlyPayrollsModule
          ),
      },
      {
        path: 'payslips',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./modules/payslips/payslips.module').then(
            (m) => m.PayslipsModule
          ),
      },
      {
        path: 'profiles-levels',
        canLoad: [HRManagerGuard],
        loadChildren: () =>
          import('./modules/profiles-levels/profiles-levels.module').then(
            (m) => m.ProfilesLevelsModule
          ),
      },
      {
        path: 'reports',
        canLoad: [AuthGuard, PayrollGuard],
        loadChildren: () =>
          import('./modules/reports/reports.module').then(
            (m) => m.ReportsModule
          ),
      },
      {
        path: 'raises',
        canLoad:[PayrollGuard],
        loadChildren: () => 
        import('./modules/raises/raises.module').then(
          (m) =>m.RaisesModule
        )
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'index.html',
        redirectTo: 'home',
        pathMatch: 'full',
      },

    ],
  },

  // Forbidden
  {
    path: 'forbidden',
    component: GuestLayoutComponent,
    children: [
      {
        path: '',
        component: ForbiddenComponent,
      },
    ],
  },

  {
    path: 'dashboard',
    redirectTo: '/home'
  },

  // General Wrongs
  {
    path: 'not-found',
    component: GuestLayoutComponent,
    children: [
      {
        path: '',
        component: SomethingWentWrongComponent,
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false,
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
