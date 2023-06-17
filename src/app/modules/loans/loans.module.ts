import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoansRoutingModule } from './loans-routing.module';
import { CreateLoanComponent } from './pages/create-loan/create-loan.component';
import { ListLoansComponent } from './pages/list-loans/list-loans.component';
import { SharedModule } from '@shared/shared.module';
import { PaymentPlanTableComponent } from './components/payment-plan-table/payment-plan-table.component';
import { TableLoansComponent } from './components/table-loans/table-loans.component';
import { NgxsModule } from '@ngxs/store';
import { LoansState } from './state/loans.state';
import { ViewLoanComponent } from './pages/view-loan/view-loan.component';

@NgModule({
  declarations: [CreateLoanComponent, ListLoansComponent, TableLoansComponent, PaymentPlanTableComponent, ViewLoanComponent],
  imports: [
    CommonModule,
    LoansRoutingModule,
    SharedModule,
    NgxsModule.forFeature([LoansState]),
  ]
})
export class LoansModule { }
