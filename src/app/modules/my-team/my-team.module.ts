import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyTeamRoutingModule } from './my-team-routing.module';
import { TableMyTeamComponent } from './components/table-my-team/table-my-team.component';
import { ManageMyTeamComponent, ExampleHeader} from './pages/manage-my-team/manage-my-team.component';
import { MyTeamService } from './model/my-team.service';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { MyTeamState } from './state/my-team.state';
import { UpdateTeamDetailsComponent } from './components/update-team-details/update-team-details.component';
import { TableCurrentBudgetComponent } from './components/table-current-budget/table-current-budget.component';
import { ViewBudgetDetailsModalComponent } from './components/view-budget-details-modal/view-budget-details-modal.component';
import { AssignBudgetFormComponent } from './components/assign-budget-form/assign-budget-form.component';
import { ViewLoyaltyBonusHistoryComponent } from './components/view-loyalty-bonus-history/view-loyalty-bonus-history.component';


@NgModule({
  declarations: [TableMyTeamComponent, ManageMyTeamComponent, UpdateTeamDetailsComponent, TableCurrentBudgetComponent, ViewBudgetDetailsModalComponent, AssignBudgetFormComponent, ViewLoyaltyBonusHistoryComponent,ExampleHeader],
  imports: [
    CommonModule,
    MyTeamRoutingModule,
    SharedModule,

    NgxsModule.forFeature([MyTeamState])
  ],


  providers: [MyTeamService]
})
export class MyTeamModule { }
