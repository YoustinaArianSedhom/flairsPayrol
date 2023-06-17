import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrgConfigInst } from '@core/config/organization.config';
import { ErrorModel } from '@core/http/apis.model';
import { SalaryLevelModel } from '@modules/salary-levels/model/salaries-level.model';
import { AddSalaryLevel, UpdateSalaryLevel } from '@modules/salary-levels/state/salary-levels.actions';
import { Store } from '@ngxs/store';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ValidationService } from '@shared/modules/validation/validation.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-salary-level-form',
  templateUrl: './salary-level-form.component.html',
  styleUrls: ['./salary-level-form.component.scss']
})
export class SalaryLevelFormComponent implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<SalaryLevelFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _salaryLevel: SalaryLevelModel,
    private _FB: FormBuilder,
    private _store: Store,
    private _validationService: ValidationService,
    private _snackbarService: SnackBarsService
  ) { }

  public backendError!: ErrorModel;


  public get isEdit(): boolean {
    // return this._salaryLevel.id;
    return true;
  }


  public salaryLevelForm: FormGroup = this._FB.group({
    id: [''],
    name: [{
      value: '',
      disabled: this.isEdit
    }, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50)
    ]],
    from: [null, [
      Validators.required,
      Validators.min(1),
      this._validationService.positiveDoubleValidator()
    ]],
    to: [null, [
      Validators.required,
      Validators.min(1),
      this._validationService.positiveDoubleValidator()
    ]],
    description: [{
      value: '',
      disabled: this.isEdit,
    }, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(500)
    ]]
  }, {
    // Form Group Validators
    validators: this._validationService.rangeValidator({label: 'from', name: 'from'}, {label: 'to', name: 'to'}, true)
  })

  public formControls = provideReactiveFormGetters(this.salaryLevelForm);


  ngOnInit(): void {
    if (this.isEdit) this._patchSalaryForm();
  }


  private _patchSalaryForm() {
    this.salaryLevelForm.patchValue(this._salaryLevel);
  }


  public submit(): void {
    this.backendError = null;
    const actionType = this.isEdit ? UpdateSalaryLevel : AddSalaryLevel;
    const actionMessageType = this.isEdit ? 'updated' : 'created';
    this._store.dispatch(new actionType(this.salaryLevelForm.value))
    .pipe(
      catchError(err => {
        this.backendError = err.error;
        return of('')
      })
    )
    .subscribe((result) => {
      if(!this.backendError){
      this._snackbarService.openSuccessSnackbar({
        message: OrgConfigInst.CRUD_CONFIG.messages[actionMessageType](`"${this._salaryLevel.name}" Salary Level`),
        duration: 5,
        // showCloseBtn: true
      })
      this._dialogRef.close();
      }
    });
  }
  public confirmText(description){

  }

  public closeDialog(): void {
    this._dialogRef.close();
  }



}
