import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Observable } from 'rxjs';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { HttpErrorResponse } from '@angular/common/http';
import {
  searchTeams,
  AssignHrTeam,
} from '../../state/hr-management.actions';
import { MyHrTeamState } from '@modules/hr-management/state/hr-management.state';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  AssignHRModel,
  TeamModel,
} from '@modules/hr-management/model/hr-management.models';

@Component({
  selector: 'app-modal-assign-hr',
  templateUrl: './modal-assign-hr.component.html',
  styleUrls: ['./modal-assign-hr.component.scss'],
})
export class ModalAssignHrComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    private _store: Store,
    private readonly _snackBarService: SnackBarsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this._initForm();
    this.profileId = this.data.id;
  }

  @Select(MyHrTeamState.teams)
  public teams$: Observable<TeamModel[]>;

  public assignHrForm: FormGroup;

  public filteredTeams: TeamModel[];

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
      teamName: ['', Validators.required],
      teamId: ['', Validators.required],
    });
    this.formControls = provideReactiveFormGetters(this.assignHrForm, '');
    this.teams$.subscribe((teams) => {
      if (teams) {
        this.filteredTeams = teams;
      }
    });

    this.assignHrForm
      .get('teamName')
      .valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (typeof value === 'string' && value.trim().length) {
          this.searchTeams(value);
        }
        if (typeof value === 'string' && !value.trim().length) {
          this.filteredTeams = null;
        }
      });
  }

  private _cancel(): void {
    this.dialogRef.close();
  }

  public displayFunction(object) {
    return object ? object.name : object;
  }

  public setTeam(team) {
    this.formControls.teamId.setValue(team.id);
    // this.formControls.managerName.setValue(team.manager.name);
  }

  public clearTeam() {
    this.formControls.teamId.setValue('');
    this.formControls.teamName.setValue('');
    this.filteredTeams = null
  }

  public submitAssignHrForm(values) {
    console.log(values)
    const assignedTeam: AssignHRModel = {
      teamId: values.teamId,
      profileId: +this.profileId,
    };
    console.log("assigned",assignedTeam)
    this._store.dispatch(new AssignHrTeam(assignedTeam)).subscribe(
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
          message: ` ${this.data.name} assigned successfully`,
          duration: 5,
          showCloseBtn: false,
        });
        this._cancel();
      }
    );
  }

  ngOnInit(): void {
  this.filteredTeams = null
  }

  @Dispatch() public searchTeams(searchQuery: string) {
    return new searchTeams(searchQuery);
  }

}
