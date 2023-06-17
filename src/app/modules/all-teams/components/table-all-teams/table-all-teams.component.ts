import { Component, OnInit } from '@angular/core';
import { PaginateAllTeams, GetAllTeams, UpdateTeamPaidAllocation } from '@modules/all-teams/state/all-teams.actions';
import { AllTeamsState } from '@modules/all-teams/state/all-teams.state';
import { TeamMemberModel, TeamFiltrationModel } from '@modules/all-teams/model/all-teams.models';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableConfigModel, TableActionModel, TableColumnModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';

@Component({
  selector: 'app-table-all-teams',
  templateUrl: './table-all-teams.component.html',
  styleUrls: ['./table-all-teams.component.scss']
})
export class TableAllTeamsComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,
    private _store: Store,
    private _snackbar: SnackBarsService
  ) { }



  @Select(AllTeamsState.allTeams) public records$: Observable<
    TeamMemberModel[]
  >;
  @ViewSelectSnapshot(AllTeamsState.pagination)
  public pagination!: PaginationConfigModel;
  @ViewSelectSnapshot(AuthorizationState.isITSupport) private _isITSupport:boolean;  

  public tableConfig: TableConfigModel = {
    actionsLabel: 'Actions',
    actions: [],
    keys: ['team_name', 'team_mission', 'manager', 'hr_business_partners', 'paid-allocation'],
    columns: [
      {
        key: 'team_name',
        head: 'Team Name',
        value: (record: TeamMemberModel) => {
          return record.name;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
      },

      {
        key: 'team_mission',
        head: 'Team Mission',
        hidden: false,
        value: (record: TeamMemberModel) => {
          return record.mission;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
          },
        },
      },
      {
        key: 'manager',
        head: 'Manager',
        value: (record: TeamMemberModel) => {
          return record.manager.name;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: 'block',
          },
        },
      },
      {
        key: 'hr_business_partners',
        head: 'HR Business Partners',
        value: (record: TeamMemberModel) => {
          return record.assignedPartners;
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.listOfNames,
      },
      {
        key: 'paid-allocation',
        head: 'Paid Allocation',
        value: (record: TeamMemberModel) => {
          return { key: 'toggle', label: record.paidAllocation };
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          },
        },
        type: TableCellTypes.toggle
      },


    ],
  };

  ngOnInit(): void {
    this._fireGetAllTeamMembersAction();
    this._tablesService.setupConfig(this.tableConfig);
    if(!this._isITSupport){
      this._tablesService.excludeColumn('paid-allocation')
    }

  }

  public mapTableAction({ record, action }: { record: any; action: TableActionModel; }) {
    console.log(action, record)
    if (action.key === 'toggle') {
      this._store.dispatch(new UpdateTeamPaidAllocation(record.id, record.checked)).subscribe(
        () => {
          this._snackbar.openSuccessSnackbar({
            message: `paid allocation status of ${record.name} has been updated successfully`,
            duration: 5
          })
        }
      )
    }
  }

  @Dispatch() public paginate({ pageSize, pageNumber }) {
    return new PaginateAllTeams({ pageNumber, pageSize });
  }

  @Dispatch() private _fireGetAllTeamMembersAction() {
    return new GetAllTeams();
  }

}
