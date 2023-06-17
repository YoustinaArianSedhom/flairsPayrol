import { Component, OnInit } from '@angular/core';
import { HRDataState } from '@modules/hr-data/state/hr-data.state';
import { LayoutService } from '@modules/layout/model/layout.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import * as HR_DATA_ACTIONS from '@modules/hr-data/state/hr-data.actions';
import * as HR_DATA_MODELS from '@modules/hr-data/models/hr-data.models'
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { MatSelectChange } from '@angular/material/select';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-manage-hr-data',
  templateUrl: './manage-hr-data.component.html',
  styleUrls: ['./manage-hr-data.component.scss']
})
export class ManageHrDataComponent implements OnInit {

  constructor(private _store: Store, private _layoutService: LayoutService) { }
  public headInformation = { title: 'HR Data' };
  public status = new FormControl([1])

  public HRDepartmentsSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Departments',
    multiple: true,
    value: this._store.selectSnapshot(HRDataState.filter).departmentsCodes ?? [],
  }

  public HRManagersSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Managers',
    multiple: true,
    value: this._store.selectSnapshot(HRDataState.filter).managersIds ?? [],
  }

  @ViewSelectSnapshot(HRDataState.query) public query: string;
  @ViewSelectSnapshot(HRDataState.filter) public filtration: HR_DATA_MODELS.HRDataFilterModel;
  @ViewSelectSnapshot(HRDataState.allProfileStatuses) public statuses: HR_DATA_MODELS.StatusModel[];
  @ViewSelectSnapshot(HRDataState.departments) public departments: HR_DATA_MODELS.DepartmentModel[];
  @ViewSelectSnapshot(HRDataState.managers) public managers: HR_DATA_MODELS.ManagerModel[];

  ngOnInit(): void {
    this._layoutService.setTitle(this.headInformation.title);
    this.fireGetAllProfileStatuses();
    this.fireFindDepartments();
    this.fireFindManagers();
  }
  public resetFilter(){
    this.fireClearFilterHRDataProfiles();
    this.HRDepartmentsSelectConfig = {... this.HRDepartmentsSelectConfig, value: this._store.selectSnapshot(HRDataState.filter).departmentsCodes ?? []}
    this.HRManagersSelectConfig = {... this.HRManagersSelectConfig, value: this._store.selectSnapshot(HRDataState.filter).managersIds ?? []}
    this.status.patchValue([1])
  }

  public filterStatuses(statuses: number[]){
    console.log(statuses)
    this.fireFilterHRDataProfiles({statuses})
  }
  
  public filterDepartments(departmentsCodes: string[]){
    this.fireFilterHRDataProfiles({departmentsCodes})
  }
  
  public fireFilterSearch(query){
    this.fireFilterHRDataProfiles({query})
  }
  
  public fireFilterManager(managersIds:number[]){
    this.fireFilterHRDataProfiles({managersIds})

  }
  
  @Dispatch() public fireGetAllProfileStatuses() { return new HR_DATA_ACTIONS.GetAllProfileStatuses()}
  @Dispatch() public fireFindDepartments() { return new HR_DATA_ACTIONS.FindDepartments()}
  @Dispatch() public fireFindManagers() { return new HR_DATA_ACTIONS.FindManagers()}
  @Dispatch() public fireFilterHRDataProfiles(filter) { return new HR_DATA_ACTIONS.FilterHRDataProfiles(filter) }
  @Dispatch() public fireExportProfilesHRDataToExcel() { return new HR_DATA_ACTIONS.ExportProfilesHRDataToExcel() };
  @Dispatch() public fireClearFilterHRDataProfiles(){ return new HR_DATA_ACTIONS.ClearFilterHRDataProfiles()}
}
