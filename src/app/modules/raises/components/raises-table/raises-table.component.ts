import { RaisesState } from './../../state/raises.state';
import { Component, OnInit } from '@angular/core';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { RaisesModel } from '@modules/raises/model/raises';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import * as RAISES_ACTION from '../../state/raises.action';
@Component({
  selector: 'app-raises-table',
  templateUrl: './raises-table.component.html',
  styleUrls: ['./raises-table.component.scss']
})
export class RaisesTableComponent implements OnInit {

  @Select(RaisesState.raises) public records$: Observable<RaisesModel[]>;
  @ViewSelectSnapshot(RaisesState.raisesPagination) public pagination: PaginationConfigModel

  constructor(private _tableService: TablesService) { }

  ngOnInit(): void {
    this._fireGetMyRaises()
    this._tableService.setupConfig(this.tableConfig)
  }

  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['employee_name', 'employee_email', 'entity', 'job',
      'department', 'old_gross_salary', 'new_gross_salary',
      'old_net_salary', 'new_net_salary', 'month_to_be_applied_at',
      'note', 'raise_reason', 'requested_by'],
    columns: [
      {
        key: 'employee_name',
        head: 'Employee Name',
        value: (record: RaisesModel) => { return record.employeeName },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
      },
      {
        key: 'employee_email',
        head: 'Employee email',
        value(record: RaisesModel) { return record.employeeEmail },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.email
      },
      {
        key: 'entity',
        head: 'Entity',
        value(record: RaisesModel) { return record.entityName },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      {
        key: 'job',
        head: 'Job',
        value: (record: RaisesModel) => { return record.jobName },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
      },
      {
        key: 'department',
        head: 'Department',
        value: (record: RaisesModel) => { return record.departmentName },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
      },
      {
        key: 'old_gross_salary',
        head: 'Old Gross Salary',
        value: (record: RaisesModel) => {
          return {
            typeWhenExposed: TableCellTypes.currency,
            key: (row: RaisesModel) => row?.oldGrossSalary
          }
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.secret
      },
      {
        key: 'new_gross_salary',
        head: 'New Gross Salary',
        value: (record: RaisesModel) => {
          return {
            typeWhenExposed: TableCellTypes.currency,
            key: (row: RaisesModel) => row?.newGrossSalary
          }
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.secret
      },
      {
        key: 'old_net_salary',
        head: 'Old Net Salary',
        value: (record: RaisesModel) => {
          return {
            typeWhenExposed: TableCellTypes.currency,
            key: (row: RaisesModel) => row?.oldNetSalary
          }
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.secret
      },
      {
        key: 'new_net_salary',
        head: 'New Net Salary',
        value: (record: RaisesModel) => {
          return {
            typeWhenExposed: TableCellTypes.currency,
            key: (row: RaisesModel) => row?.newNetSalary
          }
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.secret
      },
      {
        key: 'month_to_be_applied_at',
        head: 'Month to be applied at',
        value: (record: RaisesModel) => { return record.appliedMonth },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
      },
      {
        key: 'note',
        head: 'Note',
        value: (record: RaisesModel) => { return record.note },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
      },
      {
        key: 'raise_reason',
        head: 'Raise Reason',
        value: (record: RaisesModel) => { return record.raiseReason },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
      },
      {
        key: 'requested_by',
        head: 'Requested by',
        value: (record: RaisesModel) => { return record.requestedBy },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
      },
    ]
  }


  @Dispatch() private _fireGetMyRaises() {
    return new RAISES_ACTION.GetMyRaisesRequest()
  }
  @Dispatch() public firePaginateRaises(event) {
    return new RAISES_ACTION.PaginateMyRaises(event)
  }

}
