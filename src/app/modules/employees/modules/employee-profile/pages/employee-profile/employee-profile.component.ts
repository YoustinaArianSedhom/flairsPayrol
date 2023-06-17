import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { PermissionsListModel } from '@core/modules/authorization/model/authorization.model';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { EmployeeRolesFormComponent } from '@modules/employees/components/employee-roles-form/employee-roles-form.component';
import { EmployeeModel } from '@modules/employees/model/employees.model';
import { LayoutService } from '@modules/layout/model/layout.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { ClearEmployeeDetails, GetEmployeeDetails } from '../../state/employee-profile.actions';
import { EmployeeProfileState } from '../../state/employee-profile.state';
import {Location} from '@angular/common';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent implements OnInit, OnDestroy {

  constructor(
    private _route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _location: Location
    ) { }
  public pageTitle: String;

  @ViewSelectSnapshot(EmployeeProfileState.employee) public employee: EmployeeModel;
  @ViewSelectSnapshot(AuthorizationState.permissions) public permissions: PermissionsListModel

  ngOnInit(): void {
    this._route.params.subscribe((params) => this.fireGetEmployeeDetails(params.id))

  }

public navigateBack(){
  this._location.back();
}

  public openRolesForm() {

    this._matDialog.open(EmployeeRolesFormComponent, {
      data: {
        employee: this.employee,
        from: 'inside'
      }
    })
  }


  // Actions
  @Dispatch() public fireGetEmployeeDetails(id) {
    return new GetEmployeeDetails(id)
  }
  @Dispatch() public fireClearEmployeeDetails() {
    return new ClearEmployeeDetails()
  }


  ngOnDestroy() {
    this.fireClearEmployeeDetails()
  }


}
