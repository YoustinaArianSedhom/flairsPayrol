import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { payslipTableModeType } from '@modules/payslips/model/payslips.config';
import { PayslipModel } from '@modules/payslips/model/payslips.model';
import { PaginateMyPayslips, PaginateMyTeamPayslips, PaginateProfilePayslips } from '@modules/payslips/state/payslips.actions';
import { PayslipsState } from '@modules/payslips/state/payslips.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { getMonthName } from '@shared/helpers/get-month-name.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableAdditionDeductionCellModel, TableConfigModel, tableTakenActionModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs';
import { AdditionDeductionComponent } from '../addition-deduction-popup/addition-deduction-popup.component';
import { PayslipDetailsComponent } from '../payslip-details/payslip-details.component';


@Component({
  selector: 'app-table-payslip',
  templateUrl: './table-payslip.component.html',
  styleUrls: ['./table-payslip.component.scss'],

})
export class TablePayslipComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,
    private _matDialog: MatDialog,
    private _store: Store,
    private _route: ActivatedRoute
  ) { }

  @Input() public profileId: number = null;
  @Input() public mode: payslipTableModeType = 'self';

  public get isTeamMode(): boolean {
    return this.mode === 'team';
  }

  private get isProfileMode(): boolean {
    return this.mode === 'profile';
  }



  @Select(PayslipsState.payslips) public records$: Observable<PayslipModel[]>;
  @Select(PayslipsState.teamPayslips) public teamRecords$: Observable<PayslipModel[]>;
  @ViewSelectSnapshot(PayslipsState.myPayslipsPagination) public pagination!: PaginationConfigModel;
  @ViewSelectSnapshot(PayslipsState.teamPayslipsPagination) public teamPagination!: PaginationConfigModel;
  @ViewSelectSnapshot(PayslipsState.profilePayslipsPagination) public profilePagination!: PaginationConfigModel;



  public tableConfig: TableConfigModel = {
    actions: [],
    keys: ['month', 'gross_salary', 'additions', 'global_additions', 'loyalty_bonus', 'net_salary', 'deductions', 'global_deductions', 'total_paid_salary', 'more'],
    columns: [
      {
        key: 'employee_name',
        head: 'Employee Name',
        value: (record: PayslipModel) => {
          if (this.isTeamMode) return {
            title: record.profileName,
            link: `/payslips/view/${record.profileId}`
          }
          return { title: record.profileName, link: `/payslips/view/${record.profileId}` }
        },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.link
      },
      {
        key: 'employee_title',
        head: 'Employee Title',
        value(record: PayslipModel) { return record.profileTitle },
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
        key: 'manager_name',
        head: 'Manager Name',
        value(record: PayslipModel) { return record.managerName },
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
        key: 'manager_email',
        head: 'Manager Email',
        type: TableCellTypes.email,
        value(record: PayslipModel) { return record.managerOrganizationEmail },
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
      // date
      {
        key: 'month',
        head: 'Month',
        value: (record: PayslipModel) => { return `${getMonthName(record.month)} ${record.year}` },
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
      // gross_salary
      {
        key: 'gross_salary',
        head: 'Gross Salary',
        value: (record: PayslipModel) => {
          return {
            typeWhenExposed: TableCellTypes.currency,
            key: (row: PayslipModel) => row?.totalMonthlyGrossSalary
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
      //Actual gross_salary
      {
        key: 'actual_total_monthly_gross_salary',
        head: 'Actual Total Gross Salary',
        value: (record: PayslipModel) => {
          return {
            typeWhenExposed: TableCellTypes.currency,
            key: (row: PayslipModel) => row?.actualTotalMonthlyGrossSalary
          }
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
            classes: 'pr-2'
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.secret
      },
      // additions
      {
        key: 'additions',
        head: 'Additions',
        value: (record: PayslipModel) => {
          return {
            typeWhenExposed: TableCellTypes.additionAndDeduction,
            key: ()=>{
              return { 
                value: record.totalAdditions,
                details: record.additions,
                action: this.additionDeductionAction,
                type: 'Additions',
              }
            }
          }
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.secret
      },
      //Global Additions
      {
        key: 'global_additions',
        head: 'Global Additions',
        hidden: false,
        value: (record: PayslipModel) => {
          let globalAdditions = [];
          if (record.globalAdditions.length) globalAdditions = record.globalAdditions.map(item => item);
          return {
            typeWhenExposed: TableCellTypes.additionAndDeduction,
            key: (row: PayslipModel) => {
              return {
                value: record.totalGlobalAdditions,
                details: [...globalAdditions],
                type: 'globalAdditions',
                action: this.additionDeductionAction,
              }
            }
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
      //Loyalty Bonus
      {
        key: 'loyalty_bonus',
        head: 'Loyalty Bonus',
        hidden: false,
        value(record: PayslipModel) { 
          return {
            typeWhenExposed: TableCellTypes.currency,
            key: (row: PayslipModel)=>{
              return record.loyaltyGrossValue
            }
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
      // net_salary
      {
        key: 'net_salary',
        head: 'Net salary',
        hidden: false,
        value: (record: PayslipModel) => {
          return {
            typeWhenExposed: TableCellTypes.currency,
            key: (row: PayslipModel) => row.totalMonthlyNetSalary
          }
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.secret
      },

      // deductions
      {
        key: 'deductions',
        head: 'Deductions',
        hidden: false,
        value: (record: PayslipModel): TableAdditionDeductionCellModel => {
          return { value: record.totalDeductions, details: record.deductions, type: 'Deductions', action: this.additionDeductionAction }
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
        type: TableCellTypes.additionAndDeduction
      },
      {
        key: 'global_deductions',
        head: 'Global Deductions',
        hidden: false,
        value: (record: PayslipModel): TableAdditionDeductionCellModel => {
          let globalDeductions = [];
          if (record.globalDeductions.length) globalDeductions = this._mapGlobalDeductions([...record.globalDeductions]);
          return {
            value: record.totalGlobalDeductions,
            details: [...globalDeductions],
            type: 'Global Deductions',
            action: this.additionDeductionAction
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
        type: TableCellTypes.additionAndDeduction
      },
      // total_paid_salary
      {
        key: 'total_paid_salary',
        head: 'Total Paid',
        value(record: PayslipModel) { return { key: 'totalPaidSalary', typeWhenExposed: TableCellTypes.currency } },
        view: {
          width: 7,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.secret
      },
      {
        key: 'more',
        head: 'Actions',
        hidden: false,
        value: (record: PayslipModel) => {
          return {
            key: 'view',
            // label: `View more details`,
            icon: 'text_snippet',
            tooltip: 'View details'
          }
        },
        view: {
          width: 2,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: 'cursor-pointer text-primary'
          },
        },
        type: TableCellTypes.eventEmitter

      },
    ]
  }


  public readonly additionDeductionAction: TableActionModel = {
    key: 'open_addition_deduction',
    label: 'Addition-deduction'
  }


  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);

    if (this.isTeamMode) {
      this._tablesService.includeColumn('employee_name', 0)
      this._tablesService.includeColumn('employee_title', 1)
      this._tablesService.includeColumn('manager_name', 2)
      this._tablesService.includeColumn('manager_email', 3)
      this._tablesService.includeColumn('actual_total_monthly_gross_salary', 5)

    }
  }

  public mapTableActions($event: tableTakenActionModel) {
    if ($event.action.key === this.additionDeductionAction.key) this.openDetailsPopup({
      details: $event.record.details,
      type: $event.record.type,
    })
    if ($event.action.key === 'view') {
      this._matDialog.open(PayslipDetailsComponent, {
        data: { record: $event.record },
      })
    }
  }


  public openDetailsPopup(config: { details: [], type: string }) {
    this._matDialog.open(AdditionDeductionComponent, {
      data: { details: config.details, type: config.type }
    })
  }


  private _mapGlobalDeductions(globalDeductions) {
    return globalDeductions = globalDeductions.map(globalDeduction => {
      return {
        id: globalDeduction.id,
        deductionType: {
          id: globalDeduction.id,
          name: globalDeduction.name,
        },
        value: globalDeduction.value,
        global: true,
        isApplied: globalDeduction.isApplied,
        note: '',
      }
    })
  }



  @Dispatch() public paginate({ pageSize, pageNumber }) {
    if (this.isProfileMode) {
      return new PaginateProfilePayslips({ pageSize, pageNumber }, {
        profileId: this.profileId
      });
    }
    const action = this.isTeamMode ? PaginateMyTeamPayslips : PaginateMyPayslips;
    return new action({ pageNumber, pageSize });
  }

}
