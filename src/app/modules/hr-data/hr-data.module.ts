import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { HrDataRoutingModule } from './hr-data-routing.module';
import { ManageHrDataComponent } from './pages/manage-hr-data/manage-hr-data.component';
import { TableHrDataComponent } from './components/table-hr-data/table-hr-data.component';
import { SharedModule } from '@shared/shared.module';
import { HRDataState } from './state/hr-data.state';


@NgModule({
  declarations: [ManageHrDataComponent, TableHrDataComponent],
  imports: [
    CommonModule,
    HrDataRoutingModule,
    SharedModule,
    NgxsModule.forFeature([HRDataState]),

  ]
})
export class HrDataModule { }
