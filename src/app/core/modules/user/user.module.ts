import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { UserState } from './state/user.state';
import { NgxsModule } from '@ngxs/store';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { MyPersonalInfoComponent } from './components/my-personal-info/my-personal-info.component';
import { MaterialModule } from '@shared/material.module';
import { TableMyRequestsHistoryComponent } from './components/table-my-requests-history/table-my-requests-history.component';
import { SharedModule } from '@shared/shared.module';
import { MyRequestDetailsComponent } from './components/my-request-details/my-request-details.component';





@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedComponentsModule,
    MaterialModule,
    NgxsModule.forFeature([UserState]),
    SharedModule

  ],
  declarations: [MyProfileComponent, MyPersonalInfoComponent, TableMyRequestsHistoryComponent, MyRequestDetailsComponent]
})
export class UserModule { }
