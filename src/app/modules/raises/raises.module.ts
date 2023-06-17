import { RaisesState } from './state/raises.state';
import { NgxsModule } from '@ngxs/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RaisesRoutingModule } from './raises-routing.module';
import { RaisesTableComponent } from './components/raises-table/raises-table.component';
import { RaisesComponent, ExampleHeader } from './pages/raises/raises.component';
import { SharedModule } from '@shared/shared.module';
import { NgxMonthPickerModule } from '@flairstechproductunit/flairstech-libs';


@NgModule({
  declarations: [RaisesTableComponent, RaisesComponent,ExampleHeader],
  imports: [
    CommonModule,
    RaisesRoutingModule,
    SharedModule,
    NgxMonthPickerModule,
    NgxsModule.forFeature([RaisesState])
  ]
})
export class RaisesModule { }
