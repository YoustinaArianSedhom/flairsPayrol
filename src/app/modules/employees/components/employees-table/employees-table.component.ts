import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrgConfigInst } from '@core/config/organization.config';
import { PermissionsListModel } from '@core/modules/authorization/model/authorization.model';
import { AuthorizationState } from '@core/modules/authorization/state/authorization.state';
import { EmployeeStatuses, EmployeeStatusesEnum } from '@modules/employees/model/employees.config';
import { EmployeeModel } from '@modules/employees/model/employees.model';
import { ArchiveEmployee, PaginateEmployees, SubmitEmployee } from '@modules/employees/state/employees.actions';
import { EmployeesState } from '@modules/employees/state/employees.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { Select, Store } from '@ngxs/store';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EmployeeRolesFormComponent } from '../employee-roles-form/employee-roles-form.component';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss']
})
export class EmployeesTableComponent implements OnInit {

  constructor(
    private _tablesService: TablesService,
    private _modalsService: ModalsService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _store: Store,
    private _snackbarService: SnackBarsService,
  ) { }

  public backendError!: {
    errorCode: number
    errorMessage: string
  };



  @Select(EmployeesState.records) public employees$!: Observable<EmployeeModel[]>;
  @Select(EmployeesState.pagination) public pagination$!: Observable<PaginationConfigModel>;
  public permissions: PermissionsListModel = this._store.selectSnapshot(AuthorizationState.permissions);


  public tableConfig: TableConfigModel = {
    actions: [{
      key: OrgConfigInst.CRUD_CONFIG.actions.submit,
      label: 'Submit',
      hideCondition: (record: EmployeeModel) => {
        return (
          record.status !== EmployeeStatusesEnum.new || !this.permissions.SUBMIT_PROFILE
        )
      },
      icon: {
        name: 'add',
        isSVG: false
      }
    }, {
      key: OrgConfigInst.CRUD_CONFIG.actions.archive,
      label: 'Archive',
      hideCondition:(record: EmployeeModel) => { return record.status !== EmployeeStatusesEnum.deactivated || !this.permissions.ARCHIVE_PROFILE },
      icon: { name: 'archive' }
    }, {
      key: 'salary_details',
      label: 'View More Details',
      hideCondition: (record: EmployeeModel) => { return record.status === EmployeeStatusesEnum.archived || !this.permissions.VIEW_PROFILE_DETAILS },
      icon: {
        isSVG: true,
        name: 'view'
      }
    }, {
      key: OrgConfigInst.CRUD_CONFIG.actions.update,
      label: OrgConfigInst.CRUD_CONFIG.actions.update + ' Roles',
      hideCondition: (record: EmployeeModel) => {
        return (
          record.status === EmployeeStatusesEnum.archived || !this.permissions.UPDATE_PROFILE_ROLES
        )
      },
      icon: { name: 'rule' }
    }, {
      key: 'none',
      label: 'No Actions',
      hideCondition(record: EmployeeModel) { return record.status !== EmployeeStatusesEnum.archived },
      disableCondition(record) {return true}
    }
    ],
    disableActionsCell(record: EmployeeModel) {return record.status === EmployeeStatusesEnum.archived},
    keys: ['name', 'title', 'email', 'status', 'employment_date', 'actions'],
    columns: [
      {
        key: 'name',
        head: 'name',
        hidden: false,
        value: (record: EmployeeModel) => { return { title: record.name,  link: `/employees/manage/${record.id}` } },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        },
        type: TableCellTypes.link
      }, {
        key: 'title',
        head: 'title',
        hidden: false,
        value: (record: EmployeeModel) => { return record.title },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      }, {
        key: 'email',
        head: 'email',
        hidden: false,
        value: (record: EmployeeModel) => { return record.organizationEmail },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.email
      }, {
        key: 'status',
        head: 'status',
        hidden: false,
        type: TableCellTypes.status,
        value: (record: EmployeeModel) => { return EmployeeStatuses[record.status] },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center,
            // classes: (record: EmployeeModel) => {
            //   return (EmployeeStatuses[record.status] === 'Active' ) ? 'text-green-500' : (EmployeeStatuses[record.status] === 'Deactivated' ) ? 'text-red-500' : (EmployeeStatuses[record.status] === 'Archived' ) ? 'text-yellow-500' : ''
            // }
          }
        }
      }, {
        key: 'employment_date',
        head: 'Employment Date',
        hidden: false,
        value: (record: EmployeeModel) => { return record.flairstechJoinDate },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        },
        type: TableCellTypes.date
      }
    ]
  }

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }





  public mapTableAction({ record, action }: { record: EmployeeModel, action: TableActionModel }) {
    if (action.key === OrgConfigInst.CRUD_CONFIG.actions.submit) this.confirmSubmit(record);
    else if (action.key === OrgConfigInst.CRUD_CONFIG.actions.archive) this.confirmArchiving(record);
    else if (action.key === OrgConfigInst.CRUD_CONFIG.actions.update) this.openEmployeeRolesForm(record);
    else if (action.key === 'salary_details') this.viewSalaryDetails(record.id);
  }

  public viewSalaryDetails(id) {
    const url = this._router.navigate(['employees', 'manage', id])
    // window.open(url.toString(), '_blank')
  }


  public confirmSubmit(record: EmployeeModel) {
    this.backendError = null;
    this._modalsService.openConfirmationDialog({
      title: 'Submit Employee',
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.submit(record.name),
      proceedText: OrgConfigInst.CRUD_CONFIG.actions.submit,
    }, () => {
      // this._submit(record.id);
      // @Dispatch() private _submit(id: number) { return new SubmitEmployee(id)}
      this._store.dispatch(new SubmitEmployee(record.id))
        .pipe(
          catchError(err => {
            this.backendError = err.error;
            return of('')
          })
        )
        .subscribe(() => {
          if (!this.backendError) {
            this._snackbarService.openSuccessSnackbar({
              message: OrgConfigInst.CRUD_CONFIG.messages.submitted(`"${record.name}"`),
              duration: 5,
              showCloseBtn: false
            })
          } else {
            this._snackbarService.openFailureSnackbar({
              message: `${this.backendError.errorMessage}`,
              duration: 5
            })
          }
        })
    })
  }

  public confirmArchiving(record: EmployeeModel) {
    this._modalsService.openConfirmationDialog({
      title: 'Archive Employee',
      class: 'danger',
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.archive(record.name),
      proceedText: OrgConfigInst.CRUD_CONFIG.actions.archive,
    }, () => {
      this._store.dispatch(new ArchiveEmployee(record.id))
        .pipe(
          catchError(err => {
            this.backendError = err.error;
            return of('')
          })
        )
        .subscribe(() => {
          if (!this.backendError) {
            this._snackbarService.openSuccessSnackbar({
              message: OrgConfigInst.CRUD_CONFIG.messages.archived(`"${record.name}"`),
              duration: 5,
              showCloseBtn: false
            })
          } else {
            this._snackbarService.openFailureSnackbar({
              message: `${this.backendError.errorMessage}`,
              duration: 5
            })
          }
        })
    })
  }

  public openEmployeeRolesForm(record: EmployeeModel) {
    this._matDialog.open(EmployeeRolesFormComponent, {
      data: {
        employee: record,
        from: 'outside'
      },
      panelClass:['FormDialog--35vw']
    })
  }



  // public sort(sort) {
  //   this._store.dispatch(new SortSalaryLevels(sort));
  // }

  @Dispatch() public paginate({ pageSize, pageNumber }) {
    return new PaginateEmployees({ pageNumber, pageSize });
  }

}
