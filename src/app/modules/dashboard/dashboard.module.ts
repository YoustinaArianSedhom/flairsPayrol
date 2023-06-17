import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard/dashboard.component';
import { dashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    dashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
