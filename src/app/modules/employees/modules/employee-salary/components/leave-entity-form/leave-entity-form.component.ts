import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrgConfigInst } from '@core/config/organization.config';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import * as dayJS from 'dayjs';
import { LeaveEntityModel } from '../../model/salary-details.model';
import { LeaveEntity } from '../../state/salary-details.actions';

@Component({
  selector: 'app-leave-entity-form',
  templateUrl: './leave-entity-form.component.html',
  styles: [
  ]
})
export class LeaveEntityFormComponent {

  constructor(
    private _dialogRef: MatDialogRef<LeaveEntityFormComponent>,
    @Inject(MAT_DIALOG_DATA) private _config: LeaveEntityModel,
    private _FB: FormBuilder,
    private _store: Store,
    private _snackbarService: SnackBarsService
  ) { }



  public get submitButtonTextContent(): string {
    return this._config.type === 'leave' ? 'Leave Entity' : 'Update Leave Date'
  }

  public leaveEntityForm: FormGroup = this._FB.group({
    profileId: [this._config.profileId],
    entityId: [this._config.entityId],
    leftDate: [this._config.leftDate, Validators.required]

  })



  public submit(): void {
    const leftDate = dayJS(this.leaveEntityForm.get('leftDate').value).format('YYYY-MM-DD')
    this._store.dispatch(new LeaveEntity({ ...this.leaveEntityForm.value, leftDate }))
      .subscribe(() => {

        this._snackbarService.openSuccessSnackbar({

          message: OrgConfigInst.CRUD_CONFIG.messages.left(`Entity`),
          duration: 5,
          // showCloseBtn: true
        })
        this._dialogRef.close();

      });
  }


  public closeDialog(): void {
    this._dialogRef.close();
  }

}
