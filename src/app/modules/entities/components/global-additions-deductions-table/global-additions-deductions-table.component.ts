import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EntitiesState } from '@modules/entities/state/entities.state';
import { Select, Store } from '@ngxs/store';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable, of } from 'rxjs';
import * as ENTITIES_MODELS from '@modules/entities/model/entities.model'
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { OrgConfigInst } from '@core/config/organization.config';
import { TableCellAligns } from '@shared/modules/tables/model/tables.config';
import * as ENTITIES_ACTIONS from '@modules/entities/state/entities.actions'
import { GlobalDeductionFormComponent } from '../global-deduction-form/global-deduction-form.component';
import { GlobalAdditionFormComponent } from '../global-addition-form/global-addition-form.component';
import { catchError } from 'rxjs/operators';
@Component({
  selector: 'app-global-additions-deductions-table',
  templateUrl: './global-additions-deductions-table.component.html',
  styleUrls: ['./global-additions-deductions-table.component.scss']
})
export class GlobalAdditionsDeductionsTableComponent implements OnInit {

  constructor(
    private _store: Store,
    private _tablesService: TablesService,
    private _matDialog: MatDialog,
    private _dialog: ModalsService,
    private _snackbarService: SnackBarsService,
    private _router: Router,
  ) { }
  @Output() public updateDeduction: EventEmitter<any> = new EventEmitter();
  @Select(EntitiesState.globalAdditionAndDeduction) public globalAdditionAndDeduction$!: Observable<ENTITIES_MODELS.GlobalAdditionAndDeductionModel[]>
  public GlobalType = ENTITIES_MODELS.GLOBAL_ADDITIONS_DEDUCTIONS_TYPES;
  public backendError!: {
    errorCode: number
    errorMessage: string
  };

  public tableConfig: TableConfigModel = {
    actions: [{
      key: OrgConfigInst.CRUD_CONFIG.actions.update,
      label: OrgConfigInst.CRUD_CONFIG.actions.update,
      icon: {
        isSVG: true,
        name: 'edit-button',
        classes: ''
      }
    }, {
      key: OrgConfigInst.CRUD_CONFIG.actions.delete,
      label: OrgConfigInst.CRUD_CONFIG.actions.delete,
      icon: {
        isSVG: true,
        name: 'delete'
      }
    },],
    keys: ['name', 'type', 'value', 'paid_by_employees', 'actions'],
    columns: [
      {
        key: 'name',
        head: 'Name',
        hidden: false,
        value: (record: ENTITIES_MODELS.GlobalAdditionAndDeductionModel) => { return record.name },
        view: {
          width: 70,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      },
      {
        key: 'type',
        head: 'Type',
        hidden: false,
        value: (record: ENTITIES_MODELS.GlobalAdditionAndDeductionModel) => { return this.GlobalType[record.type] },
        view: {
          width: 10,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      },
      {
        key: 'value',
        head: 'Percentage Value',
        hidden: false,
        value: (record: ENTITIES_MODELS.GlobalAdditionAndDeductionModel) => { return `${record.value}%` },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
          }
        }
      }, {
        key: 'paid_by_employees',
        head: `Paid by Employees`,
        value: (record: ENTITIES_MODELS.GlobalAdditionAndDeductionModel) => { return record.isApplied ? 'Yes' : 'No' },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.center
          },
          bodyCell: {
            align: TableCellAligns.center
          }
        }
      }
    ]
  }

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }

  public mapTableAction({ record, action }: { record: any, action: TableActionModel }) {
    if (action.key === OrgConfigInst.CRUD_CONFIG.actions.delete) {
      if (record?.type) {
        this.deleteGlobalDeduction(record);
      } else {
        this.deleteGlobalAddition(record)
      }
    }
    else if (action.key === OrgConfigInst.CRUD_CONFIG.actions.update) {
      if (record?.type) {
        this.updateGlobalDeductions(record)
      } else {
        this.updateGlobalAddition(record)
      }
    }
  }

  public updateGlobalAddition(record?: ENTITIES_MODELS.GlobalAdditionAndDeductionModel) {
    this._matDialog.open(GlobalAdditionFormComponent, {
      data: record || {},
      panelClass: ['FormDialog']
    }

    )
  }
  public updateGlobalDeductions(record?: ENTITIES_MODELS.GlobalAdditionAndDeductionModel) {
    this._matDialog.open(GlobalDeductionFormComponent, {
      data: record || {},
      panelClass: ['FormDialog']
    })
  }
  public deleteGlobalDeduction(record?: ENTITIES_MODELS.GlobalAdditionAndDeductionModel) {
    this.backendError = null;
    const data = this.confirmationMessageInstanceCreator(record)
    this._dialog.openConfirmationDialog(data, () => {
      this._store.dispatch(new ENTITIES_ACTIONS.DeleteGlobalDeduction(record.id))
        .pipe(
          catchError(err => {
            this.backendError = err.error;
            return of('')
          })
        )
        .subscribe((result) => {
          if (!this.backendError) {
            this.successMessage(record)
          } else {
            this.errorMessage(this.backendError.errorMessage)
          }
        })
    });
  }
  public deleteGlobalAddition(record?: ENTITIES_MODELS.GlobalAdditionAndDeductionModel) {
    this.backendError = null;
    const data = this.confirmationMessageInstanceCreator(record);
    this._dialog.openConfirmationDialog(data, () => {
      this._store.dispatch(new ENTITIES_ACTIONS.DeleteGlobalAddition(record.id))
        .pipe(
          catchError(err => {
            this.backendError = err.error;
            return of('')
          })
        )
        .subscribe((result) => {
          if (!this.backendError) {
            this.successMessage(record)
          } else {
            this.errorMessage(this.backendError.errorMessage)
          }
        })
    });
  }

  public confirmationMessageInstanceCreator(record: ENTITIES_MODELS.GlobalAdditionAndDeductionModel){
    let globalType = record.type ? 'Deduction' : 'Addition';

    return {
      title:`Delete Global ${globalType} `,
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.delete(`${record.name} Global ${globalType}`),
      hint: `By deleting this ${record.type ? 'deduction' : 'addition'}, all old published payrolls will not be affected`,
      proceedText: OrgConfigInst.CRUD_CONFIG.actions.delete,
      class: "danger",
    };
  }

  public successMessage(record: ENTITIES_MODELS.GlobalAdditionAndDeductionModel){
    this._snackbarService.openSuccessSnackbar({
      message: OrgConfigInst.CRUD_CONFIG.messages.deleted(`"${record.name}" Global ${record.type ? 'Deduction' : 'Addition'}`),
      duration: 5,
      showCloseBtn: false
    })
  }

  public errorMessage(err:string){
    this._snackbarService.openFailureSnackbar({
      message: `${err}`,
      duration: 5
    })
  }
}
