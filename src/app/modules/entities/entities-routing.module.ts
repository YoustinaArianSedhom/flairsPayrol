import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntityConfigComponent } from './views/entity-config/entity-config.component';
import { EntitiesListComponent } from './views/entities-list/entities-list.component';
import { EntityDetailsComponent } from './views/entity-details/entity-details.component';

const routes: Routes = [
  {
    path: '',
    component: EntitiesListComponent,
  },
  {
    path: 'view/:id',
    component: EntityDetailsComponent,
    data: {
      page: 'view'
    }
  },
  {
    path: 'config/:id',
    component: EntityConfigComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntitiesRoutingModule { }
