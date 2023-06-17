import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ManageReportsComponent } from './pages/manage-reports/manage-reports.component';
import { SharedModule } from '@shared/shared.module';
import { TableReportsComponent } from './components/table-reports/table-reports.component'
import { NgxsModule } from '@ngxs/store';
import { ReportsState } from './state/reports.state';
import { AdditionDeductionPopupComponent } from './components/addition-deduction-popup/addition-deduction-popup.component';


@NgModule({
  declarations: [ManageReportsComponent, TableReportsComponent, AdditionDeductionPopupComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    NgxsModule.forFeature([ReportsState])
  ]
})
export class ReportsModule { }
