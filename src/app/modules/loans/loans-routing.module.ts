import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateLoanComponent } from './pages/create-loan/create-loan.component';
import { ListLoansComponent } from './pages/list-loans/list-loans.component';
import { ViewLoanComponent } from './pages/view-loan/view-loan.component';

const routes: Routes = [{
  path: '',
  component: ListLoansComponent,
  },
  {
    path: 'create',
    component: CreateLoanComponent
  },
  {
    path: 'edit/:id',
    component: CreateLoanComponent
  },
  {
    path: 'view/:id',
    component: ViewLoanComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoansRoutingModule { }
