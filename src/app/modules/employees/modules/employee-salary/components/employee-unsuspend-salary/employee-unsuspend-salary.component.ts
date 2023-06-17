import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { SalaryDetailsState } from './../../state/salary-details.state';
import { Component, OnInit } from '@angular/core';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import * as SALARY_MODEL from './../../model/salary-details.model'
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import * as SALARY_DETAILS_ACTIONS from '@modules/employees/modules/employee-salary/state/salary-details.actions';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-unsuspend-salary',
  templateUrl: './employee-unsuspend-salary.component.html',
  styleUrls: ['./employee-unsuspend-salary.component.scss']
})
export class EmployeeUnsuspendSalaryComponent implements OnInit {
  @ViewSelectSnapshot(SalaryDetailsState.personalInfo) public personalInfo: SALARY_MODEL.EmployeePersonalInfo;
  @ViewSelectSnapshot(SalaryDetailsState.suspensionDetails) public suspensionDetails: SALARY_MODEL.SuspensionDetailsModel;

  public unSuspendForm: FormGroup;
  public unSuspendDate: string
  constructor(private _fb: FormBuilder,
              private _store: Store,
              private _snackbarService: SnackBarsService,
              private _dialogRef: MatDialogRef<EmployeeUnsuspendSalaryComponent>) { }

  ngOnInit(): void {
    this._initForm()
    this._getSuspenionDetails()
    this.unSuspendDate = new Date().toLocaleDateString('en-CA')
  }

  private _initForm() {
    this.unSuspendForm = this._fb.group({
      profileId: this.personalInfo.id,
      remarks: [""],
    })
  }

  public onSubmit() {
    this._store.dispatch(new SALARY_DETAILS_ACTIONS.UnSuspendSalary(this.unSuspendForm.value)).subscribe(() => {
      this._store.dispatch(new SALARY_DETAILS_ACTIONS.GetPersonalInfo(this.personalInfo.id))
      this._snackbarService.openSuccessSnackbar({
        message: `${this.personalInfo.name} has been UnSuspended Successfully`,
        duration: 5,
        showCloseBtn: false,
      })
      this.onClose();
    })
  }

  public onClose() {
    this._dialogRef.close()
  }

  @Dispatch() private _getSuspenionDetails() {return new SALARY_DETAILS_ACTIONS.GetSuspensionDetails(this.personalInfo.id)}

}
