import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrgConfigInst } from '@core/config/organization.config';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { EmployeeSalaryDetailsModel } from '@modules/salaries/model/salaries.interface';
import { PaginateEmployeesSalariesSummaries, SortEmployeeSalarySummaries } from '@modules/salaries/state/salaries.actions';
import { EmployeeSalaryDetailsState } from '@modules/salaries/state/salaries.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { SelectSnapshot, ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableConfigModel, TableLinkCellModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-employees-salaries-list-table',
  templateUrl: './employees-salaries-list-table.component.html',
  styleUrls: ['employees-salaries-list-table.component.scss']
})
export class EmployeesSalariesListTableComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,
    private _router: Router,
  ) { }

  @Select(EmployeeSalaryDetailsState.employeeSalaryDetails) public records$!: Observable<EmployeeSalaryDetailsModel[]>;
  @ViewSelectSnapshot(EmployeeSalaryDetailsState.pagination) public pagination: PaginationConfigModel;
  @SelectSnapshot(AuthorizationState.isPayroll) public isPayroll !: boolean;

  public tableConfig: TableConfigModel = {
    actions: [ {
      key: OrgConfigInst.CRUD_CONFIG.actions.fetch,
      label: 'View More Details',
      icon: {name: 'visibility'}
    }],
    keys: ['name', 'nationalId', 'employeeType', 'employment_date', 'managerName', 'title', 'bank_account_name', 'salaryLevelName', 'monthlyGrossSalary', 'monthlyNetSalary', 'status', 'insuranceStatus', 'socialInsurranceAmount', 'flairstechInsuranceAmount', 'employeeInsuranceAmount'],
    columns: [
      {
        head: 'Employee Bank Name',
        key: 'bank_account_name',
        value(record: EmployeeSalaryDetailsModel) {return record.bankAccountName},
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.center,
          }, 
          bodyCell: {
            align: TableCellAligns.center
          }
        }
      },
      {
        key:'name',
        head: 'name',
        type:TableCellTypes.linkWithExtraInfo,
        value: (record: EmployeeSalaryDetailsModel): TableLinkCellModel => { 
          return { title: record.name , link: `/employees/view/${record.id}`}
        },
        extraInfoValue:(record: EmployeeSalaryDetailsModel) =>{
          return record.employeeBoardingStatus  
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: " block text-center",
            extraInfoClasses: (record: EmployeeSalaryDetailsModel) => {
              let baseClass =  ' block text-xs text-center w-36 bg-yellow-300 text-black px-1 py-1 rounded-md'
              return baseClass
            }
          }
        },
      },
      // {
      //   key: 'name',
      //   head: 'name',
      //   hidden: false,
      //   type: TableCellTypes.link,
      //   sort: {
      //     sortField: 1,
      //     sortType: OrgConfigInst.CRUD_CONFIG.sort.asc 
      //   },
      //   value: (record: EmployeeSalaryDetailsModel): TableLinkCellModel => { 
      //     return { title: (record.name ? record.name + "  222" : record.name + "222"), link: `/employees/view/${record.id}`}
      //   },
      //   view: {
      //     width: 20,
      //     headCell: {
      //       align: TableCellAligns.start
      //     },
      //     bodyCell: {
      //       align: TableCellAligns.start
      //     },
      //   }
      // },
      {
        key: 'nationalId',
        head: 'national id',
        hidden: false,
        value: (record: EmployeeSalaryDetailsModel) => { return record.nationalId},
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      } ,
      {
        key: 'employeeType',
        head: 'Type',
        hidden: true,
        value: (record: EmployeeSalaryDetailsModel) => {
          return record.employeeType
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      {
        key: 'employment_date',
        head: 'Employment Date',
        hidden: false,
        sort: {
          sortField: 2,
          sortType: OrgConfigInst.CRUD_CONFIG.sort.asc 
        },
        type: TableCellTypes.date,
        value: (record: EmployeeSalaryDetailsModel) => { return record.employmentDate },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
      },
      {
        key: 'managerName',
        head: 'Manager Name',
        hidden: false,
        value: (record: EmployeeSalaryDetailsModel) => { return record.managerName },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      {
        key: 'title',
        head: 'title',
        hidden: false,
        value: (record: EmployeeSalaryDetailsModel) => { return record.title },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      {
        key: 'salaryLevelName',
        head: 'Salary Level',
        hidden: false,
        value: (record: EmployeeSalaryDetailsModel) => { return record.salaryLevelName },
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
        key: 'monthlyGrossSalary',
        head: 'Gross Salary',
        hidden: false,
        type: this.isPayroll ? TableCellTypes.currency : TableCellTypes.secret,
        value: (record: EmployeeSalaryDetailsModel) => { 
          if (this.isPayroll) return record.monthlyGrossSalary;
          return {
          key: 'monthlyGrossSalary',
          typeWhenExposed: TableCellTypes.currency
        }},
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: 'select-none'
          }
        }
      },  
      {
        key: 'monthlyNetSalary',
        head: 'Net Salary',
        hidden: false,
        type: this.isPayroll ? TableCellTypes.currency : TableCellTypes.secret,
        value: (record: EmployeeSalaryDetailsModel) => { 
          if (this.isPayroll) return record.monthlyNetSalary;
          return {
          key: 'monthlyNetSalary',
          typeWhenExposed: TableCellTypes.currency
        } 
      
      },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: 'select-none'
          }
        }
      },  
      {
        key: 'status',
        head: 'status',
        hidden: false,
        type: TableCellTypes.status,
        value: (record: EmployeeSalaryDetailsModel) => { return record.status },
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: EmployeeSalaryDetailsModel) => {
              return (record.status === 'Active' ) ? 'text-teal' : (record.status === 'Deactivated' ) ? 'text-red-500' : ''
            }
          }
        }
      }, 
      // insuranceStatus
      {
        key: 'insuranceStatus',
        head: 'Insurance status',
        value(record: EmployeeSalaryDetailsModel) { return record.insuranceStatus===1 ? 'Insured' : 'Not Insured' },
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
        value(record: EmployeeSalaryDetailsModel) { return record.socialInsurranceAmount},
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
        value(record: EmployeeSalaryDetailsModel) { return record.flairstechInsuranceAmount },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center,
            classes: 'text-center'
          },
          bodyCell: {
            align: TableCellAligns.center,
          }
        },
        type: TableCellTypes.currency
      },
      // employeeInsuranceAmount
      {
        key: 'employeeInsuranceAmount',
        head: 'Employee insurance amount',
        value(record: EmployeeSalaryDetailsModel) { return record.employeeInsuranceAmount },
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

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }

  public mapTableAction({ record, action }: { record: EmployeeSalaryDetailsModel, action: TableActionModel }) {
    if (action.key === OrgConfigInst.CRUD_CONFIG.actions.fetch) this.viewSalaryDetails(record.id);
  }

  
  

  public viewSalaryDetails(id){
    const url = this._router.navigate(['employees', 'manage', id])    
  }


  @Dispatch() public sort(sort) { return new SortEmployeeSalarySummaries(sort) }
  @Dispatch() public paginate(config: PaginationConfigModel) { return new PaginateEmployeesSalariesSummaries(config)}

}
