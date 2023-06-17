import { NgModule } from '@angular/core';
import { AdditionDeductionManageComponent } from './views/addition-deduction-manage/addition-deduction-manage.component';
import { AdditionDeductionRoutingModule } from './addition-deduction-routing.module';
import { AdditionDeductionFormComponent } from './components/addition-deduction-form/addition-deduction-form.component';
import { AdditionDeductionTableComponent } from './components/addition-deduction-table/addition-deduction-table.component';
import { AdditionDeductionListComponent } from './components/addition-deduction-list/addition-deduction-list.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { SharedModule } from '@shared/shared.module';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { AdditionsFormComponent } from './components/additions-form/additions-form.component';
import { AppliedAdditionsComponent } from './components/applied-additions/applied-additions.component';
import { AdditionUploadAdapterComponent } from './components/addition-upload-adapter/addition-upload-adapter.component';
import { ImportDeductionComponent } from './components/import-deduction/import-deduction.component';
import { ViewAppliedDeductionComponent } from './components/view-applied-deduction/view-applied-deduction.component';
import { DeductionUploadAdapterComponent } from './components/deduction-upload-adapter/deduction-upload-adapter.component';


@NgModule({
  declarations: [AdditionDeductionManageComponent, AdditionDeductionFormComponent, AdditionDeductionTableComponent, AdditionDeductionListComponent, AdditionUploadAdapterComponent, AdditionsFormComponent, AppliedAdditionsComponent, ImportDeductionComponent, ViewAppliedDeductionComponent, DeductionUploadAdapterComponent],
  imports: [
    AdditionDeductionRoutingModule,
    FilePickerModule,
    SharedModule,
    InlineSVGModule.forRoot(),
  ]
})
export class AdditionDeductionModule { }
