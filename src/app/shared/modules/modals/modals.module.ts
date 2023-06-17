import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from '@shared/material.module';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { FormModalComponent } from './components/form-modal/form-modal.component';


@NgModule({
    declarations: [FormModalComponent, ConfirmationDialogComponent],
    entryComponents:[ConfirmationDialogComponent],
    imports: [MaterialModule, CommonModule],
    exports: [FormModalComponent],
})
export class ModalsModule { }
