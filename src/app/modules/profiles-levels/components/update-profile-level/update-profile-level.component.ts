import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrgConfigInst } from '@core/config/organization.config';
import {  OrgSalaryLevelModel } from '@core/modules/organization/model/organization.model';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { UpdateProfileLevelConfigModel } from '@modules/profiles-levels/model/profiles-levels.model';
import { UpdateProfileLevel } from '@modules/profiles-levels/state/profiles-levels.actions';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-profile-level',
  templateUrl: './update-profile-level.component.html',
  styles: [`:host {
    .mat-dialog-content {
        min-width: 40vw;
    }
}`
  ]
})
export class UpdateProfileLevelComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: UpdateProfileLevelConfigModel,
    private _store: Store,
    private _snacks: SnackBarsService
  ) { }


  @ViewSelectSnapshot(OrganizationState.salaryLevels) public salaryLevels: Observable<OrgSalaryLevelModel[]>

  public selectConfig: BasicSelectConfigModel = {
    multiple: false,
    placeholder: 'Salary Level',
    value: this.config.salaryLevelId,
  }

  public salaryLevelId;
  public selectedSalaryLevelRange;


  public onSalaryLevelChange(id: number) {
    this.salaryLevelId = id;
  }


  public getSelectSalaryLevelRange(salaryLevels: OrgSalaryLevelModel[]) {
    const {from, to} = salaryLevels.find(SL => SL.id === this.salaryLevelId);
    this.selectedSalaryLevelRange = {from, to};
  }

  public submit() {
    console.log({...this.config, salaryLevelId: this.salaryLevelId})
    this._store.dispatch( new UpdateProfileLevel({...this.config, salaryLevelId: this.salaryLevelId})).subscribe(() => {
      this._snacks.openSuccessSnackbar({message: OrgConfigInst.CRUD_CONFIG.messages.updated('Profile Level')})
    })
    // this._store.dispatch(
    //   new UpdateProfileLevel({...this.config, salaryLevelId: this.salaryLevelId})
    //   ).subscribe(() => this._snacks.openSuccessSnackbar({message: OrgConfigInst.CRUD_CONFIG.messages.updated('Profile Level')}))
  }




}
