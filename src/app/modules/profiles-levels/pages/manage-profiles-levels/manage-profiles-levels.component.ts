import { Component, OnInit } from '@angular/core';
import { OrgEntityModel, OrgSalaryLevelModel } from '@core/modules/organization/model/organization.model';
import { GetOrgEntities, GetOrgSalaryLevels } from '@core/modules/organization/state/organization.actions';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { LayoutService } from '@modules/layout/model/layout.service';
import { ProfilesLevelsStatusesEnum, ProfileLevels } from '@modules/profiles-levels/model/profiles-levels.config';
import { ProfilesLevelsSummariesFiltrationModel } from '@modules/profiles-levels/model/profiles-levels.model';
import { FilterProfilesLevelsSummaries, GetProfilesLevelsSummaries, ResetProfilesLevelsSummaries, SearchProfilesLevelsSummaries } from '@modules/profiles-levels/state/profiles-levels.actions';
import { ProfilesLevelsState } from '@modules/profiles-levels/state/profiles-levels.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';

@Component({
  selector: 'app-manage-profiles-levels',
  templateUrl: './manage-profiles-levels.component.html',
  styleUrls: ['./manage-profiles-levels.component.scss']
})
export class ManageProfilesLevelsComponent implements OnInit {

  constructor(private readonly _layout: LayoutService,
    private _store: Store) { }


  @ViewSelectSnapshot(ProfilesLevelsState.searchQuery) public searchQuery: string;
  @ViewSelectSnapshot(OrganizationState.salaryLevels) public salaryLevels: OrgSalaryLevelModel[];
  @ViewSelectSnapshot(OrganizationState.entities) public entities: OrgEntityModel[]



  public pageTitle = 'Employees Levels';
  public levelStatuses = ProfileLevels;
  public levelStatusesEnum = ProfilesLevelsStatusesEnum;


  public entitiesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Entity',
    multiple: false,
    value: this._store.selectSnapshot(ProfilesLevelsState.filtration).entityId ?? 1,
  }

  public salaryLevelsSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Salary Level',
    multiple: true,
    value: this._store.selectSnapshot(ProfilesLevelsState.filtration).salaryLevelIds ?? [],
  }

  public levelsStatusesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Level Status',
    multiple: true,
    value: this._store.selectSnapshot(ProfilesLevelsState.filtration).levelStatuses ?? [],
  }

  ngOnInit(): void {
    this.fireGetAction();
    this._fireGetEntitiesAction();
    this._fireGetSalaryLevelsAction();
    this._layout.setTitle(this.pageTitle);
  }





  public filterEntities(entityId: number) {
    return this.fireFilterAction({ entityId })
  }

  public filterLevelsStatuses(levelStatuses: number[]) {
    return this.fireFilterAction({ levelStatuses });
  }

  public filterSalaryLevels(salaryLevelIds: number[]) {
    return this.fireFilterAction({ salaryLevelIds })
  }

  public resetFilter(){
    this._fireResetFilterAction()
    this.entitiesSelectConfig = {
      ...this.entitiesSelectConfig , value :this._store.selectSnapshot(ProfilesLevelsState.filtration).entityId ?? 1
    }
    this.levelsStatusesSelectConfig = {
      ...this.levelsStatusesSelectConfig , value :this._store.selectSnapshot(ProfilesLevelsState.filtration).levelStatuses ?? []
    }
    this.salaryLevelsSelectConfig = {
      ...this.salaryLevelsSelectConfig , value :this._store.selectSnapshot(ProfilesLevelsState.filtration).salaryLevelIds ?? []
    }
    
  }



  // STORE ACTIONS
  @Dispatch() public fireGetAction() { return new GetProfilesLevelsSummaries() }
  @Dispatch() private _fireGetEntitiesAction() { return new GetOrgEntities() }
  @Dispatch() private _fireGetSalaryLevelsAction() { return new GetOrgSalaryLevels() }
  @Dispatch() public fireSearchAction(term: string) { return new SearchProfilesLevelsSummaries(term) }
  @Dispatch() public fireFilterAction(filtration: ProfilesLevelsSummariesFiltrationModel) {
    return new FilterProfilesLevelsSummaries(filtration)
  }
  @Dispatch() private _fireResetFilterAction() {
    return new ResetProfilesLevelsSummaries()
  }

}
