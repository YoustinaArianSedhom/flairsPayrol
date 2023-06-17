import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from '@modules/layout/model/layout.service';
import { ReportsState, ReportsStateModel } from '@modules/reports/state/reports.state';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import * as REPORTS_MODELS from '@modules/reports/models/reports.model';
import * as REPORTS_ACTIONS from '@modules/reports/state/reports.actions';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { OrgEntityModel } from '@core/modules/organization/model/organization.model';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Store } from '@ngxs/store';
import { GetOrgEntities } from '@core/modules/organization/state/organization.actions';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs/operators';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { GetExpensesReportAsExcel } from '@modules/reports/state/reports.actions';

@Component({
  selector: 'app-manage-reports',
  templateUrl: './manage-reports.component.html',
  styleUrls: ['./manage-reports.component.scss']
})
export class ManageReportsComponent implements OnInit, OnDestroy {

  constructor(
    private _layoutService: LayoutService,
    private _store: Store
  ) { }


  @ViewSelectSnapshot(ReportsState.managersList) public managersList: REPORTS_MODELS.ManagerModel[];
  @ViewSelectSnapshot(ReportsState.filtration) public filtration: REPORTS_MODELS.ReportsFiltrationModel;
  @ViewSelectSnapshot(ReportsState.publishedPayrolls) public publishedPayrolls: REPORTS_MODELS.PublishedPayrollModel[]
  @ViewSelectSnapshot(OrganizationState.entities) public entities: OrgEntityModel[];
  public headInformation = { title: 'Reports' };
  private _managersTypeAhead$ = new Subject<string>();
  public managersControl: FormControl = new FormControl();
  public selectedManager: REPORTS_MODELS.ManagerModel;
  public entitiesSelectConfig: BasicSelectConfigModel = {
    placeholder: "Entities",
    multiple: false,
    value: null,
    options: []
  };

  public publishedPayrollsSelectConfig: BasicSelectConfigModel = {
    placeholder: "Published Payroll",
    multiple: true,
    value: null,
    options: []
  }
  public defaultEntity = null
  public DirectReports = false




  ngOnInit(): void {
    this._layoutService.setTitle(this.headInformation.title);
    this.fireGetOrgEntities();
    this._store.dispatch(new GetOrgEntities()).subscribe(() => { this._setupEntitiesFilter() })
    this._setupEntitiesFilter();
    this._setupManagersAutocomplete();
  }


  private _setupEntitiesFilter() {
    if (this.entities) {
      const options = this.entities.map(({ name, id }) => ({ name, id }));
      const value = options[0].id;
      if(!this.defaultEntity) this.defaultEntity = options[0].id
      this.entitiesSelectConfig = { ...this.entitiesSelectConfig, value, options };
      this._fireFilterAction({ entityId: value });


      this._setUpPublishedPayrollsFilter(value)
    }
  }


  private _setUpPublishedPayrollsFilter(entityId) {
    this._store.dispatch(new REPORTS_ACTIONS.GetPublishedPayrolls(entityId)).subscribe(() => {
      const options = this.publishedPayrolls.map(({ name, id }) => ({ name, id }))
      this.publishedPayrollsSelectConfig = { ...this.publishedPayrollsSelectConfig, options }
    })

  }

  private _setupManagersAutocomplete() {
    this.managersControl.valueChanges
      .pipe(debounceTime(750))
      .subscribe((value: string) => {
        if (typeof value === 'string') this._store.dispatch(new REPORTS_ACTIONS.GetManagersList(value.trim()))
      });
  }


  public displayAutocompleteFn(manager: REPORTS_MODELS.ManagerModel): string {
    return manager && manager.organizationEmail ? manager.organizationEmail : '';
  }


  public fireManagersAutocomplete() {
    this._managersTypeAhead$.next(
      this.managersControl.value
    )
  }
  public onSelectEntity($event) {
    this._fireFilterAction({ entityId: $event.value });
    this._setUpPublishedPayrollsFilter($event.value)


  }

  public onSelectPublishedPayroll($event) {
    this._fireFilterAction({ payrollIds: $event.value })
  }

  public onSelectManager(manager: REPORTS_MODELS.ManagerModel) {
    this.selectedManager = {...manager}
    this._fireFilterAction({ managerId: manager.id })
  }

  public toggleDirectReports($event) {
    this._fireFilterAction({ onlyDirects: $event.checked })
    this.DirectReports = $event.checked
  }

  public resetFilter(){
    this._fireResetFilterAction({ entityId:this.defaultEntity,payrollIds: undefined,onlyDirects:false, managerId: undefined});
    this.managersControl.setValue("");
    this.selectedManager = null;
    this.entitiesSelectConfig = {...this.entitiesSelectConfig,value:this.defaultEntity}
    this.publishedPayrollsSelectConfig = {...this.publishedPayrollsSelectConfig, value:null}
    this.DirectReports = false;
    this._setUpPublishedPayrollsFilter(this.defaultEntity)
  }
  /*___________________________________________Actions to be Dispatched________________________________*/

  @Dispatch() public fireGetOrgEntities() { return new GetOrgEntities() }
  @Dispatch() public fireGetExpensesReportAsExcel() {return new GetExpensesReportAsExcel(this.selectedManager.name)}
  @Dispatch() private _fireFilterAction(filtration: REPORTS_MODELS.ReportsFiltrationModel) { return new REPORTS_ACTIONS.FilterReports(filtration) }
  @Dispatch() private _fireResetFilterAction(filtration: REPORTS_MODELS.ReportsFiltrationModel) { return new REPORTS_ACTIONS.ResetFilterReports(filtration) }



  ngOnDestroy() {
    this._store.dispatch(new StateOverwrite([ReportsState, new ReportsStateModel()]));
  }
}
