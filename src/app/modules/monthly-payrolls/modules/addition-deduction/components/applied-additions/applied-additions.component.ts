import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select } from '@ngxs/store';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { Observable } from 'rxjs';
import { AppliedAddition, ValidAddition } from '../../model/addition-deduction.model';
import { GetUploadedAdditions } from '../../state/addition-deduction.actions';
import { AdditionDeductionState } from '../../state/addition-deduction.state';

@Component({
  selector: 'app-applied-additions',
  templateUrl: './applied-additions.component.html',
  styleUrls: ['./applied-additions.component.scss']
})
export class AppliedAdditionsComponent implements OnInit {


  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['employeeEmail','employeeName','additionsName','grossAmount'],
    columns: [
      {
        key: 'employeeEmail',
        head: 'Employee Email',
        hidden: false,
        type: TableCellTypes.email,
        value(record:AppliedAddition) { return record.employeeOrganizationEmail },
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
        value(record:AppliedAddition) { return record.employeeName },
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
        key: 'additionsName',
        head: 'Additions Name',
        hidden: false,
        value(record:AppliedAddition) { return record.additionType.name },
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
        key: 'grossAmount',
        head: 'Gross Amount',
        hidden: false,
        type: TableCellTypes.currency,
        value(record:AppliedAddition) { return record.value },
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
    @Inject(MAT_DIALOG_DATA) public _addition: any,
    public _dialogRef: MatDialogRef<AppliedAdditionsComponent>,
  ) { }

  @Select(AdditionDeductionState.uploadedAdditions) public uploadedAdditions$: Observable<any[]>;
  @Dispatch() public fireGetUploadedAdditions() { return new GetUploadedAdditions(this._addition.payrollId) }
  ngOnInit(): void {
    this.fireGetUploadedAdditions()
  }
}
