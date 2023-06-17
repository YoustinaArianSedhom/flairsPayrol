import { GetUploadedDeductions } from './../../state/addition-deduction.actions';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { Observable } from 'rxjs';
import { AppliedDeductionModel } from '../../model/addition-deduction.model';
import { AdditionDeductionState } from '../../state/addition-deduction.state';

@Component({
  selector: 'app-view-applied-deduction',
  templateUrl: './view-applied-deduction.component.html',
  styleUrls: ['./view-applied-deduction.component.scss']
})
export class ViewAppliedDeductionComponent implements OnInit {

  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['employeeEmail','employeeName','deductionName','netAmount'],
    columns: [
      {
        key: 'employeeEmail',
        head: 'Employee Email',
        hidden: false,
        type: TableCellTypes.email,
        value(record:AppliedDeductionModel) { return record.employeeOrganizationEmail },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        }
      },{
        key: 'employeeName',
        head: 'Employee Name',
        hidden: false,
        value(record:AppliedDeductionModel) { return record.employeeName },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      },
      {
        key: 'deductionName',
        head: 'deductions Name',
        hidden: false,
        value(record:AppliedDeductionModel) { return record.deductionType.name },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      },
      {
        key: 'netAmount',
        head: 'Net Amount',
        hidden: false,
        type: TableCellTypes.currency,
        value(record:AppliedDeductionModel) { return record.value },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      }

    ]
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public _deduction: any,
    public _dialogRef: MatDialogRef<ViewAppliedDeductionComponent>,
  ) { }

  @Select(AdditionDeductionState.uploadedDeduction) public uploadedDeduction$: Observable<any[]>;
  @Dispatch() public fireGetUploadedDeductions() { return new GetUploadedDeductions(this._deduction.payrollId) }
  ngOnInit(): void {
    this.fireGetUploadedDeductions()
  }

}
