import { InsertRemoveLoyaltyBonusFromPayrollComponent } from './../insert-remove-loyalty-bonus-from-payroll/insert-remove-loyalty-bonus-from-payroll.component';
import { ImportDeductionComponent } from './../../modules/addition-deduction/components/import-deduction/import-deduction.component';
import { ViewAppliedDeductionComponent } from './../../modules/addition-deduction/components/view-applied-deduction/view-applied-deduction.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OrgConfigInst } from '@core/config/organization.config';
import { emailNotificationTypes, excelSheetTypes, monthlyPayrollStatuses, MonthlyPayrollStatusesEnum } from '@modules/monthly-payrolls/model/monthly-payrolls.config';
import { exportTypeType, MonthlyPayrollSummaryModel } from '@modules/monthly-payrolls/model/monthly-payrolls.model';
import { MonthlyPayrollsService } from '@modules/monthly-payrolls/model/monthly-payrolls.service';
import { AdditionsFormComponent } from '@modules/monthly-payrolls/modules/addition-deduction/components/additions-form/additions-form.component';
import { AppliedAdditionsComponent } from '@modules/monthly-payrolls/modules/addition-deduction/components/applied-additions/applied-additions.component';
import { DeleteAdditions, DeleteDeduction } from '@modules/monthly-payrolls/modules/addition-deduction/state/addition-deduction.actions';
import { AllocationsFormComponent } from '@modules/monthly-payrolls/modules/allocations/components/allocations-form/allocations-form.component';
import { AppliedAllocationsComponent } from '@modules/monthly-payrolls/modules/allocations/components/applied-allocations/applied-allocations.component';
import { DeleteAllocations } from '@modules/monthly-payrolls/modules/allocations/state/allocations.actions';
import { AllocationsState } from '@modules/monthly-payrolls/modules/allocations/state/allocations.state';
import { MonthlyPayrollsState } from '@modules/monthly-payrolls/state/monthly-payrolls.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AdditionDeductionState } from '../../modules/addition-deduction/state/addition-deduction.state';
import { ViewPayrollSalariesDetailsComponent } from '../view-payroll-salaries-details/view-payroll-salaries-details.component';
import * as MONTHLY_PAYROLL_ACTIONS from '@modules/monthly-payrolls/state/monthly-payrolls.actions'
@Component({
  selector: 'app-monthly-payroll-actions-menu',
  templateUrl: './monthly-payroll-actions-menu.component.html',
  styles: [
  ]
})
export class MonthlyPayrollActionsMenuComponent implements OnInit, OnDestroy {


  constructor(
    private readonly _modals: ModalsService,
    private readonly _snackbars: SnackBarsService,
    private readonly _store: Store,
    private readonly _matDialog: MatDialog,
    private readonly _route: ActivatedRoute,
    private readonly _monthlyPayrollService: MonthlyPayrollsService
  ) { }


  @ViewSelectSnapshot(MonthlyPayrollsState.payrollSummary) public summary: MonthlyPayrollSummaryModel;
  @Select(MonthlyPayrollsState.payrollSummary) public summary$: Observable<MonthlyPayrollSummaryModel>;
  @ViewSelectSnapshot(AllocationsState.changedAllocations) public changedAllocations: number;
  @ViewSelectSnapshot(AdditionDeductionState.changedAdditions) public changedAdditions: number;
  @ViewSelectSnapshot(AdditionDeductionState.deletedAdditions) public deletedAdditions: number;
  @ViewSelectSnapshot(AdditionDeductionState.deletedDeductions) public deletedDeductions: number;
  @ViewSelectSnapshot(MonthlyPayrollsState.transferredPayroll) public transferredPayroll: string;
  @ViewSelectSnapshot(MonthlyPayrollsState.countOfProfileShouldApplied) public countOfProfileShouldApplied: number;
  @ViewSelectSnapshot(MonthlyPayrollsState.countOfProfileShouldRemovedFromApplied) public countOfProfileShouldRemovedFromApplied: number;
  
