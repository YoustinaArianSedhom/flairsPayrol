import { PayslipsService } from '@modules/payslips/model/payslips.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { payslipTableModeType } from '@modules/payslips/model/payslips.config';
import { PayslipsFiltrationModel, PayslipsProfileModel, PayslipsSummaryModel } from '@modules/payslips/model/payslips.model';
import { GetProfilePayslips, GetProfilePayslipsSummary } from '@modules/payslips/state/payslips.actions';
import { PayslipsState } from '@modules/payslips/state/payslips.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import {Location} from '@angular/common';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { downloadFile } from '@shared/helpers/download-file.helper';

@Component({
  selector: 'app-profile-payslips',
  templateUrl: './profile-payslips.component.html',
  styles: [
  ]
})
export class ProfilePayslipsComponent implements OnInit {

  constructor(
    private _route: ActivatedRoute,
    private _location: Location,
    private _mainService: PayslipsService,
    private _snackbarService: SnackBarsService
  ) { }

  @ViewSelectSnapshot(PayslipsState.payslipsSummary) public summary: PayslipsSummaryModel;
  public profileId: number = parseInt(this._route.snapshot.params.id, 10);
  public mode: payslipTableModeType = 'profile';
  
  ngOnInit(): void {
    this.fireGetProfilePayslipsSummary();
    this.fireGetProfilePayslips();
  }

  public navigateBack(){
    this._location.back();
  }

  public exportAsExcel(){
    this._mainService.exportProfilePayslipsAsExcel(this.profileId).subscribe((data) => {
      if (data) {
        this._snackbarService.openSuccessSnackbar({ message: 'Download successful! File is password protected. To open, enter password provided to your email inbox.' });
        downloadFile(data, `${this.summary.profileName} payslips.xlsx`, 'application/vnd.ms.excel');
      } else {
        this._snackbarService.openFailureSnackbar({ message: data.errorMessage });
      }
    });
  }


  /**
   * @description Format the needed config object for the dispatched actions
   */
  private _createActionConfig (): PayslipsProfileModel {
    return {
      profileId: this.profileId
    }
  }

  @Dispatch() public fireGetProfilePayslipsSummary() { return new GetProfilePayslipsSummary(this._createActionConfig())}
  @Dispatch() public fireGetProfilePayslips() { return new GetProfilePayslips(this._createActionConfig())}

}
