import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LayoutService } from '@modules/layout/model/layout.service';
import { UpdateTeamDetailsComponent } from '@modules/my-team/components/update-team-details/update-team-details.component';
import * as MY_TEAM_MODELS from '@modules/my-team/model/my-team.models';
import * as MY_TEAM_ACTIONS from '@modules/my-team/state/my-team.actions';
import * as MY_TEAM_CONFIG from '@modules/my-team/model/my-team.config';
import { MyTeamStateSelectors } from '@modules/my-team/state/my-team.selectors';
import { insuranceStatus } from '@modules/shared-modules/model/insurance-status';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import * as _moment from 'moment';
import { MatCalendar } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { default as _rollupMoment, Moment } from 'moment';
import { MyTeamState } from '@modules/my-team/state/my-team.state';
import { MyTeamStateModel } from '@modules/my-team/state/my-team.state.model'
import { StateOverwrite } from 'ngxs-reset-plugin';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';

const moment = _rollupMoment || _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMM , YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-manage-my-team',
  templateUrl: './manage-my-team.component.html',
  styleUrls: ['./manage-my-team.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManageMyTeamComponent implements OnInit, OnDestroy{
  public exampleHeader = ExampleHeader;
  public date = new FormControl(null);
  public minDate = new Date(2000, 0)
  public maxDate = moment().endOf('year').toDate();

  constructor(private _store: Store,
    public dialog: MatDialog,
    private _layoutService: LayoutService,
  ) { }

  public headInformation = { title: 'My Team' };
  public teamDetails: MY_TEAM_MODELS.TeamDetails;

  @ViewSelectSnapshot(MyTeamStateSelectors.searchQuery)
  public searchQuery: string;
  @ViewSelectSnapshot(MyTeamStateSelectors.filtration)
  public filtration: MY_TEAM_MODELS.TeamFiltrationModel;
  @ViewSelectSnapshot(MyTeamStateSelectors.currentBudget)
  public currentBudget: MY_TEAM_MODELS.CurrentBudgetModel;
  @Select(MyTeamStateSelectors.teamDetails)
  public teamDetails$: Observable<MY_TEAM_MODELS.TeamDetails>;

  public myTeamStatuses = MY_TEAM_CONFIG.MyTeamStatus;
  public myTeamStatusesSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Status',
    multiple: true,
    value: this._store.selectSnapshot(MyTeamStateSelectors.filtration).statuses ?? [],
  }

  /**
   * !set the selected date (month, year) and filter table records based on selected date
   * @param ev moment instance that passed and holds the selected date
   * @param datepicker reference for datepicker
   */
  public setMonthAndYear(ev: Moment, datepicker: MatDatepicker<Moment>): void {
    datepicker.close();
    this.date.setValue(moment(ev).utc(true).format());
    this.myTeamFiltrationByDate( ev.utc(true).month()+1, ev.utc(true).year());
  }

  ngOnInit(): void {
    this._layoutService.setTitle(this.headInformation.title);
    this.getMyTeamDetails();
    this.teamDetails$.subscribe((details) => {
      if (details) {
        this.teamDetails = details;
      }
    });
    this._fireGetMyCurrentMonthlyTeamBudget();
  }


  @Dispatch() public fireSearchMyTeamMembersAction(searchQuery: string) {
    return new MY_TEAM_ACTIONS.SearchMyTeamMembers(searchQuery);
  }


  @Dispatch() public toggleDirectReports() {
    return new MY_TEAM_ACTIONS.FilterMyTeamMembers({
      directSubsOnly: !this._store.selectSnapshot(
        MyTeamStateSelectors.filtration
      ).directSubsOnly,
    });
  }

  @Dispatch() public toggleDirectSubRoleManagerOnly() {
    return new MY_TEAM_ACTIONS.FilterMyTeamMembers({
      subsInRoleManagerOnly: !this._store.selectSnapshot(
        MyTeamStateSelectors.filtration
      ).subsInRoleManagerOnly,
    });
  }

  @Dispatch() public myTeamFiltrationByDate(month: number , year: number) {
    return new MY_TEAM_ACTIONS.FilterMyTeamMembers({
      month,
      year,
    })
  }
  @Dispatch() public fireFilterByStatuses(statuses: number[]) {
    return new MY_TEAM_ACTIONS.FilterMyTeamMembers({
      statuses,
    })
  }

  @Dispatch() public fireFilter(filtration: MY_TEAM_MODELS.TeamFiltrationModel) {
    return new MY_TEAM_ACTIONS.FilterMyTeamMembers({
      ...filtration
    });
  }

  @Dispatch() private _fireGetMyCurrentMonthlyTeamBudget() { return new MY_TEAM_ACTIONS.GetMyCurrentMonthlyTeamBudget() }


  public openUpdateTeamDetailsModal(teamDetails: MY_TEAM_MODELS.TeamDetails) {
    const dialogRef = this.dialog.open(UpdateTeamDetailsComponent, {
      data: this.teamDetails,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getMyTeamDetails();
      }
    });
  }

  @Dispatch() public getMyTeamDetails() {
    return new MY_TEAM_ACTIONS.GetMyTeamDetails();
  }

  @Dispatch() private _ResestMyTeamMembers() {
    return new MY_TEAM_ACTIONS.ResestMyTeamMembers();
  }

  @Dispatch() private _fireExportMyTeam() { return new MY_TEAM_ACTIONS.ExportMyTeam() }


  public resetFilter() {
    this._ResestMyTeamMembers();
    this.date.patchValue(null);
    this.myTeamStatusesSelectConfig = {
      ...this.myTeamStatusesSelectConfig , value: this._store.selectSnapshot(MyTeamStateSelectors.filtration).statuses ?? []
    }
  }
  public exportMyTeam() {
    this._fireExportMyTeam()
  }

  public myTeamFiltrationByStatus(statuses: number[]) {
    this.fireFilterByStatuses(statuses);
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    this._store.dispatch(new StateOverwrite([MyTeamState, new MyTeamStateModel()]))
  };


}
/** Custom header component for datepicker. */
@Component({
  selector: 'example-header',
  styles: [`
    .example-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5em;
    }
    ::ng-deep.mat-calendar-body-label{
      opacity: 0;
    }

    ::ng-deep.mat-datepicker-content{
      height: 16rem;
    }
    ::ng-deep.mat-calendar-body-label {
    display: none;
    }
    .example-header-label {
      height: 1em;
      font-weight: 500;
      text-align: center;
      margin:0px 1.5rem;
      font-weight:800;
    }
  `],
  template: `
    <div class="example-header">

      <button mat-icon-button (click)="previousClicked('year')">
      <mat-icon>arrow_back_ios</mat-icon>
        </button>
        <span class="example-header-label text-primary">{{periodLabel}}</span>
        <button mat-icon-button class="example-double-arrow" (click)="nextClicked('year')">
        <mat-icon>arrow_forward_ios</mat-icon>
      </button>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class ExampleHeader<D> implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    private _calendar: MatCalendar<D>, private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats, cdr: ChangeDetectorRef) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter
      .getYear(this._calendar.activeDate)
  }

  previousClicked(mode: 'month' | 'year') {
    this._calendar.activeDate = mode === 'month' ?
      this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1) :
      this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate = mode === 'month' ?
      this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1) :
      this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }
}


