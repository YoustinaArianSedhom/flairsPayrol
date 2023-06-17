import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { TableCellAligns } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { ConfirmationDialogDataModel } from '@shared/modules/modals/model/modals.model';
import { OrgConfigInst } from '@core/config/organization.config';
import { EntitiesState } from '@modules/entities/state/entities.state';
import { Observable, of } from 'rxjs';
import { GlobalDeductionResponse } from '@modules/entities/model/entities.model';
import { catchError } from 'rxjs/operators';
import { GlobalDeductionFormComponent } from '../global-deduction-form/global-deduction-form.component';
import { DeleteGlobalDeduction } from '@modules/entities/state/entities.actions';

@Component({
  selector: 'app-global-deduction-table',
  templateUrl: './global-deduction-table.component.html',
  styleUrls: ['./global-deduction-table.component.scss']
})
export class GlobalDeductionTableComponent implements OnInit {

  constructor(
    private _store: Store,
    private _tablesService: TablesService,
    private _matDialog: MatDialog,
    private _dialog: ModalsService,
    private _snackbarService: SnackBarsService,
    private _router: Router,
  ) { }

  @Output() public updateDeduction: EventEmitter<any> = new EventEmitter();

  @Select(EntitiesState.globalDeductions) public globalDeductions$!: Observable<GlobalDeductionResponse[]>;
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
    },{
      key: OrgConfigInst.CRUD_CONFIG.actions.delete,
      label: OrgConfigInst.CRUD_CONFIG.actions.delete,
      icon: {
        isSVG: true,
        name: 'delete'
      }
    },
  ],
    keys: ['name', 'value', 'paid_by_employees', 'actions'],
    columns: [
      {
        key: 'name',
        head: 'Global Deduction Name',
        hidden: false,
        value: (record: GlobalDeductionResponse) => { return record.name},
        view: {
          width: 70,
          headCell: {
            align: TableCellAligns.start
          },
          bodyCell: {
            align: TableCellAligns.start
          },
        }
      }, {
        key: 'value',
        head: 'Percentage Value',
        hidden: false,
        value: (record: GlobalDeductionResponse) => { return `${record.value}%` },
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
        value: (record: GlobalDeductionResponse) => {return record.isApplied ? 'Yes' : 'No'},
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
    if (action.key === OrgConfigInst.CRUD_CONFIG.actions.delete) this.deleteGlobalDeductions(record);
    else if (action.key === OrgConfigInst.CRUD_CONFIG.actions.update) this.updateGlobalDeductions(record);
  }

  public deleteGlobalDeductions(globalDeduction: GlobalDeductionResponse) {
    this.backendError = null;
    const data: ConfirmationDialogDataModel = {
      title: "Delete Global Deduction",
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.delete(`${globalDeduction.name} Global Deduction`),
      hint: 'By deleting this deduction, all old published payrolls will not be affected',
      proceedText: OrgConfigInst.CRUD_CONFIG.actions.delete,
      class: "danger",
    };

    this._dialog.openConfirmationDialog(data, () => {
      this._store.dispatch(new DeleteGlobalDeduction(globalDeduction.id))
      .pipe(
        catchError(err => {
          this.backendError = err.error;
          return of('')
        })
      )
      .subscribe((result)=>{
        if(!this.backendError){
          this._snackbarService.openSuccessSnackbar({
            message: OrgConfigInst.CRUD_CONFIG.messages.deleted(`"${globalDeduction.name}" Global Deduction`),
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
    });
  }

  public updateGlobalDeductions(globalDeductions?: GlobalDeductionResponse) {
    this._matDialog.open(GlobalDeductionFormComponent, {
      data: globalDeductions || {},
      panelClass: ['FormDialog']
    })
  }

}
