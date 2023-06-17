import { ApplyDeductionsFromExcel } from './../../state/addition-deduction.actions';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { AdditionDeductionState } from '../../state/addition-deduction.state';

@Component({
  selector: 'app-import-deduction',
  templateUrl: './import-deduction.component.html',
  styleUrls: ['./import-deduction.component.scss']
})
export class ImportDeductionComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public _deduction: any,
    private _dialogRef: MatDialogRef<ImportDeductionComponent>,
    private _store: Store,
    private _snackbarService: SnackBarsService,

  ) { }

  @ViewSelectSnapshot(AdditionDeductionState.applyDeductions) public applyDeductions: string;

  public enableSubmit = true;
  public deductionFile: any;
  public downloadTemplateLink = '/excel-templates/payroll deduction import.xlsx'; 

  public backendError!: {
    errorCode: number
    errorMessage: string
  };



  public submit(): void {
    this._store.dispatch(new ApplyDeductionsFromExcel(this._deduction.payrollId, this.deductionFile)).subscribe(res => {
      this._snackbarService.openSuccessSnackbar({
        message: `${this.applyDeductions.length} Deductions were added to specified employees`,
        duration: 5,
        showCloseBtn: false
      })
      this._dialogRef.close();
    })
  }

  public canBeImport($event) {
    this.deductionFile = $event.file;
    if ($event.results) {
      this.enableSubmit = $event.results.some(result => result.validationErrorMessages?.length);
    } else {
      this.enableSubmit = true
    }
  }

}
