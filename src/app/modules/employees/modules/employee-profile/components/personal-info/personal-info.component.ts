import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PermissionsListModel } from '@core/modules/authorization/model/authorization.model';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { ProfileModel } from '@core/modules/user/model/user.model';
import { EmployeeModel } from '@modules/employees/model/employees.model';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalInfoComponent {

  @Input() public employee: EmployeeModel | ProfileModel;
  @Output() public rolesEdit: EventEmitter<boolean> = new EventEmitter();
  @ViewSelectSnapshot(AuthorizationState.permissions) public permissions: PermissionsListModel;

  constructor() { }


  public onEditClicked() {
    this.rolesEdit.emit();
  }

  public dispatchEmployee(id) {
    console.log('employee id', id);
    // this._store.dispatch( new GetEmployeeDetails(id))
  }

}
