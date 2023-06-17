import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrgConfigInst } from '@core/config/organization.config';
import { ErrorModel } from '@core/http/apis.model';
import { Store } from '@ngxs/store';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ValidationService } from '@shared/modules/validation/validation.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmployeeBankDetailsModel } from '../../model/salary-details.model';
import { UpdateEmployeeBankDetails } from '../../state/salary-details.actions';

@Component({
  selector: 'app-employee-bank-details-form',
  templateUrl: './employee-bank-details-form.component.html',
  styleUrls: ['./employee-bank-details-form.component.scss']
})
export class EmployeeBankDetailsFormComponent implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<EmployeeBankDetailsFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _bankDetails: EmployeeBankDetailsModel,
    private _FB: FormBuilder,
    private _store: Store,
    private _validationService: ValidationService,
    private _snackbarService: SnackBarsService
  ) { }




  public bankDetailsForm: FormGroup = this._FB.group({
    id: [''],
    bankName: ['', [
      Validators.required,
      Validators.pattern(/^[a-z 0-9]+$/i),
      Validators.minLength(2),
      Validators.maxLength(50)
    ]],
    bankAccountName: ['', [
      Validators.required,
      Validators.pattern(/^[a-z ]+$/i),
      Validators.minLength(1),
      Validators.maxLength(50)
    ]],
    bankAccountNumber: [null, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(50),
      this._validationService.bankAccountNumberValidator()
    ]],
  })
  
  public backendError!: ErrorModel;
  public formControls = provideReactiveFormGetters(this.bankDetailsForm);


  ngOnInit(): void {
    this._patchForm();
  }


  private _patchForm() {
    this.bankDetailsForm.patchValue(this._bankDetails);
  }


  public submit(): void {
    this._store.dispatch(new UpdateEmployeeBankDetails(this.bankDetailsForm.value)).pipe(
      catchError((err: HttpErrorResponse) => {
        this.backendError = err.error;
        return throwError(err)
      })
    ).subscribe(() => {
      this._snackbarService.openSuccessSnackbar({
        
        message: OrgConfigInst.CRUD_CONFIG.messages.updated(`Bank Details`),
        duration: 5,
        // showCloseBtn: true
      })
      this._dialogRef.close();
    });
  }


  public closeDialog(): void {
    this._dialogRef.close();
  }

}
