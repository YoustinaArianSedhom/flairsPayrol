import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllocationsFormComponent } from './components/allocations-form/allocations-form.component';

const routes: Routes = [{
  path: '',
  component: AllocationsFormComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllocationsRoutingModule { }
