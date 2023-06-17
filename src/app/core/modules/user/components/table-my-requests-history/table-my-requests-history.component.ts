import { Component, OnInit } from '@angular/core';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { UserState } from '../../state/user.state';
import * as USER_MODELS from '@core/modules/user/model/user.model';
import * as USER_ACTIONS from '@core/modules/user/state/user.actions';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { OrgConfigInst } from '@core/config/organization.config';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { MatDialog } from '@angular/material/dialog';
import { MyRequestDetailsComponent } from '../my-request-details/my-request-details.component';

@Component({
  selector: 'app-table-my-requests-history',
  templateUrl: './table-my-requests-history.component.html',
  styleUrls: ['./table-my-requests-history.component.scss'],
  styles: [
    `
      h1 {
        font-size:1.45rem;
        margin:14px 0;
      }
    
  `]
})
export class TableMyRequestsHistoryComponent implements OnInit {

  constructor(
    private _tableService: TablesService,
    private _matDialog: MatDialog
  ) { }


  @Select(UserState.myWorkflows) public myWorkflows$: USER_MODELS.MyWorkflowsModel[]
  @ViewSelectSnapshot(UserState.pagination) public pagination: PaginationConfigModel;


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
        value: (record: USER_MODELS.MyWorkflowsModel) => {
          return {
            key: OrgConfigInst.CRUD_CONFIG.actions.view,
            label: `${record.workflowTypeName}-${record.readableId}`
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
        value: (record: USER_MODELS.MyWorkflowsModel) => { return record.createdDate },
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
        value: (record: USER_MODELS.MyWorkflowsModel) => { return record.requestStatus },
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
        value: (record: USER_MODELS.MyWorkflowsModel) => { return record.approvalDate },
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
    this._fireGetMyWorkflows();
    this._tableService.setupConfig(this.tableConfig)
  }


   /*_________________________________________________Table Actions__________________________________________________*/
   public mapTableActions({ record, action }) {
    this._matDialog.open(MyRequestDetailsComponent, {
      data: record,
      panelClass: ['FormDialog']
    })
  }

  /*_________________________________________________Actions to be dispatched___________________________________*/

  @Dispatch() private _fireGetMyWorkflows() { return new USER_ACTIONS.GetMyWorkflows() }
  @Dispatch() public firePaginateMyWorkflows(pagination: PaginationConfigModel) { return new USER_ACTIONS.PaginateMyWorkflows(pagination) }
}
