import { NgModule } from '@angular/core';
import { EmployeesSyncComponent } from './components/employees-sync/employees-sync.component';
import { NgxsModule } from '@ngxs/store';
import { EmployeesSyncState } from './state/employees-sync.state';
import { EmployeesSyncService } from './model/employees-sync.service';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [EmployeesSyncComponent],
  imports: [
    NgxsModule.forFeature([EmployeesSyncState]),
    SharedModule
  ],
  exports: [
    EmployeesSyncComponent
  ],
  providers: [EmployeesSyncService]
})
export class EmployeesSyncModule { }
