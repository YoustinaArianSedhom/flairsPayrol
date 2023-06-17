import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { AllTeamsService } from './model/all-teams.service';
import { AllTeamsComponent } from './pages/all-teams/all-teams.component';
import { TableAllTeamsComponent } from './components/table-all-teams/table-all-teams.component';
import { AllTeamsState } from './state/all-teams.state';
import { AllTeamsRoutingModule } from './all-teams-routing.module';


@NgModule({
  declarations: [
  AllTeamsComponent,
  TableAllTeamsComponent],
  imports: [
    CommonModule,
    SharedModule,
    AllTeamsRoutingModule,
    NgxsModule.forFeature([AllTeamsState]),
  ],
  providers: [AllTeamsService],
})
export class AllTeamsModule {}
