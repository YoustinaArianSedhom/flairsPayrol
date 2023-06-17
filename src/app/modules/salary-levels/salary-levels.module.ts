import { NgModule } from '@angular/core';

import { SalaryLevelsRoutingModule } from './salary-levels-routing.module';
import { SalariesManageComponent } from './pages/salaries-manage/salaries-manage.component';
import { NgxsModule } from '@ngxs/store';
import { SalaryLevelsState } from './state/salary-levels.state';
import { SalaryLevelFormComponent } from './components/salary-level-form/salary-level-form.component';
import { SalaryLevelsTableComponent } from './components/salary-levels-table/salary-levels-table.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [SalariesManageComponent, SalaryLevelFormComponent, SalaryLevelsTableComponent],
  entryComponents: [SalaryLevelFormComponent],
  imports: [
    SalaryLevelsRoutingModule,
    NgxsModule.forFeature([SalaryLevelsState]),

    SharedModule,

  ]
})
export class SalaryLevelsModule { }
