import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { EmployeeProfileState } from '../../state/employee-profile.state';
import * as EMPLOYEE_PROFILE_MODELS from '@modules/employees/modules/employee-profile/model/employee-profile.model'
import * as EMPLOYEE_PROFILE_ACTIONS from '@modules/employees/modules/employee-profile/state/employee-profile.actions'
import { EmployeeModel } from '@modules/employees/model/employees.model';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { OrgConfigInst } from '@core/config/organization.config';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { RequestDetailsComponent } from '../request-details/request-details.component';

@Component({
  selector: 'app-table-employee-history',
  templateUrl: './table-employee-history.component.html',
  styleUrls: ['./table-employee-history.component.scss'],
  styles: [
    `
      h1 {
        font-size:1.45rem;
        margin:14px 0;
      }
    
  `
  ]
})
export class TableEmployeeHistoryComponent implements OnInit {

  constructor(
    private _tableService: TablesService,
    private _matDialog: MatDialog


  ) { }

  @Select(EmployeeProfileState.employeeWorkflows) public employeeWorkflows$: EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowsModel[]
  @ViewSelectSnapshot(EmployeeProfileState.pagination) public pagination: PaginationConfigModel;
  @ViewSelectSnapshot(EmployeeProfileState.employee) private employee: EmployeeModel

  /*_______________________________________SETUP TABLE CONFIG_________________________________*/
  public tableConfig: TableConfigModel = {
    actions: [
      {
        key: OrgConfigInst.CRUD_CONFIG.actions.view,
        label: OrgConfigInst.CRUD_CONFIG.actions.view + ' Details',
        icon: {
          name: 'visibility'
        }
      }]
    ,
    keys: ['request', 'creation-date', 'request-status', 'applied-date', 'actions'],
    columns: [
      {
        key: 'request',
        head: 'Request',
        hidden: false,
        value: (record: EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowsModel) => {
          return {
            key: OrgConfigInst.CRUD_CONFIG.actions.view,
            label: `${record.workflowTypeName}-${record.readableId}`,
          }
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: 'underline cursor-pointer text-primary'
          },
        },
        type: TableCellTypes.eventEmitter

      },
      {
        key: 'creation-date',
        head: 'Creation Date',
        hidden: false,
        value: (record: EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowsModel) => { return record.createdDate },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        },
        type: TableCellTypes.date
      },
      {
        key: 'request-status',
        head: 'Request Status',
        hidden: false,
        value: (record: EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowsModel) => { return record.requestStatus },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        }

      },
      {
        key: 'applied-date',
        head: 'Applied Date',
        hidden: false,
        value: (record: EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowsModel) => { return record.approvalDate },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        },
        type: TableCellTypes.date

      },


    ]
  }

  ngOnInit(): void {
    this._fireGetEmployeeWorkflows();
    this._tableService.setupConfig(this.tableConfig);
  }


  /*_________________________________________________Table Actions__________________________________________________*/
  public mapTableActions({ record, action }) {
    this._matDialog.open(RequestDetailsComponent, {
      data: record,
      panelClass: ['FormDialog']
    })
  }



  /*_________________________________________________Actions to be dispatched___________________________________*/

  @Dispatch() private _fireGetEmployeeWorkflows() { return new EMPLOYEE_PROFILE_ACTIONS.GetEmployeeWorkflows(this.employee.organizationEmail) }
  @Dispatch() public firePaginateEmployeeWorkflows(pagination: PaginationConfigModel) { return new EMPLOYEE_PROFILE_ACTIONS.PaginateEmployeeWorkflows(pagination, this.employee.organizationEmail) }
}
