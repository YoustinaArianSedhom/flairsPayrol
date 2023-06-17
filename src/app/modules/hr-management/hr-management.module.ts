import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrManagementComponent } from './pages/hr-management/hr-management.component';
import { SharedModule } from '@shared/shared.module';
import { NgxsModule } from '@ngxs/store';
import { MyHrTeamState } from './state/hr-management.state';
import { HrManagementService } from './model/hr-management.service';
import { HrManagementRoutingModule } from './hr-management-routing.module';
import { TableHrManagementComponent } from './components/table-hr-management/table-hr-management.component';
import { ModalAssignHrComponent } from './components/modal-assign-hr/modal-assign-hr.component';
import { ModalUnassignHrComponent } from './components/modal-unassign-hr/modal-unassign-hr.component';

@NgModule({
  declarations: [
    HrManagementComponent,
    TableHrManagementComponent,
    ModalAssignHrComponent,
    ModalUnassignHrComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HrManagementRoutingModule,
    NgxsModule.forFeature([MyHrTeamState]),
  ],
  providers: [HrManagementService],
})
export class HrManagementModule {}
