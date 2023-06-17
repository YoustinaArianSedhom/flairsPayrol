import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ApplyAllocations } from '../../state/allocations.actions';
import { AllocationsState } from '../../state/allocations.state';


@Component({
  selector: 'app-allocations-form',
  templateUrl: './allocations-form.component.html',
  styleUrls: ['./allocations-form.component.scss']
})
export class AllocationsFormComponent {

  public allocationForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public _allocation: any,
    private _dialogRef: MatDialogRef<AllocationsFormComponent>,
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _snackbarService: SnackBarsService,

  ) {
    // this._initForm()
  }
  @ViewSelectSnapshot(AllocationsState.changedAllocations) public changedAllocations: number;

  public enableSubmit = false;
  public allocationFile: any;
  public AllocationsSheetModel: any;
  public downloadTemplateLink = '/excel-templates/Allocation - payroll.xlsx';


  public backendError!: {
    errorCode: number
    errorMessage: string
  };

  private _initForm(): void {
    this.allocationForm = this._formBuilder.group({
      AllocationsSheet: [this.AllocationsSheetModel, Validators.required],
    });
  }

  public submit(): void {
    console.log('allocation', this.allocationFile)
    this._store.dispatch(new ApplyAllocations(this._allocation.payrollId, this.allocationFile)).subscribe(res => {
      this._snackbarService.openSuccessSnackbar({
        message: `Allocation has been applied successfully on ${this.changedAllocations > 1 ? this.changedAllocations + ' employees' : this.changedAllocations + ' employee'}`,
        duration: 5,
        showCloseBtn: false
      })
      this._dialogRef.close();
    })
  }

  public canBeImport($event) {
    console.log('event', $event)
    this.allocationFile = $event.file;
    this.enableSubmit = $event.status;
  }

}
