import { NgModule } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { EntitiesListComponent } from './views/entities-list/entities-list.component';
import { EntityFormComponent } from './components/entity-form/entity-form.component';
import { EntitiesRoutingModule } from './entities-routing.module';
import { NgxsModule } from '@ngxs/store';
import { EntitiesState } from './state/entities.state';
import { EntitiesListTableComponent } from './components/entities-list-table/entities-list-table.component'
import { EntityDetailsComponent } from './views/entity-details/entity-details.component';
import { EntityProfilesListTableComponent } from './components/entity-profiles-list-table/entity-profiles-list-table.component';
import { EntityConfigComponent } from './views/entity-config/entity-config.component';
import { GlobalDeductionTableComponent } from './components/global-deduction-table/global-deduction-table.component';
import { GlobalDeductionFormComponent } from './components/global-deduction-form/global-deduction-form.component';
import { GlobalDeductionModule } from './modules/global-deduction/global-deduction.module';
import { SharedModule } from '@shared/shared.module';
import { GlobalAdditionFormComponent } from './components/global-addition-form/global-addition-form.component';
import { GlobalAdditionsDeductionsTableComponent } from './components/global-additions-deductions-table/global-additions-deductions-table.component';



@NgModule({
  declarations: [EntitiesListComponent, EntityFormComponent, EntitiesListTableComponent, EntityDetailsComponent, EntityProfilesListTableComponent, EntityConfigComponent, GlobalDeductionTableComponent, GlobalDeductionFormComponent, GlobalAdditionFormComponent, GlobalAdditionsDeductionsTableComponent],
  entryComponents: [EntityFormComponent],
  providers: [CurrencyPipe],
  imports: [
    EntitiesRoutingModule,
    GlobalDeductionModule,
    
    NgxsModule.forFeature([EntitiesState]),
    SharedModule
  ]
})
export class EntitiesModule { }
