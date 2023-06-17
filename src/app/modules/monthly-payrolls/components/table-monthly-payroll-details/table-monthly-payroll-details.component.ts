import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MonthlyPayrollStatusesEnum, monthly_payroll_module_route } from '@modules/monthly-payrolls/model/monthly-payrolls.config';
import { MonthlyPayrollDetailsModel, MonthlyPayrollSummaryModel } from '@modules/monthly-payrolls/model/monthly-payrolls.model';
import { PaginateMonthlyPayrollDetails } from '@modules/monthly-payrolls/state/monthly-payrolls.actions';
import { MonthlyPayrollsState } from '@modules/monthly-payrolls/state/monthly-payrolls.state';
import { AdditionDeductionComponent } from '@modules/payslips/components/addition-deduction-popup/addition-deduction-popup.component';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { EmployeeStatuses } from '@shared/models/employees.config';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableAdditionDeductionCellModel, TableConfigModel, TableLinkCellModel, tableTakenActionModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table-monthly-payroll-details',
  templateUrl: './table-monthly-payroll-details.component.html',
  styleUrls: ['./table-monthly-payroll-details.component.scss'
  ]
})
export class TableMonthlyPayrollDetailsComponent implements OnInit {

  constructor(
    private _router: Router,
    private _store: Store,
    private _tables: TablesService,
    private _matDialog: MatDialog,
  ) { }



  @Select(MonthlyPayrollsState.payrollDetails) public payrollDetails$: Observable<MonthlyPayrollDetailsModel[]>;
  @Select(MonthlyPayrollsState.payrollSummary) public payrollSummary$: Observable<MonthlyPayrollSummaryModel>;
  @ViewSelectSnapshot(MonthlyPayrollsState.payrollDetailsPagination) public pagination: PaginationConfigModel;
  public employeeStatuses = EmployeeStatuses;


  public readonly ADDITIONS_DEDUCTIONS_ACTION_KEY = 'additions_deductions';
  public readonly ADDITIONS_DEDUCTIONS_PAGE_ROUTE = 'addition-deduction';

