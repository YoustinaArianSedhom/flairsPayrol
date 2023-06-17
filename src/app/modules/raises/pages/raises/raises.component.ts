import { RaisesFilterationModel } from '@modules/raises/model/raises';
import {   ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as RAISES_ACTION from '../../state/raises.action'
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { MatDatepicker } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import * as _moment from 'moment';
import { MatCalendar } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { default as _rollupMoment, Moment } from 'moment';


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
  selector: 'app-raises',
  templateUrl: './raises.component.html',
  styleUrls: ['./raises.component.scss'],
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
export class RaisesComponent {
  public exampleHeader = ExampleHeader;

  minDate = new Date(2000, 0)
  maxDate = new Date()
  date = new FormControl(moment().subtract(1, 'month'));
  public raiseFilter: RaisesFilterationModel;
  ngOnInit(): void {

  }

  
  constructor() { }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.raiseFilter = {
      month: normalizedMonthAndYear.month() + 1,
      year: normalizedMonthAndYear.year()
    }
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this._fireFilterRaises(this.raiseFilter)
  }

  public resetFilter() {
    this.date.patchValue(moment().subtract(1, 'month'));
    this._fireResetFilterRaises();
  }

  @Dispatch() public fireExportMyRaises() {
    return new RAISES_ACTION.ExportRaisesDataToExcel()
  }
  @Dispatch() private _fireFilterRaises(filter: RaisesFilterationModel) {
    return new RAISES_ACTION.FilterMyRaises(filter)
  }

  @Dispatch() private _fireResetFilterRaises() {
    return new RAISES_ACTION.ResetFilterRaises()
  }


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