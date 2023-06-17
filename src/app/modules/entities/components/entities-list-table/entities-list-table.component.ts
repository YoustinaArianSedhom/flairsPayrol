import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrgConfigInst } from '@core/config/organization.config';
import { country, EntityModel } from '@modules/entities/model/entities.model';
import { DeleteEntity, PaginateEntities } from '@modules/entities/state/entities.actions';
import { EntitiesState, EntitiesStateModel } from '@modules/entities/state/entities.state';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';

import { Select, Store } from '@ngxs/store';
import { ConfirmationDialogDataModel } from '@shared/modules/modals/model/modals.model';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { TableCellAligns, TableCellTypes } from '@shared/modules/tables/model/tables.config';
import { TableActionModel, TableConfigModel } from '@shared/modules/tables/model/tables.model';
import { TablesService } from '@shared/modules/tables/model/tables.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EntityFormComponent } from '../entity-form/entity-form.component';

@Component({
  selector: 'app-entities-list-table',
  templateUrl: './entities-list-table.component.html',
  styleUrls: ['./entities-list-table.component.scss']
})
export class EntitiesListTableComponent implements OnInit {

  constructor(
    private _store: Store,
    private _tablesService: TablesService,
    private _matDialog: MatDialog,
    private _dialog: ModalsService,
    private _snackbarService: SnackBarsService,
    private _router: Router,
  ) { }

  public backendError!: {
    errorCode: number
    errorMessage: string
  };

  @Select(EntitiesState.countries) public countries$: Observable<country[]>;
  @Select(EntitiesState.records) public entities$!: Observable<EntitiesStateModel[]>;
  @Select(EntitiesState.pagination) public pagination$!: Observable<PaginationConfigModel>;


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
    {
      key: OrgConfigInst.CRUD_CONFIG.actions.fetch,
      label: 'View More Details',
      icon: {
        isSVG: true,
        name: 'view'
      }
    },
    {
      key: OrgConfigInst.CRUD_CONFIG.actions.configure,
      label: 'Configure Entity',
      icon: {
        isSVG: true,
        name: 'settings'
      }
    },
  ],
    keys: ['name', 'status', 'actions'],
    columns: [
      {
        key: 'name',
        head: 'name',
        hidden: false,
        type: TableCellTypes.link,
        value: (record: EntityModel) => { return {title: record.name, link: `/entities/view/${record.id}`} },
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
        key: 'status',
        head: 'status',
        hidden: false,
        type: TableCellTypes.status,
        value: (record: EntityModel) => { return (record.status === 0 ) ? 'Active' : 'Inactive' },
        view: {
          width: 20,
          headCell: {
            align: TableCellAligns.start,
          },
          bodyCell: {
            align: TableCellAligns.start,
            classes: (record: EntityModel) => { return (record.status === 0 ) ? 'text-teal' : 'text-red-500' },
          }
        }
      } 
    ]
  }

  ngOnInit(): void {
    this._tablesService.setupConfig(this.tableConfig);
  }


  public mapTableAction({ record, action }: { record: any, action: TableActionModel }) {
    if (action.key === OrgConfigInst.CRUD_CONFIG.actions.delete) this.deleteEntity(record);
    else if (action.key === OrgConfigInst.CRUD_CONFIG.actions.update) this.updateEntity(record);
    else if (action.key === OrgConfigInst.CRUD_CONFIG.actions.fetch) this.viewEntity(record.id);
    else if (action.key === OrgConfigInst.CRUD_CONFIG.actions.configure) this.configureEntity(record.id);
  }


  public updateEntity(entity?: EntityModel) {
    // console.log('entity update', entity)
    this._matDialog.open(EntityFormComponent, {
      data: entity || {},
      panelClass: ['entityFormDialog', 'FormDialog']
    })
  }
  public viewEntity(id:string) {
    const url = this._router.navigate([`entities/view/${id}`])
    // window.open(url.toString(), '_blank')
  }
  public configureEntity(id:string) {
    const url = this._router.navigate([`entities/config/${id}`])
    // window.open(url.toString(), '_blank')
  }

@Dispatch() public paginate({ pageSize, pageNumber }) {
  return new PaginateEntities({ pageNumber, pageSize });
}
  // public arrayFindObjectByProp = (array, property, value) => {
  //   return array.find( obj => obj[property] == value );
  // };

  public deleteEntity(entity: EntityModel) {
    this.backendError = null;
    const data: ConfirmationDialogDataModel = {
      title: "Delete Entity",
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.delete(`${entity.name} entity`),
      proceedText: OrgConfigInst.CRUD_CONFIG.actions.delete,
      class: "danger",
    };

    this._dialog.openConfirmationDialog(data, () => {
      this._store.dispatch(new DeleteEntity(entity.id))
      .pipe(
        catchError(err => {
          this.backendError = err.error;
          return of('')
        })
      )
      .subscribe((result)=>{
        if(!this.backendError){
          this._snackbarService.openSuccessSnackbar({
            message: OrgConfigInst.CRUD_CONFIG.messages.deleted(`"${entity.name}" Entity`),
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
}
