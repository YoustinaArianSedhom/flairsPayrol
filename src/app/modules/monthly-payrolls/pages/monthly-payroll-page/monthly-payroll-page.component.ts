import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { monthlyPayrollStatuses, MonthlyPayrollStatusesEnum } from '@modules/monthly-payrolls/model/monthly-payrolls.config';
import { MonthlyPayrollsFiltrationModel, MonthlyPayrollSummaryModel, MonthlyPayrollTransferDateModel } from '@modules/monthly-payrolls/model/monthly-payrolls.model';
import { GetPayrollTransferDates, ClearMonthlyPayrollSummaryAndDetails, FilterMonthlyPayrollDetails, GetMonthlyPayrollDetails, GetMonthlyPayrollSummary, ResetFilterMonthlyPayrollDetails, SearchMonthlyPayrollDetails, FilterMonthlyPayrolls, FilterMonthlyPayrollWithTransferDate, FilterMonthlyPayrollWithSuspensionStatus } from '@modules/monthly-payrolls/state/monthly-payrolls.actions';
import { MonthlyPayrollsState } from '@modules/monthly-payrolls/state/monthly-payrolls.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { AllocationsState } from '@modules/monthly-payrolls/modules/allocations/state/allocations.state';
import { MonthlyPayrollActionsMenuComponent } from '@modules/monthly-payrolls/components/monthly-payroll-actions-menu/monthly-payroll-actions-menu.component';
import { BasicSelectConfigModel } from '@shared/modules/selects/model/selects.model';
import { Location } from '@angular/common';
import { insuranceStatus } from '@modules/shared-modules/model/insurance-status';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs/internal/Observable';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-monthly-payroll-page',
  templateUrl: './monthly-payroll-page.component.html',
  styles: []
})
export class MonthlyPayrollPageComponent implements OnInit, OnDestroy {

  constructor(
    private _route: ActivatedRoute,
    private _location: Location
  ) { }


  @ViewSelectSnapshot(MonthlyPayrollsState.payrollSummary) public summary: MonthlyPayrollSummaryModel;
  @ViewSelectSnapshot(AllocationsState.changedAllocations) public changedAllocations: number;
  @ViewSelectSnapshot(MonthlyPayrollsState.detailsSearchQuery) public searchQuery: string;
  @ViewSelectSnapshot(MonthlyPayrollsState.monthlyPayrollTransferDates) public monthlyPayrollTransferDates: MonthlyPayrollTransferDateModel[];
  @Select(MonthlyPayrollsState.monthlyPayrollTransferDates) private _transferDates$: Observable<MonthlyPayrollTransferDateModel[]>
  @ViewChild(MonthlyPayrollActionsMenuComponent) public actionsMenuComponent: MonthlyPayrollActionsMenuComponent;

  public payrollId: number = parseInt(this._route.snapshot.params.id, 10);
  public payrollStatusesEnum = MonthlyPayrollStatusesEnum;
  public payrollStatuses = monthlyPayrollStatuses;
  public pageTitle;
  public transferDate:string = null;
  public showSuspendedOnlyCheckBox:boolean = null;

  public statusSelectConfig: BasicSelectConfigModel = {
    placeholder: 'Insurance Status',
    multiple: false,
    value: null,
    options: []
  }
  public status = insuranceStatus

  ngOnInit(): void {
    this.fireGetMonthlyPayrollSummary();
    this.fireGetMonthlyPayrollDetails();
    this._fireGetPayrollTransferDates();
    this._transferDates$.subscribe(res=>{
      if(res?.length){
        res.map(item=>{
          if(item.isSelected){
            this.transferDate = item.value
          }
        })
      }
    })
  }


  public onMonthlyPayrollToggle() {
    if (this.summary.status === this.payrollStatusesEnum.opened) this.actionsMenuComponent.onClosePayroll()
    else this.actionsMenuComponent.onOpenPayroll();
  }

  public filterStatus(event) {
    this.statusSelectConfig = { ...this.statusSelectConfig, value: event.value }
    this.fireFilter(event.value)
  }

  public resetFilter() {
    this.statusSelectConfig = { ...this.statusSelectConfig, value: null };
    this.transferDate = 'All';
    this.showSuspendedOnlyCheckBox = null
    this.fireResetFilter()
  }

  public navigateBack() {
    this._location.back();
  }

  public onTransferDateChange(ev: MatSelectChange) {
    this.fireFilterMonthlyPayrollWithTransferDate(ev.value)
  }

  public showSuspendedOnly(ev) {
    this.showSuspendedOnlyCheckBox = ev ? true : null
    this._fireFilterMonthlyPayrollWithSuspensionStatus(this.showSuspendedOnlyCheckBox)
  }


  @Dispatch() public search(term: string) { return new SearchMonthlyPayrollDetails(term) }
  @Dispatch() public fireFilter(insuranceStatusFilter: number) { return new FilterMonthlyPayrollDetails(insuranceStatusFilter) }
  @Dispatch() public fireResetFilter() { return new ResetFilterMonthlyPayrollDetails() }
  @Dispatch() public fireGetMonthlyPayrollSummary() { return new GetMonthlyPayrollSummary(this.payrollId) }
  @Dispatch() public fireGetMonthlyPayrollDetails() { return new GetMonthlyPayrollDetails(this.payrollId) }
  @Dispatch() public fireFilterMonthlyPayrollWithTransferDate(transferDateFilter: string ) { return new FilterMonthlyPayrollWithTransferDate(transferDateFilter) }
  @Dispatch() public fireClearMonthlyPayrollSummaryAndDetails() { return new ClearMonthlyPayrollSummaryAndDetails() }
  @Dispatch() private _fireGetPayrollTransferDates() { return new GetPayrollTransferDates(this.payrollId) }
  @Dispatch() private _fireFilterMonthlyPayrollWithSuspensionStatus(suspensionStatusFilter: boolean) {return new FilterMonthlyPayrollWithSuspensionStatus(suspensionStatusFilter)}

  ngOnDestroy() {
    this.fireClearMonthlyPayrollSummaryAndDetails();
  }

}
