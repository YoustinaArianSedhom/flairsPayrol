import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import * as REPORTS_MODELS from '@modules/reports/models/reports.model';


@Component({
  selector: 'app-addition-deduction-popup',
  templateUrl: './addition-deduction-popup.component.html',
  styleUrls: ['./addition-deduction-popup.component.scss']
})
export class AdditionDeductionPopupComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: { details: REPORTS_MODELS.AdditionDeductionModel[], type: string },

  ) { }

  @SelectSnapshot(OrganizationState.orgName) public orgName: string;

  private readonly _ADDITIONS_TYPE = 'Additions';

  public get isAddition() {
    return this.config.type === this._ADDITIONS_TYPE;
  }


}
