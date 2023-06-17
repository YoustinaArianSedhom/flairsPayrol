import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { OrgEntityModel } from '@core/modules/organization/model/organization.model';
import { GetOrgEntities } from '@core/modules/organization/state/organization.actions';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { LayoutService } from '@modules/layout/model/layout.service';
import { FormMonthlyPayrollsComponent } from '@modules/monthly-payrolls/components/form-monthly-payrolls/form-monthly-payrolls.component';
import { monthlyPayrollStatuses } from '@modules/monthly-payrolls/model/monthly-payrolls.config';
import { MonthlyPayrollsFiltrationModel } from '@modules/monthly-payrolls/model/monthly-payrolls.model';
import { FilterMonthlyPayrolls, SearchMonthlyPayrolls } from '@modules/monthly-payrolls/state/monthly-payrolls.actions';
import { MonthlyPayrollsState } from '@modules/monthly-payrolls/state/monthly-payrolls.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-monthly-payrolls',
  templateUrl: './manage-monthly-payrolls.component.html',
  styleUrls: ['./manage-monthly-payrolls.component.scss']
})
export class ManageMonthlyPayrollsComponent implements OnInit {

  constructor(
    private _layoutService: LayoutService,
    private _matDialog: MatDialog
  ) { }


  @ViewSelectSnapshot(MonthlyPayrollsState.searchQuery) public searchQuery: string;
  @ViewSelectSnapshot(MonthlyPayrollsState.filtration) public filtration: MonthlyPayrollsFiltrationModel;
  @Select(OrganizationState.entities) public entities$: Observable<OrgEntityModel[]>

  public pageTitle = 'Monthly Payroll';
  public monthlyPayrollStatuses = monthlyPayrollStatuses;
  public entitiesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Entity',
    multiple: false,
    value: null,
    options: []
  }
  private defaultEntity = null



  ngOnInit(): void {
    this._layoutService.setTitle(this.pageTitle);
    this._setupEntitiesFilter();
    this.fireGetOrgEntities();

  }

 

  private _setupEntitiesFilter() {
   this.entities$.subscribe(entities => {
      if (entities) {
        const options = entities.map(({ name, id }) => ({ name, id }))
        let value;


        // Incase of previous value
        if (this.filtration?.entityId) value = this.filtration.entityId;
        else value = options[0].id;

        if (!this.defaultEntity) this.defaultEntity = options[0].id;
        this.entitiesSelectConfig = { ...this.entitiesSelectConfig, value, options }

      }
    })
  }

  public openMonthlyPayrollForm() {
    this._matDialog.open(FormMonthlyPayrollsComponent)
  }


  // public search(term: string) {
  //   this.fireSearchAction(term);
  // }

  public resetFilter() {
    this.entitiesSelectConfig = { ...this.entitiesSelectConfig, value: this.defaultEntity }
  }

  public filterEntities($event) {
    this.fireFilterAction({ entityId: $event.value })
  }


  public onStatusFilterChange(selectionChange: MatSlideToggleChange, status) {
    status = parseInt(status, 10);
    const currentStatuses = this.filtration.statuses;
    if (selectionChange.checked) return this.fireFilterAction({
      statuses: [...currentStatuses, status]
    })


    this.fireFilterAction({ statuses: currentStatuses.filter(existedStatus => existedStatus !== status) })

  }


  public isStatusSelected(status) {
    return this.filtration?.statuses.includes(parseInt(status, 10))
  }


  // STORE ACTIONS
  @Dispatch() public fireSearchAction(term: string) { return new SearchMonthlyPayrolls(term) }
  @Dispatch() public fireFilterAction(filtration: MonthlyPayrollsFiltrationModel) { return new FilterMonthlyPayrolls(filtration) }
  @Dispatch() public fireGetOrgEntities() { return new GetOrgEntities() }

}
