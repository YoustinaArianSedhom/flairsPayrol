import { Component, OnInit } from '@angular/core';
import { HRTeamMemberModel } from '@modules/hr-management/model/hr-management.models';
import { MyHrTeamState } from '@modules/hr-management/state/hr-management.state';
import {
  GetMyHrTeamMembers,
  PaginateMyHrTeamMembers,
} from '@modules/hr-management/state/hr-management.actions';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import {
  TableCellAligns,
  TableCellTypes,
} from '@shared/modules/tables/model/tables.config';
import {
  TableActionModel,
  TableConfigModel,
} from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import {  Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ModalAssignHrComponent } from '../modal-assign-hr/modal-assign-hr.component';
import { ModalUnassignHrComponent } from '../modal-unassign-hr/modal-unassign-hr.component';

@Component({
  selector: 'app-table-hr-management',
  templateUrl: './table-hr-management.component.html',
  styleUrls: ['./table-hr-management.component.scss'],
})
export class TableHrManagementComponent implements OnInit {
  constructor(
    private _tablesService: TablesService,
    public dialog: MatDialog
  ) {}

  

  @Select(MyHrTeamState.members) public records$: Observable<
    HRTeamMemberModel[]
  >;
  @ViewSelectSnapshot(MyHrTeamState.pagination)
  public pagination!: PaginationConfigModel;

  public tableConfig: TableConfigModel = {
    actionsLabel: 'Actions',
    actions: [
      {
        key:'assign-hr',
        label: 'Assign HR',
        icon: {
          isSVG: true,
          name: 'edit-button',
        },
      },
      {
        key: 'unassign-hr',
        label: 'Unassign HR',
        icon: {
          isSVG: true,
          name: 'delete',
        },
      },
    ],
    keys: ['name', 'mail', 'team', 'actions'],
    columns: [
      {
        key: 'name',
        head: 'Name',
        value: (record: HRTeamMemberModel) => {
          return record.name;
        },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },

      {
        key: 'mail',
        head: 'Mail',
        hidden: false,
        value: (record: HRTeamMemberModel) => {
          return record.organizationEmail;
        },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type:TableCellTypes.email
      },
      {
        key: 'team',
        head: 'Team',
        value: (record: HRTeamMemberModel) => {
          return record.assignedTeams;
        },
        view: {
          width: 40,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            // classes:'block text-center'
          },
        },
        type: TableCellTypes.list,
      },
      
    ],
  };

  ngOnInit(): void {
    this._fireGetMyTeamMembersAction();
    this._tablesService.setupConfig(this.tableConfig);
  }

  public mapTableAction({
    record,
    action,
  }: {
    record: any;
    action: TableActionModel;
  }) {
    if (action.key === 'assign-hr' ) {
      this._openAssignHrModal(record);
    } else if (action.key === 'unassign-hr' ) {
      this._openUnAssignHrModal(record);
    }
  }

  private _openAssignHrModal(record: HRTeamMemberModel) {
    const dialogRef = this.dialog.open(ModalAssignHrComponent, {
      data: record,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.getMyTeamDetails();
    });
  }

 private _openUnAssignHrModal(record: HRTeamMemberModel) {
    const dialogRef = this.dialog.open(ModalUnassignHrComponent, {
      data: record,
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.getMyTeamDetails();
    });
  }

  @Dispatch() public paginate({ pageSize, pageNumber }) {
    return new PaginateMyHrTeamMembers({ pageNumber, pageSize });
  }

  @Dispatch() private _fireGetMyTeamMembersAction() {
    return new GetMyHrTeamMembers();
  }
}
