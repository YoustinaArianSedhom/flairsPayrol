import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrgConfigInst } from '@core/config/organization.config';
import { ProfileModel } from '@core/modules/user/model/user.model';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ValidationService } from '@shared/modules/validation/validation.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UpdateEmployeePersonalInfo } from '../../state/salary-details.actions';

@Component({
  selector: 'app-personal-info-form',
  templateUrl: './personal-info-form.component.html',
  styles: [
  ]
})
export class PersonalInfoFormComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public  _personalInfo: ProfileModel,
    private _dialogRef: MatDialogRef<PersonalInfoFormComponent>,
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _validationService: ValidationService,
    private _snackbarService: SnackBarsService
  ) {
    this._initForm();
  }

  public personalInfoForm!: FormGroup;
  public backendError!: {
    errors?: string[];
    errorCode: number
    errorMessage: string
  };

  ngOnInit(): void {
    this._patchForm();
  }

  //! init Form
  private _initForm(): void {
    this.personalInfoForm = this._formBuilder.group({
      id: ['', Validators.required],
      nationalId: ['',[
        Validators.maxLength(30)]
      ],
      hrCode: ['',[
        Validators.pattern(/^[a-z 0-9]+$/i),
        Validators.maxLength(20)]
      ],
      medicalInsuranceNumber: ['',[
        Validators.maxLength(30)]
      ],
      socialInsuranceNumber: ['',[
        Validators.maxLength(30)]
      ],
      address: ['',[
        Validators.maxLength(150)]
      ],
      arabicName: ['',[
        Validators.pattern('^[\u0621-\u064A\u0660-\u0669 ]*$'),
        Validators.maxLength(150)]
      ],
    });
  }


      //! patch form
  private _patchForm() {
    this.personalInfoForm.patchValue(this._personalInfo);
  }


  public submit(): void {
    this.backendError = null;
    let body = {}
    for (const key in this.personalInfoForm.getRawValue()) {
      if (this.personalInfoForm.value[key]) {
        body[key] = this.personalInfoForm.value[key]
      }
    }
    this._store.dispatch(new UpdateEmployeePersonalInfo(body))
      .pipe(
        catchError(err => {
          this.backendError = err.error;
          console.log(this.backendError.errors)
          return of('')
        })
      )
      .subscribe((result) => {
        if (!this.backendError) {
          this._snackbarService.openSuccessSnackbar({
            message: OrgConfigInst.CRUD_CONFIG.messages.updated(`personal info`),
            duration: 5,
            showCloseBtn: false
          })
          this._dialogRef.close();
        }
      });
  }

  

}
