import { Component, OnInit } from '@angular/core';
import { OrgEntityModel } from '@core/modules/organization/model/organization.model';
import { GetOrgEntities } from '@core/modules/organization/state/organization.actions';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { LayoutService } from '@modules/layout/model/layout.service';
import { EmployeeFilterModel } from '@modules/salaries/model/salaries.interface';
import { FilterEmployeeSalarySummaries, FilterEmployeeSalarySummariesByEntityId, GetEmployeeSalarySummaries, ResetEmployeeSalarySummaries, SearchEmployeeSalarySummaries } from '@modules/salaries/state/salaries.actions';
import { EmployeeSalaryDetailsState } from '@modules/salaries/state/salaries.state';
import { insuranceStatus } from '@modules/shared-modules/model/insurance-status';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';

import { Store } from '@ngxs/store';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';

@Component({
  selector: 'app-employees-salaries-list',
  templateUrl: './employees-salaries-list.component.html',
  styles: [
  ]
})
export class EmployeesSalariesListComponent implements OnInit {

  constructor(
    private _store: Store,
    private _layoutService: LayoutService
  ) { }

  public pageTitle = `Employee's Salaries`;


  @ViewSelectSnapshot(OrganizationState.entities) public entities!: OrgEntityModel[];
  @ViewSelectSnapshot(EmployeeSalaryDetailsState.searchQuery) public searchQuery: string;
  @ViewSelectSnapshot(EmployeeSalaryDetailsState.filters) public filters: { entityId: any };
  // @ViewSelectSnapshot(EmployeeSalaryDetailsState.searchQuery) public searchQuery: string;

  options = [];
  value = null;

  public entitiesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Entity',
    multiple: false,
    value: this._store.selectSnapshot(EmployeeSalaryDetailsState.filters).entityId ?? 1,
    options: []
  }

  public statusSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Insurance Status',
    multiple: false,
    value: null,
    options: []
  }
  public status = insuranceStatus

  ngOnInit(): void {
    this.fireGetEmployeesSalaries();
    this._layoutService.setTitle(this.pageTitle)
    this._AdditionDeductionDispatch();
  }

  //! dispatching state actions to get selected values from store
  private _AdditionDeductionDispatch() {
    // There's no need to dispatch this one since it will call filter method
    // this._store.dispatch(new GetEmployeeSalarySummaries)
    this._store.dispatch(new GetOrgEntities());
  }

  public resetFilter(){
    this._resetEmployeesSalaries()
    this.statusSelectConfig = {...this.statusSelectConfig,value:null}
    this.entitiesSelectConfig = {
      ...this.entitiesSelectConfig , value :this._store.selectSnapshot(EmployeeSalaryDetailsState.filters).entityId ?? 1
    }
  }

  public filterStatus(event){
    this.statusSelectConfig = {...this.statusSelectConfig,value:event.value}
    this.fireFilter({insuranceStatusFilter:event.value})
  }

  @Dispatch() public fireGetEmployeesSalaries() {
    return new GetEmployeeSalarySummaries()
  }

  @Dispatch() public search(term: string) {
    return new SearchEmployeeSalarySummaries(term)
  }

  @Dispatch() public filterEntities($event) {
    return new FilterEmployeeSalarySummariesByEntityId({ entityId: $event.value })
  }

  @Dispatch() public fireFilter(filters:EmployeeFilterModel) {
    return new FilterEmployeeSalarySummaries(filters)
  }

  @Dispatch() private _resetEmployeesSalaries() {
    return new ResetEmployeeSalarySummaries()
  }

}
