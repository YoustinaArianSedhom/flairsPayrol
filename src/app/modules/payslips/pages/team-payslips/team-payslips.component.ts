import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { UserState } from '@core/modules/user/state/user.state';
import { payslipTableModeType } from '@modules/payslips/model/payslips.config';
import { ManagerWithSubModel, PayslipsFiltrationModel, TeamPayslipsAggregatesResultModel } from '@modules/payslips/model/payslips.model';
import { PayslipsService } from '@modules/payslips/model/payslips.service';
import { FilterMyTeamPayslips, GetMyTeamPayslips, SearchMyTeamPayslips, GetLastPublishedPayrollDate, ResetFilterMyTeamPayslips, GetTeamPayslipsAggregates, FindSubsWithManagerRoles } from '@modules/payslips/state/payslips.actions';
import { PayslipsState, PayslipsStateModel } from '@modules/payslips/state/payslips.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { downloadFile } from '@shared/helpers/download-file.helper';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { StateOverwrite } from 'ngxs-reset-plugin';
import { AuthorizationState } from '../../../../core/modules/authorization/state/authorization.state';
import { BasicSelectConfigModel } from '../../../../shared/modules/selects/model/selects.model';

@Component({
  selector: 'app-team-payslips',
  templateUrl: './team-payslips.component.html',
  styleUrls: ['./team-payslips.component.scss']
})
export class TeamPayslipsComponent implements OnInit {


  constructor(
    private _store: Store,
    private _payslipsService: PayslipsService,
    private _snackbarService: SnackBarsService
  ) { }

  @ViewSelectSnapshot(PayslipsState.lastPublishedPayrollDate) public lastPublishedPayrollDate: PayslipsFiltrationModel;
  @ViewSelectSnapshot(PayslipsState.teamPayslipsAggregates) public teamPayslipsAggregates: TeamPayslipsAggregatesResultModel;
  @ViewSelectSnapshot(PayslipsState.ManagersWithSubRoles) public managersWithSubRoles: ManagerWithSubModel[];
  @ViewSelectSnapshot(PayslipsState.searchQuery) public searchQuery: string;
  @ViewSelectSnapshot(AuthorizationState.isPL) public isPL: boolean;

  public managerName = this._store.selectSnapshot(UserState.user).profileName;
  public payload: PayslipsFiltrationModel;
  public mode: payslipTableModeType = 'team';
  public range; 
  public payslipsFiltration: PayslipsFiltrationModel;


  @Dispatch() private _filterMyTeamPayslips(filters) {
    return new FilterMyTeamPayslips(filters);
  }
  @Dispatch() private _fireFindSubsWithManagerRoles() {
    return new FindSubsWithManagerRoles()
  }


  ngOnInit(): void {

    if (!this.lastPublishedPayrollDate.from.month)
      this._store.dispatch(new GetLastPublishedPayrollDate());


    this._store.select(PayslipsState.filtration).subscribe(filtration => {
      this.payslipsFiltration = filtration;
      if (filtration.from.month) {
        this.range = {
          start: new Date(filtration.from.year, filtration.from.month, 0),
          end: new Date(filtration.to.year, filtration.to.month, 0)
        }

      }
    });

    this._fireFindSubsWithManagerRoles();
  }


  // if (this.filtration.month) {
  //   const date = dayJS(`'${this.filtration.year}-${this.filtration.month}-25'`).format();
  //   this.dateFilterCTRL.setValue(date);
  //   this.fireGetMyTeamPayslips();
  // } else {
  //   this._payslipsService.getLastPublishedPayrollDate().subscribe(date => {
  //     const dateWrapper = dayJS(date);
  //     this.dateFilterCTRL.setValue(dateWrapper.format());
  //     this.fireFilterTeamPayslips({month: dateWrapper.month() + 1, year: dateWrapper.year()})
  //   })
  // }



  /**
   * Set the value of month and year manually based on the selected month and year
   * close date picker manually to emulate month selection
   *
   */
  public onFilterChange(event) {

    if (event) {
      this.payload = {
        ...this.payslipsFiltration,
        from: { month: new Date(event.start).getMonth() + 1, year: new Date(event.start).getFullYear() },
        to: { month: new Date(event.end).getMonth() + 1, year: new Date(event.end).getFullYear() }
      };
      this._filterMyTeamPayslips(this.payload);
    }
  }

  public resetFilter() {
    this._fireResetFilterTeamPayslips();
  }


  @Dispatch() public fireGetMyTeamPayslips() { return new GetMyTeamPayslips() }
  @Dispatch() public fireSearchTeamPayslips(searchQuery: string) { return new SearchMyTeamPayslips(searchQuery) }
  @Dispatch() public fireFilterTeamPayslips(filtration: PayslipsFiltrationModel) { return new FilterMyTeamPayslips(filtration) }
  @Dispatch() private _fireResetFilterTeamPayslips() { return new ResetFilterMyTeamPayslips() }


  public exportMyTeamsPayslips() {
    const manager = this.managersWithSubRoles.find(manager=> manager.id === this.payslipsFiltration.managerId);
    this._payslipsService.exportTeamPayslipsAsExcel(this.payslipsFiltration).subscribe((data) => {
      if (data) {
        this._snackbarService.openSuccessSnackbar({ message: 'Download successful! File is password protected. To open, enter password provided to your email inbox.' });
        downloadFile(data, 'my-team' + '-from-' + this.payslipsFiltration.from.month + '-' + this.payslipsFiltration.from.year + '-to-' + this.payslipsFiltration.to.month + '-' + this.payslipsFiltration.to.year + (manager ? ` of ${manager.name}` : '') + '.xlsx', 'application/vnd.ms.excel');
      } else {
        this._snackbarService.openFailureSnackbar({ message: data.errorMessage });
      }
    });
  }

  public onManagerChange(ev: MatSelectChange) {
    this.payload = {
      ...this.payslipsFiltration,
      managerId: ev.value
    }
    this.fireFilterTeamPayslips(this.payload)
  }
}
