import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrgConfigInst } from '@core/config/organization.config';
import { SalaryLevelModel } from '@modules/salary-levels/model/salaries-level.model';
import { PaginateSalaryLevels, SortSalaryLevels } from '@modules/salary-levels/state/salary-levels.actions';
import { SalaryLevelsState } from '@modules/salary-levels/state/salary-levels.state';
import { Select, Store } from '@ngxs/store';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable, of } from 'rxjs';
import { SalaryLevelFormComponent } from '../salary-level-form/salary-level-form.component';

@Component({
  selector: 'app-salary-levels-table',
  templateUrl: './salary-levels-table.component.html',
  styleUrls: ['./salary-levels-table.component.scss']
})
export class SalaryLevelsTableComponent implements OnInit {

  constructor(
    private _store: Store,
    private _tablesService: TablesService,
    private _matDialog: MatDialog,
  ) { }

  public backendError!: {
    errorCode: number
    errorMessage: string
  };

  @Select(SalaryLevelsState.records) public salaries$!: Observable<SalaryLevelModel[]>;
  @Select(SalaryLevelsState.pagination) public pagination$!: Observable<PaginationConfigModel[]>;


  public tableConfig: TableConfigModel = {
    actions: [
      {
        key: OrgConfigInst.CRUD_CONFIG.actions.update,
        label: OrgConfigInst.CRUD_CONFIG.actions.update,
        icon: {
          isSVG: true,
          name: 'edit-button',
          classes: ''
        }
      },
      // {
      //   key: OrgConfigInst.CRUD_CONFIG.actions.delete,
      //   label: OrgConfigInst.CRUD_CONFIG.actions.delete,
      //   icon: {
      //     isSVG: true,
      //     name: 'delete'
      //   }
      // },
    ],
    keys: ['name', 'from', 'to', 'description', 'actions'],
    columns: [
      {
        key: 'name',
        head: 'name',
        hidden: false,
        sort: {
          sortField: 1,
          sortType: OrgConfigInst.CRUD_CONFIG.sort.asc
        },
        value: (record: SalaryLevelModel) => { return record.name },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      }, {
        key: 'from',
        head: 'from',
        hidden: false,
        sort: {
          sortField: 2,
          sortType: OrgConfigInst.CRUD_CONFIG.sort.asc
        },
        value: (record: SalaryLevelModel) => { return record.from },
        type: TableCellTypes.currency,
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      }, {
        key: 'to',
        head: 'to',
        hidden: false,
        sort: {
          sortField: 3,
          sortType: OrgConfigInst.CRUD_CONFIG.sort.asc
        },
        value: (record: SalaryLevelModel) => { return record.to },
        type: TableCellTypes.currency,
        view: {
          width: 15,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      }, {
        key: 'description',
        head: 'description',
        hidden: false,
        value: (record: SalaryLevelModel) => { return record.description },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          }
        }
      }
    ]
  }

  ngOnInit(): void {

    this._tablesService.setupConfig(this.tableConfig);
  }





  public mapTableAction({ record, action }: { record: any, action: TableActionModel }) {
    if (action.key === OrgConfigInst.CRUD_CONFIG.actions.update) this.openSalaryLevelForm(record)
    // else if (action.key == OrgConfigInst.CRUD_CONFIG.actions.delete) this.delete(record);
  }


  /**
   * 
   * @param salaryLevel - salary level record to be edited
   */
  public openSalaryLevelForm(salaryLevel?: SalaryLevelModel) {
    this._matDialog.open(SalaryLevelFormComponent, {
      data: salaryLevel,
      panelClass: ['FormDialog']
    })
  }



  // public delete(record: SalaryLevelModel) {
  //   this.backendError = null;
  //   this._modalsService.openConfirmationDialog({
  //     title: 'Delete Salary-Level',
  //     class: "danger",
  //     content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.delete(`"${record.name}" salary level`),
  //     proceedText: OrgConfigInst.CRUD_CONFIG.actions.delete,
  //   }, () => {
  //     this._store.dispatch(new RemoveSalaryLevel(record.id))
  //     .pipe(
  //       catchError(err => {
  //         this.backendError = err.error;
  //         return of('')
  //       })
  //     )
  //     .subscribe((result) => {
  //       if(!this.backendError){
  //         this._snackbarsService.openSuccessSnackbar({
  //           message: OrgConfigInst.CRUD_CONFIG.messages.deleted(record.name),
  //           duration: 5
            
  //         })
  //       } else {
  //         this._snackbarsService.openFailureSnackbar({
  //           message: `${this.backendError.errorMessage}`,
  //           duration: 5
  //         })
  //       }
  //     });
  //   })
  // }

  public sort(sort) {
    this._store.dispatch(new SortSalaryLevels(sort));
  }

  public paginate({ pageSize, pageNumber }) {
    this._store.dispatch(new PaginateSalaryLevels({ pageSize, pageNumber }));
  }
}
