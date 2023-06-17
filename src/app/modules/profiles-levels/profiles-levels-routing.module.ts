import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageProfilesLevelsComponent } from './pages/manage-profiles-levels/manage-profiles-levels.component';

const routes: Routes = [{
  path: '',
  component: ManageProfilesLevelsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilesLevelsRoutingModule { }
