import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllocationsFormComponent } from './components/allocations-form/allocations-form.component';
import { SharedModule } from '@shared/shared.module';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { SharedComponentsModule } from '@shared/components/shared-components.module';
import { ValidationModule } from '@shared/modules/validation/validation.module';
import { ModalsModule } from '@shared/modules/modals/modals.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@shared/material.module';
import { FilePickerModule } from 'ngx-awesome-uploader';
import { UploadAdapterComponent } from './components/upload-adapter/upload-adapter.component';
import { AppliedAllocationsComponent } from './components/applied-allocations/applied-allocations.component';



@NgModule({
  declarations: [AllocationsFormComponent, UploadAdapterComponent, AppliedAllocationsComponent],
  entryComponents:[AllocationsFormComponent],
  imports: [
    SharedModule,
    SharedComponentsModule,
    MaterialFileInputModule,
    FilePickerModule
  ]
})
export class AllocationsModule { }
