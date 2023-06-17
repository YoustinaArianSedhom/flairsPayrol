import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { MonthlyPayrollsState } from './../../state/monthly-payrolls.state';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import * as MONTHLY_PAYROLL_MODEL from '@modules/monthly-payrolls/model/monthly-payrolls.model'
import * as MONTHLY_PAYROLL_ACTION from '@modules/monthly-payrolls/state/monthly-payrolls.actions'
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel, TableActionModel } from '@shared/modules/tables/model/tables.model';

@Component({
  selector: 'app-insert-remove-loyalty-bonus-from-payroll',
  templateUrl: './insert-remove-loyalty-bonus-from-payroll.component.html',
  styleUrls: ['./insert-remove-loyalty-bonus-from-payroll.component.scss']
})
export class InsertRemoveLoyaltyBonusFromPayrollComponent implements OnInit, OnDestroy {
  @Select(MonthlyPayrollsState.profileShouldApplied) public profileShouldApplied$: Observable<MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel[]>
  @Select(MonthlyPayrollsState.profileShouldRemovedFromApplied) public profileShouldRemovedFromApplied$: Observable<MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel[]>
  @ViewSelectSnapshot(MonthlyPayrollsState.profileShouldAppliedPagination) public profileShouldAppliedPagination: PaginationConfigModel
  @ViewSelectSnapshot(MonthlyPayrollsState.profileShouldRemovedFromAppliedPagination) public profileShouldRemovedFromAppliedPagination: PaginationConfigModel
  @ViewSelectSnapshot(MonthlyPayrollsState.profileShouldApplied) public profileShouldApplied: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel[]
  @ViewSelectSnapshot(MonthlyPayrollsState.profileShouldRemovedFromApplied) public profileShouldRemovedFromApplied: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel[]
  public applyAndRemoveLoyaltyArr: number[] = []
  public allSelected: boolean = false;

  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['checkbox', 'employeeName', 'employeeEmail', 'gross_value', 'net_value', 'duration', 'deserveLoyaltyBonus', 'reason'],
    columns: [
      {
        key: 'checkbox',
        head: '',
        value: (record: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel) => { return { checked: record?.checked } },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.checkbox
      },
      {
        key: 'employeeName',
        head: 'Employee Name',
        value(record: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel) { return record.name },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: "text-red-500",
          },
        }
      },
      {
        key: 'employeeEmail',
        head: 'Employee Email',
        value(record: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel) { return record.organizationEmail },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        }
      },
      {
        key: 'gross_value',
        head: 'Gross Value',
        value(record: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel) { return record.grossValue },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
        type: TableCellTypes.currency
      },
      {
        key: 'net_value',
        head: 'Net Value',
        value(record: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel) { return record.netValue },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
        type: TableCellTypes.currency
      },
      {
        key: 'duration',
        head: 'Duration (months)',
        value(record: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel) { return record.duration },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      },
      {
        key: 'deserveLoyaltyBonus',
        head: 'Deserve Loyalty Bonus',
        value(record: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel) { return record.isDeserveLoyalty ? 'Yes' : 'No' },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      },
      {
        key: 'reason',
        head: 'Reason',
        hidden: false,
        value(record: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel) { return record.reason },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      },
    ]
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<InsertRemoveLoyaltyBonusFromPayrollComponent>,
    private _store: Store,
    private _snackbarService: SnackBarsService) { }

  ngOnInit(): void {
    if (this.data.action === "insert") {
      this._fireGetProfilesShouldBeApplied()
    } else {
      this._fireGetProfilesShouldBeRemovedFromApplying()
    }
  }

  mapTableAction({ record, action }: { record: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel, action: TableActionModel }) {
    if (action.key === 'checkbox') {
      this.applyAndRemoveLoyaltyArr = []
      this._fireSelectLoyaltyBonusCheckBox(record, action.label)
      if (this.data.action === "insert") {
        this.profileShouldApplied.forEach(item => {
          if (item.checked) {
            this.applyAndRemoveLoyaltyArr.push(item.profileId)
          } else {
            this.applyAndRemoveLoyaltyArr.splice(item.profileId)
          }
        })
      } else {
        this.profileShouldRemovedFromApplied.forEach(item => {
          if (item.checked) {
            this.applyAndRemoveLoyaltyArr.push(item.profileId)
          } else {
            this.profileShouldRemovedFromApplied.splice(item.profileId)
          }
        })

      }
    }
  }

  public onInsertInPayroll() {
    this._store.dispatch(new MONTHLY_PAYROLL_ACTION.ApplyLoyalty(this.data.payrollId, this.applyAndRemoveLoyaltyArr)).subscribe(() => {
      this._snackbarService.openSuccessSnackbar({
        message: `${this.applyAndRemoveLoyaltyArr.length} Bonuses have been Applied to Payroll Successfully`,
        duration: 5,
        showCloseBtn: false,
      })
      this._store.dispatch(new MONTHLY_PAYROLL_ACTION.GetCountOfProfilesShouldBeApplied(this.data.payrollId))
      this.onClose();
      this.applyAndRemoveLoyaltyArr = [];
    })
  }

  public onRemoveFromPayroll() {
    this._store.dispatch(new MONTHLY_PAYROLL_ACTION.RemoveAppliedLoyalty(this.data.payrollId, this.applyAndRemoveLoyaltyArr)).subscribe(() => {
      this._snackbarService.openSuccessSnackbar({
        message: `${this.applyAndRemoveLoyaltyArr.length} Bonuses have been Removed from Payroll Successfully`,
        duration: 5,
        showCloseBtn: false,
      })
      this._store.dispatch(new MONTHLY_PAYROLL_ACTION.GetCountOfProfilesShouldBeRemovedFromApplying(this.data.payrollId))
      this.onClose();
      this.applyAndRemoveLoyaltyArr = [];
    })
  }

  public paginateLoyaltyPage(pagination: PaginationConfigModel) {
    this.allSelected = null
    this.applyAndRemoveLoyaltyArr = []
    if (this.data.action === "insert") {
      this._fireProfilesShouldBeAppliedPagination(pagination, '')
    } else {
      this._fireProfilesShouldBeRemovedFromApplyingPagination(pagination, '')
    }
  }

  public onClose() {
    this._dialogRef.close()
    this.resetPagination()
  }

  public resetPagination() {
    if (this.data.action === "insert") {
      this._fireProfilesShouldBeAppliedPagination({ pageNumber: 0, pageSize: 10 }, 'reset')
    } else {
      this._fireProfilesShouldBeRemovedFromApplyingPagination({ pageNumber: 0, pageSize: 10 }, 'reset')
    }
  }

  public fireSelectAll(value) {
    this.allSelected = value
    this.applyAndRemoveLoyaltyArr = []
    this._fireSelectAllLoyaltyBonusCheckBox(value)
    if (this.data.action === "insert") {
      this.profileShouldApplied.forEach(item => {
        if (item.checked === true) {
          this.applyAndRemoveLoyaltyArr.push(item.profileId)
        } else {
          this.applyAndRemoveLoyaltyArr = []
        }
      })
    } else {
      this.profileShouldRemovedFromApplied.forEach(item => {
        if (item.checked === true) {
          this.applyAndRemoveLoyaltyArr.push(item.profileId)
        } else {
          this.applyAndRemoveLoyaltyArr = []
        }
      })
    }
  }

  @Dispatch() private _fireProfilesShouldBeAppliedPagination(pagination: PaginationConfigModel, action: string) { return new MONTHLY_PAYROLL_ACTION.ProfilesShouldBeAppliedPagination(pagination, this.data.payrollId, action) }
  @Dispatch() private _fireProfilesShouldBeRemovedFromApplyingPagination(pagination: PaginationConfigModel, action: string) { return new MONTHLY_PAYROLL_ACTION.ProfilesShouldBeRemovedFromApplyingPagination(pagination, this.data.payrollId, action) }
  @Dispatch() private _fireGetProfilesShouldBeApplied() { return new MONTHLY_PAYROLL_ACTION.GetProfilesShouldBeApplied(this.data.payrollId) }
  @Dispatch() private _fireGetProfilesShouldBeRemovedFromApplying() { return new MONTHLY_PAYROLL_ACTION.GetProfilesShouldBeRemovedFromApplying(this.data.payrollId) }
  @Dispatch() private _fireSelectLoyaltyBonusCheckBox(task: MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel, checked: any) { return new MONTHLY_PAYROLL_ACTION.SelectLoyaltyBonus(task, checked, this.data.action) }
  @Dispatch() private _fireSelectAllLoyaltyBonusCheckBox(checked: boolean) { return new MONTHLY_PAYROLL_ACTION.SelectAllLoyaltyBonus(checked, this.data.action) }

  ngOnDestroy() {
    this.resetPagination()
  }
}
