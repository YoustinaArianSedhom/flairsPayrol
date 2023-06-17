import { Component, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrgConfigInst } from '@core/config/organization.config';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { GlobalDeductionModel } from '@modules/entities/model/entities.model';
import { Store } from '@ngxs/store';
import { AddNewGlobalDeduction, UpdateGlobalDeduction } from '@modules/entities/state/entities.actions';

@Component({
  selector: 'app-global-deduction-form',
  templateUrl: './global-deduction-form.component.html',
  styleUrls: ['./global-deduction-form.component.scss']
})
export class GlobalDeductionFormComponent implements OnInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) private _globalDeduction: GlobalDeductionModel,
    private _dialogRef: MatDialogRef<GlobalDeductionFormComponent>,
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _snackbarService: SnackBarsService,
  ) {
    this._initForm();
  }

  public globalDeductionForm!: FormGroup;

  // @SelectSnapshot(OrganizationState.orgName) public readonly orgName: string;


  ngOnInit(): void {
    this._patchForm();
  }

  //! init Form
  private _initForm(): void {
    this.globalDeductionForm = this._formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)]],
      value: [0, [Validators.min(0), Validators.max(100), Validators.required]],
      entityId: [null, Validators.required],
      isApplied: [true]
    });
  }

  // //! Controlling Form according to mode
  // private _controls(): void {
  // }

  private _patchForm() {
    this.globalDeductionForm.patchValue(this._globalDeduction);
  }

  public get isUpdate(): number | boolean {
    return this._globalDeduction.id;
  }

  public cancel() {
    this._dialogRef.close()
  }

  //! submit form
  public submit(): void {
    let action = this.isUpdate ? UpdateGlobalDeduction : AddNewGlobalDeduction;
    this._store.dispatch(new action(this.globalDeductionForm.value))
      .subscribe((result) => {
        this._snackbarService.openSuccessSnackbar({
          message: this.isUpdate ? OrgConfigInst.CRUD_CONFIG.messages.updated(`${this.globalDeductionForm.value.name} global deduction`)
            : OrgConfigInst.CRUD_CONFIG.messages.created(`${this.globalDeductionForm.value.name} global deduction`),
          duration: 5,
          showCloseBtn: false
        })
        this._dialogRef.close()
      });
  }


}
