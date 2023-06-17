import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonthlyPayrollsRoutingModule } from './monthly-payrolls-routing.module';
import { ManageMonthlyPayrollsComponent } from './pages/manage-monthly-payrolls/manage-monthly-payrolls.component';
import { FormMonthlyPayrollsComponent } from './components/form-monthly-payrolls/form-monthly-payrolls.component';
import { TableMonthlyPayrollsComponent } from './components/table-monthly-payrolls/table-monthly-payrolls.component';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { MonthlyPayrollsState } from './state/monthly-payrolls.state';
import { MonthlyPayrollsService } from './model/monthly-payrolls.service';
import { TableMonthlyPayrollDetailsComponent } from './components/table-monthly-payroll-details/table-monthly-payroll-details.component';
import { MonthlyPayrollPageComponent } from './pages/monthly-payroll-page/monthly-payroll-page.component';
import { SummaryMonthlyPayrollComponent } from './components/summary-monthly-payroll/summary-monthly-payroll.component';
import { AdditionDeductionState } from './modules/addition-deduction/state/addition-deduction.state';
import { AllocationsModule } from './modules/allocations/allocations.module';
import { AllocationsState } from './modules/allocations/state/allocations.state';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { MonthlyPayrollActionsMenuComponent } from './components/monthly-payroll-actions-menu/monthly-payroll-actions-menu.component';
import { ViewPayrollSalariesDetailsComponent } from './components/view-payroll-salaries-details/view-payroll-salaries-details.component';
import { InsertRemoveLoyaltyBonusFromPayrollComponent } from './components/insert-remove-loyalty-bonus-from-payroll/insert-remove-loyalty-bonus-from-payroll.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'M/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [ManageMonthlyPayrollsComponent, FormMonthlyPayrollsComponent, TableMonthlyPayrollsComponent, TableMonthlyPayrollDetailsComponent, MonthlyPayrollPageComponent, SummaryMonthlyPayrollComponent, MonthlyPayrollActionsMenuComponent, ViewPayrollSalariesDetailsComponent, InsertRemoveLoyaltyBonusFromPayrollComponent],
  imports: [
    CommonModule,
    MonthlyPayrollsRoutingModule,
    NgxsModule.forFeature([MonthlyPayrollsState, AdditionDeductionState, AllocationsState]),
    AllocationsModule,
    SharedModule
  ],
  providers: [MonthlyPayrollsService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]

})
export class MonthlyPayrollsModule { }
