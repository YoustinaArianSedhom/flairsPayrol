import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { EmployeesSyncModel } from '../model/employees-sync.model';
import { EmployeesSyncService } from '../model/employees-sync.service';
import { GetSyncDetails, SyncEmployees } from './employees-sync.actions';

export class EmployeesSyncStateModel {
  public syncDetails: EmployeesSyncModel;
}

@Injectable()
@State<EmployeesSyncStateModel>({
  name: 'employeesSync',
})
export class EmployeesSyncState {


  constructor(private _employeesSyncService: EmployeesSyncService) { }


  @Selector()
  public static syncDetails(state: EmployeesSyncStateModel): EmployeesSyncModel {
    return state.syncDetails;
  }

  @Action(SyncEmployees)
  public syncEmployees({ setState }: StateContext<EmployeesSyncStateModel>) {
    return this._employeesSyncService.sync().pipe(
      tap((syncDetails: EmployeesSyncModel) => setState({ syncDetails }))
    )
  }

  @Action(GetSyncDetails)
  public getSyncDetails({ setState }: StateContext<EmployeesSyncStateModel>) {
    return this._employeesSyncService.getSyncDetails().pipe(
      tap((syncDetails: EmployeesSyncModel) => setState({ syncDetails }))
    )
  }



}
