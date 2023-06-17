import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrgConfigInst } from '@core/config/organization.config';
import { GlobalAdditionModel } from '@modules/entities/model/entities.model';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { UpdateGlobalAddition, AddNewGlobalAddition, GetGlobalAdditionDeduction } from '../../state/entities.actions';

@Component({
  selector: 'app-global-addition-form',
  templateUrl: './global-addition-form.component.html',
  styleUrls: ['./global-addition-form.component.scss']
})
export class GlobalAdditionFormComponent implements OnInit {
  public globalAdditionForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _globalAddition: GlobalAdditionModel,
    private _dialogRef: MatDialogRef<GlobalAdditionFormComponent>,
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _snackbarService: SnackBarsService,
  ) {
    this._initForm();
  }

  ngOnInit(): void {
    this._patchForm();
  }

  private _initForm() {
    this.globalAdditionForm = this._formBuilder.group({
      id: [null],
      name: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)]],
      value: [0, [Validators.min(0), Validators.max(100), Validators.required]],
      entityId: [null, Validators.required],
    })
  }

  private _patchForm() {
    this.globalAdditionForm.patchValue(this._globalAddition)
  }

  public get isUpdate(): number | boolean {
    return this._globalAddition.id;
  }

  public cancel() {
    this._dialogRef.close();
  }

  public onSubmit(): void {
    let action = this.isUpdate ? UpdateGlobalAddition : AddNewGlobalAddition;
    this._store.dispatch( new action(this.globalAdditionForm.value) ).subscribe((res)=>{
      this._snackbarService.openSuccessSnackbar({
        message: this.isUpdate ? OrgConfigInst.CRUD_CONFIG.messages.updated(`${this.globalAdditionForm.value.name} global addition`)
          : OrgConfigInst.CRUD_CONFIG.messages.created(`${this.globalAdditionForm.value.name} global addition`),
        duration: 5,
        showCloseBtn: false
      })
      this._dialogRef.close()
    })
  }

}
