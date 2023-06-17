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
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { HttpErrorResponse } from '@angular/common/http';
import {
  searchTeams,
  UnAssignHrTeam,
  GetMyHrTeamMembers,
} from '../../state/hr-management.actions';
import {
  AssignHRModel,
} from '@modules/hr-management/model/hr-management.models';

@Component({
  selector: 'app-modal-unassign-hr',
  templateUrl: './modal-unassign-hr.component.html',
  styleUrls: ['./modal-unassign-hr.component.scss'],
})
export class ModalUnassignHrComponent {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    private _store: Store,
    private readonly _snackBarService: SnackBarsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (this.data.assignedTeams.length) {
      this._initForm();
    }
    this.profileId = this.data.id;
  }

  public assignHrForm: FormGroup;

  public profileId: string;

  public formControls: { [control: string]: AbstractControl | FormControl };


  private _openFailureSnackbar(message: string) {
    this._snackBarService.openFailureSnackbar({
      message,
      duration: 5,
      showCloseBtn: false,
    });
  }

  private _initForm() {
    this.assignHrForm = this._formBuilder.group({
      hrName: [this.data.name],
      teamId: [
        this.data.assignedTeams.length ? this.data.assignedTeams[0].id : '',
        Validators.required,
      ],
      managerName: [
        this.data.assignedTeams.length
          ? this.data.assignedTeams[0].manager.name
          : '',
      ],
    });
    this.formControls = provideReactiveFormGetters(this.assignHrForm, '');
  }

   private _cancel(): void {
    this.dialogRef.close();
  }

  public onTeamSelect(id:string) {
    let selectedTeam = this.data.assignedTeams.filter(
      (team) => team.id === id
    )[0];
    let ManagerName = selectedTeam.manager.name;
    this.formControls.managerName.setValue(ManagerName);
  }

  public submitAssignHrForm() {
    const assignedTeam: AssignHRModel = {
      teamId: this.formControls.teamId.value,
      profileId: +this.profileId,
    };
    this._store.dispatch(new UnAssignHrTeam(assignedTeam)).subscribe(
      () => {},
      //handling errors
      (e: HttpErrorResponse) => {
        if (e.error.errorMessage) {
          this._openFailureSnackbar(e.error.errorMessage);
        }
      },
      //on complete
      () => {
        this._snackBarService.openSuccessSnackbar({
          message: ` ${this.data.name} unassigned successfully`,
          duration: 5,
          showCloseBtn: false,
        });
        this._cancel();
      }
    );
  }


  @Dispatch() public searchTeams(searchQuery: string) {
    return new searchTeams(searchQuery);
  }

  @Dispatch() private _fireGetMyTeamMembersAction() {
    return new GetMyHrTeamMembers();
  }
}
