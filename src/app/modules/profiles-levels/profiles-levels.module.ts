import { NgModule } from '@angular/core';
import { ProfilesLevelsRoutingModule } from './profiles-levels-routing.module';
import { TableProfilesLevelsComponent } from './components/table-profiles-levels/table-profiles-levels.component';
import { UpdateProfileLevelComponent } from './components/update-profile-level/update-profile-level.component';
import { ManageProfilesLevelsComponent } from './pages/manage-profiles-levels/manage-profiles-levels.component';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { ProfilesLevelsState } from './state/profiles-levels.state';
import { UpdatePersonalInfoComponent } from './components/update-personal-info/update-personal-info.component';


@NgModule({
  declarations: [TableProfilesLevelsComponent, UpdateProfileLevelComponent, ManageProfilesLevelsComponent, UpdatePersonalInfoComponent],
  imports: [
    ProfilesLevelsRoutingModule,
    NgxsModule.forFeature([ProfilesLevelsState]),
    SharedModule
  ]
})
export class ProfilesLevelsModule { }
