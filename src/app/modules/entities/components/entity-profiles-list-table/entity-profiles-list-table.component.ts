import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrgConfigInst } from '@core/config/organization.config';
import { EmployeeModel } from '@modules/employees/model/employees.model';
import { ArchiveEmployee } from '@modules/employees/state/employees.actions';
import { entityProfiles } from '@modules/entities/model/entities.model';
import { PaginateEntityProfiles } from '@modules/entities/state/entities.actions';
import { EntitiesState, EntitiesStateModel } from '@modules/entities/state/entities.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-entity-profiles-list-table',
  templateUrl: './entity-profiles-list-table.component.html',
  styleUrls: ['./entity-profiles-list-table.component.scss']
})
export class EntityProfilesListTableComponent implements OnInit {
  
  constructor(
    private _tablesService: TablesService,
    public _store: Store,
    private _currencyPipe: CurrencyPipe,
    private _router: Router,
    private _modalsService: ModalsService
  ) { }

  @Select(EntitiesState.entityProfiles) public $entityProfiles: Observable<EntitiesStateModel[]>;
  @Select(EntitiesState.profilesPagination) public pagination$: Observable<PaginationConfigModel>;
  @Input() public id : number;

  public tableConfig: TableConfigModel = {
    actions: [
    // {
    //   key: OrgConfigInst.CRUD_CONFIG.actions.update,
    //   label: OrgConfigInst.CRUD_CONFIG.actions.update,
    //   icon: {
    //     isSVG: true,
    //     name: 'edit-button',
    //     classes: 'w-10'
    //   }
    // },{
    //   key: OrgConfigInst.CRUD_CONFIG.actions.archive,
    //   label: OrgConfigInst.CRUD_CONFIG.actions.archive,
    //   icon: {name: 'delete_outline'}
    // }, 
    {
      key: OrgConfigInst.CRUD_CONFIG.actions.fetch,
      label: 'View More Details',
      icon: {name: 'visibility'}
    }],
    keys: ['name', 'nationalId', 'grossSalary', 'netSalary', 'employeeType', 'status', 'actions'],
    columns: [
      {
        key: 'name',
        head: 'name',
        hidden: false,
        type: TableCellTypes.link,
        value: (record: entityProfiles) => { return {title: record.name, link: `/employees/view/${record.id}`} },
        view: {
          width: 30,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      }, {
        key: 'nationalId',
        head: 'National ID',
        hidden: false,
        value: (record: entityProfiles) => { return record.nationalId },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      } , {
        key: 'grossSalary',
        head: 'Gross Salary',
        hidden: false,
        type: TableCellTypes.currency,
        value: (record: entityProfiles) => {
          return record.monthlyGrossSalary
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
        key: 'netSalary',
        head: 'Net Salary',
        hidden: false,
        type: TableCellTypes.currency,
        value: (record: entityProfiles) => { 
          return record.monthlyNetSalary
        },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      {
        key: 'employeeType',
        head: 'Employee Type',
        hidden: false,
        value: (record: entityProfiles) => { return record.employeeType },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      },
      {
        key: 'status',
        head: 'Status',
        hidden: false,
        type: TableCellTypes.status,
        value: (record: entityProfiles) => { return record.status },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: entityProfiles) => { return (record.status === 'Active' ) ? 'text-teal' : 'text-red-500' }
          }
        }
      }
    ]
  }
  public mapTableAction({ record, action }: { record: any, action: TableActionModel }) {
    if (action.key === OrgConfigInst.CRUD_CONFIG.actions.archive) this.confirmArchiving(record);
    else if (action.key === OrgConfigInst.CRUD_CONFIG.actions.update) this.viewSalaryDetails(record);
    else if (action.key === OrgConfigInst.CRUD_CONFIG.actions.fetch) this.viewSalaryDetails(record.id)
  }

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }

  public viewSalaryDetails(id){
    this._router.navigate(['employees','manage', id]);
  }

  @Dispatch() public paginate({ pageSize, pageNumber }) {
    return new PaginateEntityProfiles({ pageNumber, pageSize });
  }

  public confirmArchiving(record: EmployeeModel) {
    this._modalsService.openConfirmationDialog({
      title: 'Archive Employee',
      class: 'danger',
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.archive(record.name),
      proceedText: OrgConfigInst.CRUD_CONFIG.actions.archive,
    }, () => {
      this._archive(record.id);
    })
  }

  @Dispatch() private _archive(id: number) { return new ArchiveEmployee(id)}

}