  public payrollStatusesEnum = MonthlyPayrollStatusesEnum;
  public payrollStatuses = monthlyPayrollStatuses;
  public excelSheetTypes = excelSheetTypes;
  public emailNotificationTypes = emailNotificationTypes;
  public payrollId: number = parseInt(this._route.snapshot.params.id, 10);
  public isEntityEditable: boolean;
  public sub: Subscription
  public currentDate = new Date()


  ngOnInit(): void {
    this.sub = this.summary$.subscribe(summary => {
      if (summary) this.getIsEntityEditable(summary.entity.id);
    })
    this._fireGetCountOfProfileShouldApplied()
    this._fireGetCountOfProfileShouldRemovedFromApplied()
  }


  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }

  /**
   * Open Payroll
   */
  public onOpenPayroll() {
    this._store.dispatch(new MONTHLY_PAYROLL_ACTIONS.OpenMonthlyPayroll(this.payrollId)).subscribe(() =>
      this._snackbars.openSuccessSnackbar({ message: OrgConfigInst.CRUD_CONFIG.messages.opened(this.summary.name) }))
  }

  /**
   * Close Payroll
   */
  public onClosePayroll() {
    this._store.dispatch(new MONTHLY_PAYROLL_ACTIONS.CloseMonthlyPayroll(this.payrollId)).subscribe(() =>
      this._snackbars.openSuccessSnackbar({ message: OrgConfigInst.CRUD_CONFIG.messages.closed(this.summary.name) }))
  }


  /**
   * Delete Payroll
   */
  public onDeletePayroll() {
    this._modals.openConfirmationDialog({
      title: 'Remove payroll',
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.delete(this.summary.name),
      proceedText: OrgConfigInst.CRUD_CONFIG.actions.delete,
      cancelText: 'Keep',
      class: "danger",
    }, () => {
      this._store.dispatch(new MONTHLY_PAYROLL_ACTIONS.DeleteMonthlyPayroll(this.payrollId)).pipe(
        tap(() => {
          this._snackbars.openSuccessSnackbar({ message: OrgConfigInst.CRUD_CONFIG.messages.deleted(this.summary.name) })
          this._store.dispatch(new Navigate(['monthly-payrolls']))
        })
      ).subscribe()
    })
  }

  /**
   * Publish Payroll
   */
  public onPublishPayroll() {
    this._modals.openConfirmationDialog({
      title: 'Publish Payroll',
      content: (this.countOfProfileShouldApplied + this.countOfProfileShouldRemovedFromApplied) > 0 ? `<span class="text-red-500"> ${[this.countOfProfileShouldApplied + this.countOfProfileShouldRemovedFromApplied]} Loyalty changes happened, please make sure to check them before publish the payroll</span><br><br>` + OrgConfigInst.CRUD_CONFIG.confirmationMessages.publish(this.summary.name) : 
      OrgConfigInst.CRUD_CONFIG.confirmationMessages.publish(this.summary.name),
      proceedText: OrgConfigInst.CRUD_CONFIG.actions.publish,
    }, () => {
      this._store.dispatch(new MONTHLY_PAYROLL_ACTIONS.PublishMonthlyPayroll(this.payrollId)).subscribe(() =>
        this._snackbars.openSuccessSnackbar({ message: OrgConfigInst.CRUD_CONFIG.messages.published(this.summary.name) }))
    })
  }

  /* transfer payroll*/
  public onTransferPayroll() {
    this._modals.openConfirmationDialog({
      title: 'Transfer Payroll',
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.transfer(this.summary.name),
      proceedText: OrgConfigInst.CRUD_CONFIG.actions.transfer,
    }, () => {
      this._store.dispatch(new MONTHLY_PAYROLL_ACTIONS.TransferMonthlyPayroll(this.payrollId)).subscribe(() => {
        this._snackbars.openSuccessSnackbar({ message: this.transferredPayroll });
        this.fireGetMonthlyPayrollDetails();
        this.fireGetMonthlyPayrollSummary();
      }, err => {
        console.log(err);
        this._snackbars.openFailureSnackbar({ message: err.message })
      })
    })

  }

  /**
   * Export Payroll
   *
   * @param type type of file
   */
  public onExportPayroll(type: exportTypeType) {
    this._store.dispatch(new MONTHLY_PAYROLL_ACTIONS.ExportMonthlyPayroll({ payrollId: this.summary.id, exportType: type })).subscribe(() =>
      this._snackbars.openSuccessSnackbar({ message: 'File has been exported successfully' }))
  }

  /**
   * Send Payroll Notification
   *
   */
  public onMonthlyPayrollSendNotification(type: number) {
    this._store.dispatch(new MONTHLY_PAYROLL_ACTIONS.SendMonthlyPayrollNotificationViaEmail(this.summary.id, type)).subscribe(() => {
      this._snackbars.openSuccessSnackbar({ message: 'Emails are sent successfully to the employees of this monthly payroll' })
    })
  }

  /**
   * Import Allocation
   */
  public importAllocation() {
    this._matDialog.open(AllocationsFormComponent, {
      data: { payrollId: this.payrollId },
      panelClass: ['FormDialog', 'allocationDialog']
    }).afterClosed().subscribe(res => {
      if (typeof res === 'undefined') {
        this.fireGetMonthlyPayrollDetails();
        this.fireGetMonthlyPayrollSummary();
      }
    })
  }

  /**
   * View Applied Allocation
   *
   */
  public viewAppliedAllocation(payrollId) {
    this._matDialog.open(AppliedAllocationsComponent, {
      data: { payrollId: payrollId },
      panelClass: ['FormDialog', 'allocationDialog']
    }).afterClosed().subscribe(res => {
      if (res) console.log('view imported alloaction', res);

    })
  }

  /**
   * Delete Allocation
   */
  public deleteAllocation() {
    this._modals.openConfirmationDialog({
      title: 'Delete Allocation',
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.delete('Allocation'),
      proceedText: `Confirm ${OrgConfigInst.CRUD_CONFIG.actions.delete}`,
      class: 'danger',
      hint: `By deleting, any single or bulk allocations related to this month will be deleted permanently`,
    }, () => {
      this._store.dispatch(new DeleteAllocations(this.payrollId))
        .subscribe((res) => {
          // console.log('delete allocation', res);
          if (this.changedAllocations > 0) {
            this._snackbars.openSuccessSnackbar({
              message: OrgConfigInst.CRUD_CONFIG.messages.deleted(`${this.changedAllocations} Allocation`),
              duration: 5,
              showCloseBtn: false
            })
          }
          else {
            this._snackbars.openFailureSnackbar({
              message: `There is no Allocations to delete`,
              duration: 5,
              showCloseBtn: false
            })
          }
          this.fireGetMonthlyPayrollDetails();
          this.fireGetMonthlyPayrollSummary();
        })
    })
  }


  /* additions actions */
  // import addition
  public importAddition() {
    this._matDialog.open(AdditionsFormComponent, {
      data: { payrollId: this.payrollId },
      panelClass: ['FormDialog', 'allocationDialog']
    }).afterClosed().subscribe(res => {
      if (typeof res === 'undefined') {
        this.fireGetMonthlyPayrollDetails();
        this.fireGetMonthlyPayrollSummary();
      }
    })
  }

  public openViewMonthlyPayroll() {
    this._store.dispatch(new MONTHLY_PAYROLL_ACTIONS.GetPayrollSalariesSummary(this.payrollId)).subscribe(() => {
      this._matDialog.open(ViewPayrollSalariesDetailsComponent, {
        panelClass: ['FormDialog']
      })
    })
  }

  // View Applied Additions
  public viewAppliedAddition(payrollId) {
    this._matDialog.open(AppliedAdditionsComponent, {
      data: { payrollId: payrollId },
      panelClass: ['FormDialog', 'allocationDialog']
    })
  }

  //Delete Addition
  public deleteAddition() {
    this._modals.openConfirmationDialog({
      title: 'Delete Addition',
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.delete('Addition'),
      proceedText: `Confirm ${OrgConfigInst.CRUD_CONFIG.actions.delete}`,
      class: 'danger',
      hint: `By deleting any single or bulk additions related to this month will be deleted permanently`,
    }, () => {
      this._store.dispatch(new DeleteAdditions(this.payrollId))
        .subscribe((res) => {
          console.log(res)
          if (this.deletedAdditions > 0) {
            this._snackbars.openSuccessSnackbar({
              message: OrgConfigInst.CRUD_CONFIG.messages.deleted(`${this.deletedAdditions <= 1 ? this.deletedAdditions + ' Addition' : this.deletedAdditions + ' Additions'}`),
              duration: 5,
              showCloseBtn: false
            })
          }
          else {
            this._snackbars.openFailureSnackbar({
              message: 'There is no Additions to delete',
              duration: 5,
              showCloseBtn: false
            })
          }
          this.fireGetMonthlyPayrollDetails();
          this.fireGetMonthlyPayrollSummary();
        })
    })
  }


   // View Applied Deductions
   public viewAppliedDeduction(payrollId) {
    this._matDialog.open(ViewAppliedDeductionComponent, {
      data: { payrollId: payrollId },
      panelClass: ['FormDialog', 'allocationDialog']
    })
  }

    //Delete Deduction
    public deleteDeduction() {
      this._modals.openConfirmationDialog({
        title: 'Delete Deduction',
        content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.delete('Deduction'),
        proceedText: `Confirm ${OrgConfigInst.CRUD_CONFIG.actions.delete}`,
        class: 'danger',
        hint: `By deleting any single or bulk Deduction related to this month will be deleted permanently`,
      }, () => {
        this._store.dispatch(new DeleteDeduction(this.payrollId))
          .subscribe((res) => {
            console.log(res)
            if (this.deletedDeductions > 0) {
              this._snackbars.openSuccessSnackbar({
                message: OrgConfigInst.CRUD_CONFIG.messages.deleted(`${this.deletedDeductions <= 1 ? this.deletedDeductions + ' Deduction' : this.deletedDeductions + ' Deductions'}`),
                duration: 5,
                showCloseBtn: false
              })
            }
            else {
              this._snackbars.openFailureSnackbar({
                message: 'There is no Deduction to delete',
                duration: 5,
                showCloseBtn: false
              })
            }
            this.fireGetMonthlyPayrollDetails();
            this.fireGetMonthlyPayrollSummary();
          })
      })
    }
  
    // import Deduction
    public importDeduction() {
      this._matDialog.open(ImportDeductionComponent, {
        data: { payrollId: this.payrollId },
        panelClass: ['FormDialog', 'allocationDialog']
      }).afterClosed().subscribe(res => {
        if (typeof res === 'undefined') {
          this.fireGetMonthlyPayrollDetails();
          this.fireGetMonthlyPayrollSummary();
        }
      })
    }

    public insertLoyaltyBonusFromPayroll() {
      this._matDialog.open(InsertRemoveLoyaltyBonusFromPayrollComponent, {
        data: {action: 'insert' , payrollId: this.payrollId}
      })
    }

    public removeLoyaltyBonusFromPayroll() {
      this._matDialog.open(InsertRemoveLoyaltyBonusFromPayrollComponent, {
        data: {action: 'remove' , payrollId: this.payrollId}
      })
    }

  private getIsEntityEditable(entityId) {
    this._monthlyPayrollService.getIsEntityIsEditable(entityId).subscribe(isEditable => this.isEntityEditable = isEditable)
  }

  public exportLoyaltyBonusDetails() {
    this._store.dispatch(new MONTHLY_PAYROLL_ACTIONS.ExportPayrollLoyaltyDetails(this.summary.id, this.summary.name))
  }



  @Dispatch() public fireGetMonthlyPayrollDetails() { return new MONTHLY_PAYROLL_ACTIONS.GetMonthlyPayrollDetails(this.payrollId) }
  @Dispatch() public fireGetMonthlyPayrollSummary() { return new MONTHLY_PAYROLL_ACTIONS.GetMonthlyPayrollSummary(this.payrollId) }
  @Dispatch() private _fireGetCountOfProfileShouldApplied() { return new MONTHLY_PAYROLL_ACTIONS.GetCountOfProfilesShouldBeApplied(this.payrollId) }
  @Dispatch() private _fireGetCountOfProfileShouldRemovedFromApplied() { return new MONTHLY_PAYROLL_ACTIONS.GetCountOfProfilesShouldBeRemovedFromApplying(this.payrollId) }


}
