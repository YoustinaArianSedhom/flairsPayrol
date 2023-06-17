import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageMyTeamComponent } from './pages/manage-my-team/manage-my-team.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'my-team',
    pathMatch: 'full'
  }, {
    path: 'my-team',
    component: ManageMyTeamComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyTeamRoutingModule { }
