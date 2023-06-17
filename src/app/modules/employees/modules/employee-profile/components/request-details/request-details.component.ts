import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as EMPLOYEE_PROFILE_MODELS from '@modules/employees/modules/employee-profile/model/employee-profile.model'
import * as EMPLOYEE_PROFILE_ACTIONS from '@modules/employees/modules/employee-profile/state/employee-profile.actions'
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { EmployeeProfileState } from '../../state/employee-profile.state';


@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.scss']
})
export class RequestDetailsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowsModel,
  ) { }

  @ViewSelectSnapshot(EmployeeProfileState.employeeWorkflowDetails) public employeeWorkflowDetails: EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowDetailsModel[]

  ngOnInit(): void {
    this._fireGetEmployeeWorkflowDetails()
  }

  public isLink(value): boolean {
    // console.log(this.employeeWorkflowDetails)

    // console.log(typeof value === "string" && value.includes("https://"), value)


    return typeof value === "string" && value.includes("https://")
  }

  public valueToBeDisplayed(value: any) {

    // console.log(value)
    switch (typeof value) {
      case "number": return parseFloat(value.toFixed(2)).toLocaleString();
      default: return value
    }
  }
  /*_________________________________________________Actions to be dispatched___________________________________________*/
  @Dispatch() private _fireGetEmployeeWorkflowDetails() { return new EMPLOYEE_PROFILE_ACTIONS.GetEmployeeWorkflowDetails(this.data.id) }
}
