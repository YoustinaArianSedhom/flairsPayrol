import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as USER_MODELS from '@core/modules/user/model/user.model';
import * as USER_ACTIONS from '@core/modules/user/state/user.actions'
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { UserState } from '../../state/user.state';


@Component({
  selector: 'app-my-request-details',
  templateUrl: './my-request-details.component.html',
  styleUrls: ['./my-request-details.component.scss']
})
export class MyRequestDetailsComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: USER_MODELS.MyWorkflowsModel,
  ) { }

  @ViewSelectSnapshot(UserState.myWorkflowsDetails) public myWorkflowDetails: USER_MODELS.MyWorkflowDetailsModel[]


  ngOnInit(): void {
    this._fireGetMyWorkflowDetails()
  }

  public isLink(value): boolean {
    // console.log(this.employeeWorkflowDetails)

    // console.log(typeof value === "string" && value.includes("https://"), value)


    return typeof value === "string" && value.includes("https://")
  }

  public valueToBeDisplayed(value: any) {
    switch (typeof value) {
      case "number": return parseFloat(value.toFixed(2)).toLocaleString();
      default: return value
    }
  }
  /*_________________________________________________Actions to be dispatched___________________________________________*/
  @Dispatch() private _fireGetMyWorkflowDetails() { return new USER_ACTIONS.GetMyWorkflowDetails(this.data.id) }
}
