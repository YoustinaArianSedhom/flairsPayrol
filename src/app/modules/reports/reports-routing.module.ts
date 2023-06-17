import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageReportsComponent } from './pages/manage-reports/manage-reports.component';

const routes: Routes = [{path:'',component:ManageReportsComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
