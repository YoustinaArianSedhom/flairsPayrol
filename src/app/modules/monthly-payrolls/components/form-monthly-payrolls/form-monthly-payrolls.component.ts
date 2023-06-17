import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { OrgConfigInst } from '@core/config/organization.config';
import { OrgEntityModel } from '@core/modules/organization/model/organization.model';
import { GetOrgEntities } from '@core/modules/organization/state/organization.actions';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { CreateMonthlyPayroll } from '@modules/monthly-payrolls/state/monthly-payrolls.actions';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-form-monthly-payrolls',
  templateUrl: './form-monthly-payrolls.component.html',
  styles: [
  ],
})
export class FormMonthlyPayrollsComponent implements OnInit {

  constructor(
    private _dialogRef: MatDialogRef<FormMonthlyPayrollsComponent>,
    private _FB: FormBuilder,
    private _store: Store,
    private _snackbarService: SnackBarsService
  ) { }

  public backendError!: {
    errorCode: number
    errorMessage: string
  };


  @ViewSelectSnapshot(OrganizationState.entities) public entities: OrgEntityModel[];
  
  
  
  public datePickerConfig: {min: Date} = {
    min: new Date(2019, 12, 30)
  }
  public monthlyPayrollForm: FormGroup = this._FB.group({
    name: {
      value: null,
      disabled: true,
    },
    entityId: [null, Validators.required],
    month: [null, [
      Validators.required,
      Validators.min(0),
      Validators.max(12)
    ]],
    year: [null, [
      Validators.required,
      Validators.min(2000),
      Validators.max(new Date().getFullYear())
    ]],
    date: {value: null, disabled: true,}

  })
  public controls = provideReactiveFormGetters(this.monthlyPayrollForm, '')


  ngOnInit(): void {
    this.fireGetEntities();
  }


  public onEntitySelect($event: MatSelectChange) {
    this.controls.entityId.setValue($event.value);
    if (this.controls.date.value) this._setPayrollName();
  }


  /**
   * Set the value of month and year manually based on the selected month and year
   * and check if entity is selected then set payroll name
   *
   * close date picker manually to emulate month selection
   *
   * @param dateWrapper dateWrapper Param
   * @param datePickerRef  datePickerRef Param
   */
  public onMonthSelection(dateWrapper, datePickerRef: MatDatepicker<any>) {
    const { month, year } = { month: dateWrapper.month() + 1, year: dateWrapper.year() }
    this.controls.date.setValue(dateWrapper.toDate());
    this.controls.month.setValue(month);
    this.controls.year.setValue(year);
    if (this.controls.entityId.value) this._setPayrollName();


    datePickerRef.close();
  }


  /**
   * Set payroll name based on selected year, month and entity name
   */
  private _setPayrollName() {
    const monthName = this.controls.date.value.toLocaleString('default', {month: 'long'});
    const entityName: string = this.entities.find(entity => entity.id === this.controls.entityId.value).name;
    this.controls.name.setValue(`${entityName}'s ${monthName} ${this.controls.year.value} Payroll`)
  }


  public submit(): void {
    this.backendError = null;
    this._store.dispatch(new CreateMonthlyPayroll(this.monthlyPayrollForm.getRawValue()))
      .pipe(
        catchError(err => {
          this.backendError = err.error;
          return of(err.error)
        })
      )
      .subscribe((result) => {
        if (!this.backendError) {
          this._snackbarService.openSuccessSnackbar({
            message: OrgConfigInst.CRUD_CONFIG.messages.created(`"${this.controls.name.value}"`),
            duration: 5,
          })
          this._dialogRef.close();
        }
      });
  }


  @Dispatch() public fireGetEntities() {
    return new GetOrgEntities()
  }

}
