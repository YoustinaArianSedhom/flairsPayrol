import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { statusesOptions } from '@modules/employees/model/employees.config';
import { FilterEmployees, GetEmployees, ResetFilterEmployees, SearchEmployees } from '@modules/employees/state/employees.actions';
import { EmployeesState } from '@modules/employees/state/employees.state';
import { LayoutService } from '@modules/layout/model/layout.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import * as EMPLOYEE_MODELS from '@modules/employees/model/employees.model'
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import * as EMPLOYEE_ACTIONS from '@modules/employees/state/employees.actions';
@Component({
  selector: 'app-employees-manage',
  templateUrl: './employees-manage.component.html',
  styleUrls:['./employees-manage.component.scss',
  ]
})
export class EmployeesManageComponent implements OnInit {

  constructor(private _store: Store,
    private _layoutService: LayoutService
    ) { }
  @ViewSelectSnapshot(AuthorizationState.allRoles) private _allRoles: string[];
  @ViewSelectSnapshot(EmployeesState.searchQuery) public searchQuery: string;
  public pageTitle = 'User Management';
  public employeeStatuses = statusesOptions;
  public filters = {
    statuses: this._store.selectSnapshot(EmployeesState.filters)
  }
  public employeeStatusesConfig: BasicSelectConfigModel = {
    placeholder: 'Status',
    multiple: true,
    value: this._store.selectSnapshot(EmployeesState.filtration).statuses ?? [] ,
  }
  public rolesOptions: EMPLOYEE_MODELS.UsersRolesModel[];
  public rolesSelectionConfig: BasicSelectConfigModel = {
    placeholder: 'Roles',
    multiple: true,
    value: this._store.selectSnapshot(EmployeesState.filtration).roles ?? []
  }

  ngOnInit(): void {
    // this.getEmployees()
    this.fireGetEmployeesAction()
    this._layoutService.setTitle(this.pageTitle);
    this.rolesOptions = this._allRoles.map(role=> ({id: role, name: role}))
  }

  public search(searchQuery: string): void {
    this.fireFilterAction({searchQuery});
  }

  public onStatusFilterChange(statuses): void {
    this.fireFilterAction({statuses});
  }
  public onRoleSelect(roles: string[]): void{
    this.fireFilterAction({roles})
  }
    

  public resetFilter(){
    this._fireResetFilterAction();
    this.employeeStatusesConfig = {...this.employeeStatusesConfig, value: this._store.selectSnapshot(EmployeesState.filtration).statuses}
    this.rolesSelectionConfig = {...this.rolesSelectionConfig, value: this._store.selectSnapshot(EmployeesState.filtration).roles ?? []}
  }



  // STORE ACTIONS
  @Dispatch() public fireGetEmployeesAction() { return new GetEmployees() }
  @Dispatch() public fireSearchAction(term: string) { return new SearchEmployees(term) }
  @Dispatch() public fireFilterAction(filters: EMPLOYEE_MODELS.FiltrationModel) { return new FilterEmployees(filters) }
  @Dispatch() private _fireResetFilterAction() { return new ResetFilterEmployees() }
}
