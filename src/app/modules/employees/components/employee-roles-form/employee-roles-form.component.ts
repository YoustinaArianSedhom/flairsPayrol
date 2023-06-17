import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { OrgConfigInst } from '@core/config/organization.config';
import { LoadSystemRoles } from '@core/modules/authorization/state/authorization.actions';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { EmployeeModel, openedFromType } from '@modules/employees/model/employees.model';
import { UpdateEmployeeRoles } from '@modules/employees/state/employees.actions';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';

@Component({
  selector: 'app-employee-roles-form',
  templateUrl: './employee-roles-form.component.html',
  styleUrls: ['./employee-roles-form.component.scss']
})
export class EmployeeRolesFormComponent implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<EmployeeRolesFormComponent>,
    @Inject(MAT_DIALOG_DATA) public config: {
      employee: EmployeeModel,
      from: openedFromType
    },
    private _store: Store,
    private _snackbarService: SnackBarsService
  ) { }


  @ViewSelectSnapshot(AuthorizationState.updatableRoles) public updatableRoles: string[];
  @ViewSelectSnapshot(AuthorizationState.nonUpdatableRoles) public nonUpdatableRoles: string[];


  public newRoles: string[] = []

  ngOnInit(): void {
    this._getRoles();
    this.newRoles = [...this.config.employee.roles];
  }



  public submit(): void {
    this._store.dispatch(new UpdateEmployeeRoles({profileId: this.config.employee.id, newRoles: this.newRoles}, this.config.from)).subscribe(() => {
      this._snackbarService.openSuccessSnackbar({
        
        message: OrgConfigInst.CRUD_CONFIG.messages.updated(`Employee Roles`),
        duration: 5,
        // showCloseBtn: true
      })
      this._dialogRef.close();
    });
  }


  public isRoleGranted(role): boolean {
    return this.config.employee.roles.includes(role);
  }

  public onRoleChange($event: MatSlideToggleChange, role: string) {
    if ($event.checked) this.newRoles.push(role);
    else this.newRoles.splice(this.newRoles.indexOf(role), 1)
  }

  public closeDialog(): void {
    this._dialogRef.close();
  }




  @Dispatch() private _getRoles() {
    return new LoadSystemRoles();
  }
  

}
