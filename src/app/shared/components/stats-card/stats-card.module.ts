import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsCardComponent } from './stats-card.component';
import { StatsCardWrapperComponent } from './stats-card-wrapper.component';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [StatsCardComponent, StatsCardWrapperComponent],
  imports: [
    CommonModule,
    MatIconModule
  ],
  exports: [StatsCardComponent, StatsCardWrapperComponent]
})
export class StatsCardModule { }
