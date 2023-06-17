import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { OrgConfigInst } from '@core/config/organization.config';
import { SelectSnapshot, ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { ConfirmationDialogDataModel } from '@shared/modules/modals/model/modals.model';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AdditionDeductionFormComponent } from '../../components/addition-deduction-form/addition-deduction-form.component';
import { AdditionDeductionModel, AdditionDeductionRecordsModel } from '../../model/addition-deduction.model';
import { AdditionDeductionDispatch, DeleteAdditionFromProfile, DeleteDeductionFromProfile } from '../../state/addition-deduction.actions';
import { AdditionDeductionState } from '../../state/addition-deduction.state';

@Component({
  selector: 'app-addition-deduction-manage',
  templateUrl: './addition-deduction-manage.component.html',
  styleUrls: ['./addition-deduction-manage.component.scss']
})
export class AdditionDeductionManageComponent implements OnInit {

  constructor(
    private _store: Store,
    private _route: ActivatedRoute,
    private _matDialog: MatDialog,
    private _dialog: ModalsService,
    private _snackbarService: SnackBarsService

  ) { }

  public dispatchingConfig: { profileId: number, entityId: number, PayrollMonth?: number, PayrollYear?: number, isEditable?: boolean } = {
    profileId: 0,
    entityId: 0
  }
  public isEditable: string;


  public backendError!: {
    errorCode: number
    errorMessage: string
  };

  public selectedMode;


  @SelectSnapshot(AdditionDeductionState.additions) public additions$: Observable<AdditionDeductionModel[]>
  @SelectSnapshot(AdditionDeductionState.deductions) public deductions$: Observable<AdditionDeductionModel[]>
  // @ViewSelectSnapshot(AdditionDeductionState.additionTypes) public additionTypes: {id:number, name:string}[];
  // @ViewSelectSnapshot(AdditionDeductionState.deductionTypes) public deductionTypes: {id:number, name:string}[];
  @ViewSelectSnapshot(AdditionDeductionState.records) public records: AdditionDeductionRecordsModel;

  public isStatusSelected() {

  }
  public onStatusFilterChange() {

  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.isEditable = params.isEditable
      this.dispatchingConfig.entityId = parseInt(params.entityId, 10)
      this.dispatchingConfig.profileId = parseInt(params.profileId, 10)
      this.dispatchingConfig.PayrollMonth = parseInt(params.PayrollMonth, 10)
      this.dispatchingConfig.PayrollYear = parseInt(params.PayrollYear, 10)
      this._store.dispatch(new AdditionDeductionDispatch(this.dispatchingConfig))
      // if (params.PayrollMonth || params.PayrollYear) {
      // } else {
      //   this._store.dispatch(new AdditionDeductionDispatch(this.dispatchingConfig))
      // }
    })

  }

  public addNewRecord(type) {
    this._matDialog.open(AdditionDeductionFormComponent, {
      data: { ...this.dispatchingConfig, ...type },
      panelClass: ['FormDialog', 'additionDialog']
    }).afterClosed().subscribe(res => {
      // console.log('next', res)
      if (typeof res === 'undefined') {
        this._store.dispatch(new AdditionDeductionDispatch(this.dispatchingConfig))
      }
    })

  }

  public updateRecord(record, type) {
    if (type === 'addition') record = { ...record, additionTypeId: record.additionType.id }
    else if (type === 'deduction') record = { ...record, deductionTypeId: record.deductionType.id }
    this._matDialog.open(AdditionDeductionFormComponent, {
      data: { ...record, ...this.dispatchingConfig },
      panelClass: ['FormDialog', 'additionDialog']
    }).afterClosed().subscribe(res => {
      // console.log('next', res)
      if (typeof res === 'undefined') {
        this._store.dispatch(new AdditionDeductionDispatch(this.dispatchingConfig)).subscribe(res => {
          console.log('AdditionDeductionDispatch', res)
        })
      }
    })
  }

  public deleteRecord(record, type) {
    this.backendError = null;
    if (type === 'addition') {
      const data: ConfirmationDialogDataModel = {
        title: "Delete Addition",
        content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.delete(`${record.additionType.name} addition`),
        proceedText: OrgConfigInst.CRUD_CONFIG.actions.delete,
        hint: 'By deleting this addition, it will reflect only on this monthly payroll',
        class: "danger",
      };

      this._dialog.openConfirmationDialog(data, () => {
        this._store.dispatch(new DeleteAdditionFromProfile(record.id))
          .pipe(
            catchError(err => {
              this.backendError = err.error;
              return of('')
            })
          )
          .subscribe((result) => {
            if (!this.backendError) {
              this._snackbarService.openSuccessSnackbar({
                message: OrgConfigInst.CRUD_CONFIG.messages.deleted(`${record.additionType.name} addition`),
                duration: 5,
                showCloseBtn: false
              })
              this._store.dispatch(new AdditionDeductionDispatch(this.dispatchingConfig))
            } else {
              this._snackbarService.openFailureSnackbar({
                message: `${this.backendError.errorMessage}`,
                duration: 5
              })
            }
          })
      });
    } else {
      //   this._store.dispatch(new DeleteDeductionFromProfile(id)).subscribe(res=>{
      //     this._snackbarService.openSuccessSnackbar({
      //       message: OrgConfigInst.CRUD_CONFIG.messages.deleted(`deduction`),
      //       duration: 5,
      //       // showCloseBtn: true
      //     })

      // })
      const data: ConfirmationDialogDataModel = {
        title: "Delete Deduction",
        content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.delete(`${record.deductionType.name} deduction`),
        proceedText: OrgConfigInst.CRUD_CONFIG.actions.delete,
        hint: 'By deleting this deduction, it will reflect only on this monthly payroll',
        class: "danger",
      };

      this._dialog.openConfirmationDialog(data, () => {
        this._store.dispatch(new DeleteDeductionFromProfile(record.id))
          .pipe(
            catchError(err => {
              this.backendError = err.error;
              return of('')
            })
          )
          .subscribe((result) => {
            if (!this.backendError) {
              this._snackbarService.openSuccessSnackbar({
                message: OrgConfigInst.CRUD_CONFIG.messages.deleted(`${record.deductionType.name} deduction`),
                duration: 5,
                showCloseBtn: false
              })
              this._store.dispatch(new AdditionDeductionDispatch(this.dispatchingConfig))
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
}
