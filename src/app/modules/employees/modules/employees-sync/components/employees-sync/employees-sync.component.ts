import { Component, OnInit } from '@angular/core';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { EmployeesSyncModel } from '../../model/employees-sync.model';
import { GetSyncDetails, SyncEmployees } from '../../state/employees-sync.actions';
import { EmployeesSyncState } from '../../state/employees-sync.state';

@Component({
  selector: 'app-employees-sync',
  templateUrl: './employees-sync.component.html',
  styleUrls: ['./employees-sync.component.scss']
})
export class EmployeesSyncComponent implements OnInit {

  constructor() {}

  @ViewSelectSnapshot(AuthorizationState.isFinance) public isFinance: boolean;
  @ViewSelectSnapshot(EmployeesSyncState.syncDetails) public syncDetails: EmployeesSyncModel;
  ngOnInit() {
    this.getSyncDetails();
  }


  // Action
  @Dispatch() public sync() { return new SyncEmployees()}
  @Dispatch() public getSyncDetails() {return new GetSyncDetails()}
}