  public tableConfig: TableConfigModel = {
    actions: [{
      label: 'Additions and Deductions',
      key: this.ADDITIONS_DEDUCTIONS_ACTION_KEY,
      icon: {
        isSVG: false,
        name: 'tune'
      }
    }],
    keys: ['profile_name','profile_mail', 'profile_title','is_transferred','transfer_date', 'gross_salary','base_gross_taxes', 'net_salary', 'total_additions','additions_taxes','total_global_additions','global_additions_taxes','loyalty_bonus_percent','loyalty_bonus_amount','total_taxes', 'net_after_additions', 'total_deductions', 'total_global_deductions', 'work_days', 'paid_salary', 'released_amount', 'total_paid', 'employee_status', 'suspension_status', 'employee_boarding_status', 'insuranceStatus', 'socialInsurranceAmount', 'flairstechInsuranceAmount', 'employeeInsuranceAmount', 'actions'],
    columns: [
      {
        key:'profile_name',
        head: 'Employee name',
        type:TableCellTypes.link,
        value: (record: MonthlyPayrollDetailsModel): TableLinkCellModel => {
          return { title: record.profileName , link: `/employees/manage/${record.profileId}`}
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: " block text-center",

          }
        },
      },
      {
        key:'profile_mail',
        head: 'Employee Email',
        type:TableCellTypes.email,
        value: (record: MonthlyPayrollDetailsModel) =>  record.profileOrganizationEmail,
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: " block text-center",
          }
        },
      },
      // profile_title
      {
        key: 'profile_title',
        head: 'Employee title',
        value(record: MonthlyPayrollDetailsModel) { return record.profileTitle },
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
       // is_transferred
       {
        key: 'is_transferred',
        head: 'Is transferred',
        value(record: MonthlyPayrollDetailsModel) { return record.isTransferred? 'Yes': 'No' },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            extraInfoClasses: (record:MonthlyPayrollDetailsModel) => { return record.isTransferred ? 'text-teal' : 'text-red-500' }
          }
        },
      },
      // is_transferred
      {
        key: 'transfer_date',
        head: 'Transfer date',
        value(record: MonthlyPayrollDetailsModel) { return record.transferDate },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.date
      },
      // gross_salary
      {
        key: 'gross_salary',
        head: 'Gross Salary',
        value(record: MonthlyPayrollDetailsModel) { return record.grossSalary },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.currency
      },
      // base_gross_taxes
      {
        key: 'base_gross_taxes',
        head: 'Base Gross Taxes',
        value(record: MonthlyPayrollDetailsModel) { return record.baseGrossSalaryTaxes },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.currency
      },
      // net_salary
      {
        key: 'net_salary',
        head: 'pure net',
        value(record: MonthlyPayrollDetailsModel) { return record.netSalary },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.currency
      },
      // net_after_additions
      {
        key: 'net_after_additions',
        head: 'Net Salary',
        value(record: MonthlyPayrollDetailsModel) { return record.monthlyNetSalaryWithAdditionsAndGlobalAdditions },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.currency
      },
      // total_additions
      {
        key: 'total_additions',
        head: 'Total additions',
        value: (record: MonthlyPayrollDetailsModel): TableAdditionDeductionCellModel => { return {
          value: record.totalAdditions, details: record.additions, type: 'Additions', action: this.additionDeductionAction } },
        view: {
          width:10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.additionAndDeduction
      },
      // Addition Taxes
      {
        key: 'additions_taxes',
        head: 'Addition taxes',
        value(record: MonthlyPayrollDetailsModel) { return record.additionsTaxes },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.currency
      },
      // total_global_taxes
      {
        key: 'global_additions_taxes',
        head: 'global additions taxes',
        value(record: MonthlyPayrollDetailsModel) { return record.globalAdditionsTaxes },
        view: {
          width:10,
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
      // loyalty_bonus_percent
      {
        key: 'loyalty_bonus_percent',
        head: 'Loyalty Bonus Percent',
        value(record: MonthlyPayrollDetailsModel) { return record.loyaltyBonusPercentage + '%' },
        view: {
          width:10,
          headCell: {
            align: TableCellAligns.center,
            classes: 'text-center'
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
      },
      // loyalty_bonus_amount
      {
        key: 'loyalty_bonus_amount',
        head: 'Loyalty Bonus Amount',
        value(record: MonthlyPayrollDetailsModel) { return record.loyaltyBonusValue },
        view: {
          width:10,
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
      // total_taxes
      {
        key: 'total_taxes',
        head: 'Total taxes',
        value(record: MonthlyPayrollDetailsModel) { return record.totalTaxes },
        view: {
          width:10,
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
      {
        key: 'total_global_additions',
        head: 'Total global additions',
        value(record: MonthlyPayrollDetailsModel) { return record.totalGlobalAdditions },
        view: {
          width:10,
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
      // global_addition_Taxes
      {
        key: 'gross_salary',
        head: 'Gross Salary',
        value(record: MonthlyPayrollDetailsModel) { return record.grossSalary },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.currency
      },
      // total_deductions
      {
        key: 'total_deductions',
        head: 'Total deductions',
        value: (record: MonthlyPayrollDetailsModel): TableAdditionDeductionCellModel => {
          return { value: record.totalDeductions, details: record.deductions, type: 'Deductions', action: this.additionDeductionAction }
        },
        view: {
          width:10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.additionAndDeduction
      },
      // total_global_deductions
      {
        key: 'total_global_deductions',
        head: 'Total global deductions',
        value(record: MonthlyPayrollDetailsModel) { return record.totalGlobalDeductions },
        view: {
          width:10,
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
      // work_days
      {
        key: 'work_days',
        head: 'Work days',
        value(record: MonthlyPayrollDetailsModel) { return record.workingDays },
        view: {
          width: 5,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
      },
      // paid_salary
      {
        key: 'paid_salary',
        head: 'Paid salary',
        value(record: MonthlyPayrollDetailsModel) { return record.paidSalary },
        view: {
          width:10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.currency
      },
      // released_amount
      {
        key: 'released_amount',
        head: 'Released Amount',
        value(record: MonthlyPayrollDetailsModel) { return record.releasedAmount },
        view: {
          width:10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.currency
      },
      // total_paid
      {
        key: 'total_paid',
        head: 'Total Paid',
        value(record: MonthlyPayrollDetailsModel) { return record.totalPaid },
        view: {
          width:10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        },
        type: TableCellTypes.currency
      },
      // employee_status
      {
        key: 'employee_status',
        head: 'Employee status',
        value(record: MonthlyPayrollDetailsModel) { return record.profileStatus !== null ? EmployeeStatuses[record.profileStatus] : 'N/A' },
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
      // suspension_status
      {
        key: 'suspension_status',
        head: 'Suspension status',
        value(record: MonthlyPayrollDetailsModel) { return record.salarySuspensionStatus },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
            classes: 'text-center'
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes:(record)=> record.salarySuspensionStatus ?'block text-xs text-center bg-red-300 text-black w-36 px-1 py-1 rounded-md':''
          }
        },
      },
      // employee_boarding_status
      {
        key: 'employee_boarding_status',
        head: 'Boarding status',
        value(record: MonthlyPayrollDetailsModel) { return record.employeeBoardingStatus },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
            classes: 'text-center'
          },
          bodyCell: {
            align: TableCellAligns.center,
            classes:(record)=> record.employeeBoardingStatus?'block text-xs text-center bg-yellow-300 text-black w-36 px-1 py-1 rounded-md':''
          }
        },
      },
       // insuranceStatus
       {
        key: 'insuranceStatus',
        head: 'Insurance status',
        value(record: MonthlyPayrollDetailsModel) { return record.insuranceStatus===1 ? 'Insured' : 'Not Insured' },
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
        value(record: MonthlyPayrollDetailsModel) { return record.socialInsurranceAmount},
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
      // flairstechInsuranceAmount
      {
        key: 'flairstechInsuranceAmount',
        head: 'Flairstech  insurance amount',
        value(record: MonthlyPayrollDetailsModel) { return record.flairstechInsuranceAmount },
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
      // employeeInsuranceAmount
      {
        key: 'employeeInsuranceAmount',
        head: 'Employee insurance amount',
        value(record: MonthlyPayrollDetailsModel) { return record.employeeInsuranceAmount },
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
      }
    ]
  }

  public readonly additionDeductionAction: TableActionModel = {
    key: 'open_addition_deduction',
    label: 'Addition-deduction'
  }


  ngOnInit(): void {
    this._tables.setupConfig(this.tableConfig);
    this.payrollSummary$.subscribe(summary => {
      if (summary && summary.status === MonthlyPayrollStatusesEnum.published) this._tables.disableActions();
    })
  }

  // public mapTableActions($event: tableTakenActionModel) {
  //   if ($event.action.key == this.additionDeductionAction.key) this.openDetailsPopup({
  //     details: $event.record.details,
  //     type: $event.record.type,
  //   })
  // }

  public openDetailsPopup(config: {details: [], type: string}) {
    this._matDialog.open(AdditionDeductionComponent, {
      data: {details: config.details, type: config.type}
    })
  }




  public mapTableAction($event: tableTakenActionModel) {
    if ($event.action.key === this.ADDITIONS_DEDUCTIONS_ACTION_KEY) this._navigateToAdditionDeductionPage($event.record);
    if ($event.action.key === this.additionDeductionAction.key) this.openDetailsPopup({
      details: $event.record.details,
      type: $event.record.type,
    })
  }


  private _navigateToAdditionDeductionPage({ profileId }: MonthlyPayrollDetailsModel) {
    const { entity: { id: entityId }, month: PayrollMonth, year: PayrollYear, status } = this._store.selectSnapshot(MonthlyPayrollsState.payrollSummary);

    this._router.navigate([monthly_payroll_module_route, this.ADDITIONS_DEDUCTIONS_PAGE_ROUTE], {
      queryParams: {
        entityId,
        profileId,
        PayrollMonth,
        PayrollYear,
        isEditable: status === MonthlyPayrollStatusesEnum.opened
      }
    })
  }

  @Dispatch() public paginate({ pageSize, pageNumber }) {
    return new PaginateMonthlyPayrollDetails({ pageNumber, pageSize });
  }

}
