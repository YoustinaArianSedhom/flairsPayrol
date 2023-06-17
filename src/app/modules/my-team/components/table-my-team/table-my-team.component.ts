import { Component, OnInit } from '@angular/core';
import { AuthState } from '@core/auth/state/auth.state';
import { OrgConfigInst } from '@core/config/organization.config';
import { TeamMemberModel } from '@modules/my-team/model/my-team.models';
import { GetMyTeamMembers, PaginateMyTeamMembers } from '@modules/my-team/state/my-team.actions';
import { MyTeamStateSelectors } from '@modules/my-team/state/my-team.selectors';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { config, Observable } from 'rxjs';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { MatDialog } from '@angular/material/dialog';
import { ViewBudgetDetailsModalComponent } from '../view-budget-details-modal/view-budget-details-modal.component';
import { AssignBudgetFormComponent } from '../assign-budget-form/assign-budget-form.component';
import { ViewLoyaltyBonusHistoryComponent } from '../view-loyalty-bonus-history/view-loyalty-bonus-history.component';
import * as MY_TEAM_ACTION from '../../state/my-team.actions';
@Component({
  selector: 'app-table-my-team',
  templateUrl: './table-my-team.component.html',
  styleUrls: ['./table-my-team.component.scss']
})
export class TableMyTeamComponent implements OnInit {


  constructor(
    private _tablesService: TablesService,
    private _matDialog: MatDialog,
    private _store: Store
  ) { }

  public backendError!: {
    errorCode: number
    errorMessage: string
  };



  // @ViewSelectSnapshot(MonthlyPayrollsState.records) public records: MonthlyPayrollModel[];
  @Select(MyTeamStateSelectors.members) public records$: Observable<TeamMemberModel[]>;
  @ViewSelectSnapshot(MyTeamStateSelectors.paginationConfig) public pagination!: PaginationConfigModel;
  @ViewSelectSnapshot(AuthorizationState.isPayrollManager) public isPayrollManager: boolean;

