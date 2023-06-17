import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ValidationService } from './../../../../shared/modules/validation/validation.service';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { HttpErrorResponse } from '@angular/common/http';
import * as teamsActions from '../../state/my-team.actions';

@Component({
  selector: 'app-update-team-details',
  templateUrl: './update-team-details.component.html',
  styleUrls: ['./update-team-details.component.scss'],
})
export class UpdateTeamDetailsComponent {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    private _validatorsService: ValidationService,
    private _store: Store,
    private readonly _snackBarService: SnackBarsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._initForm();
  }

  public editTeamDetailsForm: FormGroup;

  public formControls: { [control: string]: AbstractControl | FormControl };

  private _openFailureSnackbar(message: string) {
    this._snackBarService.openFailureSnackbar({
      message,
      duration: 5,
      showCloseBtn: false,
    });
  }

  private _initForm() {
    this.editTeamDetailsForm = this._formBuilder.group({
      name: [
        this.data.name,
        [
          Validators.required,
          Validators.maxLength(100),
          this._validatorsService.whiteSpacesOnlyValidation(),
        ],
      ],
      mission: [this.data.mission, [Validators.maxLength(1000)]],
    });
    this.formControls = provideReactiveFormGetters(
      this.editTeamDetailsForm,
      ''
    );
  }

  public cancel(): void {
    this.dialogRef.close();
  }



  public editTeamDetails(teamDetails) {
    // return new UpdateMyTeamDetails(teamDetails);
    const newTeamDetails = {
      name: teamDetails.name.trim(),
      mission: teamDetails.mission.trim().length ? teamDetails.mission.trim() : '',
    }
    this._store
      .dispatch(new teamsActions.UpdateMyTeamDetails(newTeamDetails))
      .subscribe(
        () => { },
        //handling errors
        (e: HttpErrorResponse) => {
          if (e.error.errorMessage) {
            this._openFailureSnackbar(e.error.errorMessage);
          }
        },
        //on complete
        () => {
          this._snackBarService.openSuccessSnackbar({
            message: 'Team Details Updated',
            duration: 5,
            showCloseBtn: false,
          });
          this.getMyTeamDetails();
          this.cancel();
        }
      );
  }

  @Dispatch() public getMyTeamDetails() {
    return new teamsActions.GetMyTeamDetails();
  }
}
