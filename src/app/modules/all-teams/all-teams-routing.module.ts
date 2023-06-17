import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllTeamsComponent } from './pages/all-teams/all-teams.component';

const routes: Routes = [
  {
    path: '',
    component: AllTeamsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllTeamsRoutingModule {}