  public tableConfig: TableConfigModel = {
    // disableActionsCell(record) {
    //   return !record.isManager
    // },
    actionsLabel: ' ',
    actions: [
      {
        key: 'view_budget',
        label: 'View Total Budget',
        icon: {
          name: 'view_total_budget',
          isSVG: true,
        },
        disableCondition: (record: TeamMemberModel) => { return !record.isManager }
      },
      {
        key: 'assign_budget',
        label: 'Edit Budget',
        icon: {
          name: 'edit_budget',
          isSVG: true
        },
        disableCondition: (record: TeamMemberModel) => { return !record.isBudgetEditable || !record.isManager}
      },
      {
        key: 'loyalty_bonus_history',
        label: 'Loyalty bonus history',
        icon: {
          name: 'Loyalty_bonus_history',
          isSVG: true,
        },
      }
    ],
    keys: ['profile_name', 'profile_title', 'manager_name', 'salary_level', 'gross_salary', 'net_salary', 'insuranceStatus', 'socialInsurranceAmount', 'employeeInsuranceAmount', 'employment_date','last_loyalty_transferred','last_loyalty_amount','last_loyalty_percentage','next_loyalty','next_loyalty_amount','next_loyalty_percentage', 'actions'],
    columns: [
      // profile_name
      {
        key: 'profile_name',
        head: 'Employee Name',
        value: (record: TeamMemberModel) => { return { title: record.profileName, link: `/employees/view/${record.profileId}` } },
        extraInfoValue: (record: TeamMemberModel) => {
          return record.profileBoardingStatus
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            extraInfoClasses: () => {
              let baseClass = 'block text-xs text-center bg-yellow-300 text-black w-36 px-1 py-1 rounded-md'
              return baseClass
            }
          },
        },
        type: TableCellTypes.linkWithExtraInfo,
      },

      // profile_title
      {
        key: 'profile_title',
        head: 'Title',
        hidden: false,
        value: (record: TeamMemberModel) => { return record.profileTitle },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
      },
      // manager_name
      {
        key: 'manager_name',
        head: 'Manager',
        value: (record: TeamMemberModel) => {
          return {
            title: record.managerName,
            link: `/employees/view/${record.managerId}`
          }
        },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.link
      },
      // salary_level
      {
        key: 'salary_level',
        head: 'Salary Level',
        value: (record: TeamMemberModel) => {
          if (!record.salaryLevel) return "N/A"
          return `${record.salaryLevel?.salaryLevelName} - ${record.salaryLevel?.jobName}`
        },
        extraInfoValue: (record: TeamMemberModel) => {
          if (!record.salaryLevel) return ""
          return `From: ${record.salaryLevel?.from.toLocaleString()} - To: ${record.salaryLevel?.to.toLocaleString()}`
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes: " block text-center",
            extraInfoClasses: (record: TeamMemberModel) => {
              let baseClass = ' text-xs text-center my-1 px-1 block text-center text-gray-400'
              return baseClass
            }
          }
        },
        type: TableCellTypes.extraInfo
      },
      // gross_salary
      {
        key: 'gross_salary',
        head: 'Gross salary',
        value: (record: TeamMemberModel) => {

          return {
            typeWhenExposed: TableCellTypes.currency,
            key: (row: TeamMemberModel) => row.entities[0]?.monthlyGrossSalary
          }
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.secret
      },
      // net_salary
      {
        key: 'net_salary',
        head: 'Net salary',
        value: (record: TeamMemberModel) => {
          return {
            typeWhenExposed: TableCellTypes.currency,
            key: (row: TeamMemberModel) => row.entities[0]?.monthlyNetSalary
          }
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.secret
      },
      // insuranceStatus
      {
        key: 'insuranceStatus',
        head: 'Insurance status',
        value(row: TeamMemberModel) { return row.entities[0]?.insuranceStatus === 1 ? 'Insured' : 'Not Insured' },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
            classes: 'text-center'
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
      },
      // socialInsurranceAmount
      {
        key: 'socialInsurranceAmount',
        head: 'Total insurance amount',
        value(row: TeamMemberModel) { return row.entities[0]?.monthlyTotalInsuranceAmount },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
            classes: 'text-center'
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.currency
      },
      // flairstechInsuranceAmount (This column is hidden)
      // {
      //   key: 'flairstechInsuranceAmount',
      //   head: 'Flairstech  insurance amount',
      //   value(row: TeamMemberModel) { return row.entities[0]?.flairstechInsuranceAmount },
      //   view: {
      //     width: 10,
      //     headCell: {
      //       align: TableCellAligns.center,
      //       classes: 'text-center'
      //     },
      //     bodyCell: {
      //       align: TableCellAligns.center
      //     }
      //   },
      //   type: TableCellTypes.currency
      // },
      // employeeInsuranceAmount
      {
        key: 'employeeInsuranceAmount',
        head: 'Employee insurance amount',
        value(row: TeamMemberModel) { return row.entities[0]?.employeeInsuranceAmount },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
            classes: 'text-center'
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.currency
      },
       // employment date
      {
        key: 'employment_date',
        head: 'Employment Date',
        hidden: false,
        value: (record: TeamMemberModel) => { return record.profileEmploymentDate },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.date
      },
      {
        key: 'last_loyalty_transferred',
        head: 'Last loyalty transferred',
        value: (record: TeamMemberModel) => { return record?.lastLoyaltyTransferred },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.dateMonthYear
      },
      {
        key: 'last_loyalty_amount',
        head: 'Last loyalty amount',
        value(record: TeamMemberModel) { 
          return {
            typeWhenExposed: TableCellTypes.currency,
            key: (row: TeamMemberModel)=>{
              return record.lastLoyaltyAmount
            }
          } 
           
        },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.secret
      },
      {
        key: 'last_loyalty_percentage',
        head: 'Last loyalty percentage',
        value(record: TeamMemberModel) { 
          return {
            key: (row: TeamMemberModel)=>{
              return record?.lastLoyaltyPercentage !== null ? record?.lastLoyaltyPercentage + '%' : record?.lastLoyaltyPercentage
            }
          } 
        },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.secret
      },
      {
        key: 'next_loyalty',
        head: 'Next loyalty transfer',
        value: (record: TeamMemberModel) => { return record?.nextLoyalty },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          },
        },
        type: TableCellTypes.dateMonthYear,
      },
      {
        key: 'next_loyalty_amount',
        head: 'Next loyalty amount',
        // value: (record: TeamMemberModel) => { return record?.nextLoyaltyAmount },
        value(record: TeamMemberModel) { 
          return {
            typeWhenExposed: TableCellTypes.currency,
            key: (row: TeamMemberModel)=>{
              return record.nextLoyaltyAmount
            }
          } 
           
        },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.secret
      },
      {
        key: 'next_loyalty_percentage',
        head: 'Next loyalty percentage',
        value(record: TeamMemberModel) { 
          return {
            key: (row: TeamMemberModel)=>{
              return record?.nextLoyaltyPercentage !== null ? record?.nextLoyaltyPercentage + '%' : record?.nextLoyaltyPercentage 
            }
          } 
        },
        view: {
          width: 25,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.secret
      },


    ]
  }


  ngOnInit(): void {
    this._fireGetMyTeamMembersAction()
    this._tablesService.setupConfig(this.tableConfig);

  }

  public mapTableAction({ record, action }: { record: TeamMemberModel, action: TableActionModel }) {
    if(action.key === 'view_budget'){
      this._store.dispatch(new MY_TEAM_ACTION.GetCurrentMonthlyTeamBudgetByProfileId(record.profileId)).subscribe(()=>{
        this._matDialog.open(ViewBudgetDetailsModalComponent,{
          data: record,
          panelClass: ['FormDialog--small']
        })
      })
    }
    if(action.key === 'assign_budget'){
      this._store.dispatch( new MY_TEAM_ACTION.GetProfileAssignedTeamBudget(record.profileId)).subscribe(()=>{
        this._matDialog.open(AssignBudgetFormComponent,{
          data: record,
          panelClass: ['FormDialog--med']
        })
      })
    }
    if(action.key === 'loyalty_bonus_history'){
      this._store.dispatch(new MY_TEAM_ACTION.GetTeamLoyaltyBonusHistory(record.profileId)).subscribe(()=>{
        this._matDialog.open(ViewLoyaltyBonusHistoryComponent,{
          data: record,
          panelClass: ['FormDialog--small']
        })
      })
    }
  }






  @Dispatch() public paginate({ pageSize, pageNumber }) {
    return new PaginateMyTeamMembers({ pageNumber, pageSize });
  }

  @Dispatch() private _fireGetMyTeamMembersAction() {
    return new GetMyTeamMembers();
  }

}
