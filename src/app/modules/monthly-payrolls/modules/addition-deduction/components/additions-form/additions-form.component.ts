import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ApplyAdditions } from '../../state/addition-deduction.actions';
import { AdditionDeductionState } from '../../state/addition-deduction.state';

@Component({
  selector: 'app-additions-form',
  templateUrl: './additions-form.component.html',
  styleUrls: ['./additions-form.component.scss']
})
export class AdditionsFormComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public _addition: any,
    private _dialogRef: MatDialogRef<AdditionsFormComponent>,
    private _store: Store,
    private _snackbarService: SnackBarsService,

  ) { }

  @ViewSelectSnapshot(AdditionDeductionState.AdditionsResponse) public AdditionsResponse: string;

  public enableSubmit = false;
  public additionFile: any;
  public AdditionsSheetModel: any;
  public downloadTemplateLink = '/excel-templates/payroll addition import .xlsx'; 

  public backendError!: {
    errorCode: number
    errorMessage: string
  };



  public submit(): void {
    this._store.dispatch(new ApplyAdditions(this._addition.payrollId, this.additionFile)).subscribe(res => {
      this._snackbarService.openSuccessSnackbar({
        message: `${this.AdditionsResponse.length} Additions were added to specified employees`,
        duration: 5,
        showCloseBtn: false
      })
      this._dialogRef.close();
    })
  }

  public canBeImport($event) {
    this.additionFile = $event.file;
    this.enableSubmit = $event.status;
  }

}
