import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageHrDataComponent } from './pages/manage-hr-data/manage-hr-data.component';

const routes: Routes = [{path:'', component:ManageHrDataComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HrDataRoutingModule { }
