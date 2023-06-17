import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MonthlyPayrollSummaryModel } from '@modules/monthly-payrolls/model/monthly-payrolls.model';
import { MonthlyPayrollsState } from '@modules/monthly-payrolls/state/monthly-payrolls.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { Observable } from 'rxjs';
import { AppliedAllocation } from '../../model/allocations.model';
import { GetUploadedAllocations } from '../../state/allocations.actions';
import { AllocationsState } from '../../state/allocations.state';

@Component({
  selector: 'app-applied-allocations',
  templateUrl: './applied-allocations.component.html',
  styleUrls: ['./applied-allocations.component.scss']
})
export class AppliedAllocationsComponent implements OnInit {
  public profileId: number;

  public readonly ADDITIONS_DEDUCTIONS_ACTION_KEY = 'additions_deductions';

  public tableConfig: TableConfigModel = {
    actions: [{
      label: 'Additions and Deductions',
      key: this.ADDITIONS_DEDUCTIONS_ACTION_KEY,
      icon: {
        isSVG: false,
        name: 'tune'
      }
    }],
    keys: ['employeeName', 'value', 'days'],
    columns: [
      {
        key: 'employeeName',
        head: 'Employee name',
        hidden: false,
        // type: TableCellTypes.link,
        value(record: AppliedAllocation) { return record.profile.name },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      }, {
        key: 'value',
        head: 'value',
        hidden: false,
        type: TableCellTypes.currency,
        value: (record: AppliedAllocation) => { return record.value },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        }
      }, {
        key: 'days',
        head: 'Days',
        value: (record: AppliedAllocation) => record.days,
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        //use status type temporarily, it should be a new type called number to display value of "0"
        type: TableCellTypes.status
      }, {
        key: 'additionId',
        head: 'additionId',
        hidden: false,
        value: (record: AppliedAllocation) => {
          return record.additionId
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        }
      }
    ]
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public _allocation: any,
    public _dialogRef: MatDialogRef<AppliedAllocationsComponent>,
  ) { }

  @ViewSelectSnapshot(MonthlyPayrollsState.payrollSummary) public payrollSummary: MonthlyPayrollSummaryModel;
  @Select(AllocationsState.uploadedAllocations) public uploadedAllocations$: Observable<AppliedAllocation[]>;
  @Dispatch() public fireGetUploadedAllocations() { return new GetUploadedAllocations(this._allocation.payrollId) }

  ngOnInit(): void {
    this.fireGetUploadedAllocations()
    console.log('MonthlyPayrollSummaryModel', this.payrollSummary);

  }


  public dialogClose() {
    this._dialogRef.close(this.profileId)
  }

  public deleteAllocation() {

  }

}
