import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { SalaryDetailsState } from './../../state/salary-details.state';
import { Component, OnInit } from '@angular/core';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import * as SALARY_MODEL from '@modules/employees/modules/employee-salary/model/salary-details.model'
import * as SALARY_DETAILS_ACTION from '@modules/employees/modules/employee-salary/state/salary-details.actions'
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
@Component({
  selector: 'app-employee-suspend-salary',
  templateUrl: './employee-suspend-salary.component.html',
  styleUrls: ['./employee-suspend-salary.component.scss']
})
export class EmployeeSuspendSalaryComponent implements OnInit {
  @ViewSelectSnapshot(SalaryDetailsState.personalInfo) public personalInfo: SALARY_MODEL.EmployeePersonalInfo;
  @ViewSelectSnapshot(SalaryDetailsState.suspensionReasons) public suspensionReasons: SALARY_MODEL.SuspensionReasonsModel[];

  public employeeSuspendForm: FormGroup;
  public makeRemarkAttributeRequired: boolean = false
  public formControls: { [control: string]: AbstractControl | FormControl };

  constructor(private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<EmployeeSuspendSalaryComponent>,
    private _store: Store,
    private _snackbarService: SnackBarsService) { }

  ngOnInit(): void {
    this._getSalarySuspensionReasons()
   this._initForm()
  }

  public onChangeSuspendReason(value) {
    if (value === 28) {
      this.makeRemarkAttributeRequired = true
      this.employeeSuspendForm.get('remarks').setValidators([Validators.required])
      this.employeeSuspendForm.get('remarks').updateValueAndValidity()
    } else {
      this.makeRemarkAttributeRequired = false
      this.employeeSuspendForm.get('remarks').setValidators(null)
      this.employeeSuspendForm.get('remarks').updateValueAndValidity()
    }
  }

  private _initForm() {
    this.employeeSuspendForm = this._fb.group({
      suspensionReasonId: ["", [Validators.required]],
      remarks: [""],
      profileId: this.personalInfo.id,
      suspendDate: new Date().toLocaleDateString('en-CA')
    })
    this.formControls = provideReactiveFormGetters(this.employeeSuspendForm, '');
  }

  public onSubmit() {
    this._store.dispatch(new SALARY_DETAILS_ACTION.SuspendSalary(this.employeeSuspendForm.value)).subscribe(() => {
      this._snackbarService.openSuccessSnackbar({
        message: `${this.personalInfo.name} has been Suspended Successfully`,
        duration: 5,
        showCloseBtn: false,
      })
     this._store.dispatch(new SALARY_DETAILS_ACTION.GetPersonalInfo(this.personalInfo.id))
      this.onClose();
    })
  }

  public onClose() {
    this._dialogRef.close();
  }
  @Dispatch() private _getSalarySuspensionReasons() { return new SALARY_DETAILS_ACTION.GetSalarySuspensionReasons()}

}
