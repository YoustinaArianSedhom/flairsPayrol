import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrgConfigInst } from '@core/config/organization.config';
import { ErrorModel } from '@core/http/apis.model';
import { ProfileLevelSummary, updateEmployeePersonalInfoConfigModel } from '@modules/profiles-levels/model/profiles-levels.model';
import { UpdateProfilePersonalInfo } from '@modules/profiles-levels/state/profiles-levels.actions';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-update-personal-info',
  templateUrl: './update-personal-info.component.html',
  styles: [
  ]
})
export class UpdatePersonalInfoComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public  _personalInfo: ProfileLevelSummary,
    private _dialogRef: MatDialogRef<UpdatePersonalInfoComponent>,
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _snackbarService: SnackBarsService
  ) {
    this._initForm();
  }

  public personalInfoForm!: FormGroup;
  public backendError!: ErrorModel;

  ngOnInit(): void {
    this._patchForm();
  }

  //! init Form
  private _initForm(): void {
    this.personalInfoForm = this._formBuilder.group({
      id: ['', Validators.required],
      nationalId: ['',[
        Validators.pattern(/^[a-z 0-9]+$/i),
        Validators.minLength(0),
        Validators.maxLength(30)]
      ],
      hrCode: ['',[
        Validators.pattern(/^[a-z 0-9]+$/i),
        Validators.minLength(0),
        Validators.maxLength(30)]
      ],
      medicalInsuranceNumber: ['',[
        Validators.pattern(/^[a-z 0-9]+$/i),
        Validators.minLength(0),
        Validators.maxLength(30)]
      ],
      socialInsuranceNumber: ['',[
        Validators.pattern(/^[a-z 0-9]+$/i),
        Validators.minLength(0),
        Validators.maxLength(30)]
      ],
    });
  }


      //! patch form
  private _patchForm() {
    this.personalInfoForm.patchValue(this._personalInfo);
  }


  public submit(): void {
    this.backendError = null;
    const body = {};
    for (const key in this.personalInfoForm.getRawValue()) {
      if (this.personalInfoForm.getRawValue()[key]) {
        body[key] = this.personalInfoForm.getRawValue()[key]
      }
    }
    this._store.dispatch(new UpdateProfilePersonalInfo(body))
      .pipe(
        catchError(err => {
          this.backendError = err.error;
          return throwError(err)
        })
      ).subscribe((result) => {
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
