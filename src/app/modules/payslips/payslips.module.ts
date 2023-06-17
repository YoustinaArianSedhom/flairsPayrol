import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayslipsRoutingModule } from './payslips-routing.module';
import { PayslipsComponent } from './payslips.component';
import { TablePayslipComponent } from './components/table-payslip/table-payslip.component';
import { MyPayslipsComponent } from './pages/my-payslip/my-payslips.component';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { PayslipsState } from './state/payslips.state';
import { PayslipsService } from './model/payslips.service';
import { PayslipSummaryComponent } from './components/payslip-summary/payslip-summary.component';
import { TeamPayslipsComponent } from './pages/team-payslips/team-payslips.component';
import { ProfilePayslipsComponent } from './pages/profile-payslips/profile-payslips.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { AdditionDeductionComponent } from './components/addition-deduction-popup/addition-deduction-popup.component';
import { PayslipDetailsComponent } from './components/payslip-details/payslip-details.component';
import { NgxMonthPickerModule } from '@flairstechproductunit/flairstech-libs';

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
  declarations: [PayslipsComponent, TablePayslipComponent, MyPayslipsComponent, PayslipSummaryComponent, TeamPayslipsComponent, ProfilePayslipsComponent, AdditionDeductionComponent, PayslipDetailsComponent],
  imports: [
    CommonModule,
    PayslipsRoutingModule,
    SharedModule,
    NgxsModule.forFeature([PayslipsState]),
    NgxMonthPickerModule
  ], 
  providers: [PayslipsService,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },]
})
export class PayslipsModule { }
