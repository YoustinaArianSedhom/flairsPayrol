import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ValidationService } from '@shared/modules/validation/validation.service';
import { AdditionDeductionState } from '../../state/addition-deduction.state';


import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as _moment from 'moment';
// eslint-disable-next-line no-duplicate-imports
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdditionDeductionModel } from '../../model/addition-deduction.model';
import { OrgConfigInst } from '@core/config/organization.config';
import { AddAdditionForProfile, AddDeductionForProfile, EditAdditionForProfile, EditDeductionForProfile } from '../../state/addition-deduction.actions';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'M/YYYY',
  },
  display: {
    dateInput: 'M/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-addition-deduction-form',
  templateUrl: './addition-deduction-form.component.html',
  styleUrls: ['./addition-deduction-form.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})


export class AdditionDeductionFormComponent implements OnInit {
  public startDate = `${this._additionDeduction.PayrollYear}-${this._additionDeduction.PayrollMonth}`;
  public endDate = `${this._additionDeduction.PayrollYear}-${this._additionDeduction.PayrollMonth}`;
  constructor(
    @Inject(MAT_DIALOG_DATA) public _additionDeduction: AdditionDeductionModel,
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _validationService: ValidationService,
    private _snackbarService: SnackBarsService,
    private _dialogRef: MatDialogRef<AdditionDeductionFormComponent>,
  ) {
    this._initForm();
  }

  public additionDeductionForm!: FormGroup;
  public backendError!: {
    errorCode: number
    errorMessage: string
  };
  public mode = 0;
  public minDate = moment(new Date(this.startDate));
  private selectedTypeName: string;

  @ViewSelectSnapshot(AdditionDeductionState.additionTypes) public additionTypes: { id: number, name: string }[];
  @ViewSelectSnapshot(AdditionDeductionState.deductionTypes) public deductionTypes: { id: number, name: string }[];


  // public isAddition: boolean;
  @Input() public additions;
  @Input() public deductions;
  @Input() public type;

  ngOnInit(): void {
    this._controls();
    if (this._additionDeduction) {
      // alert(this.startDate)
    }
  }

  public selectedType($event) {
    this.selectedTypeName = $event.source.triggerValue
  }



  //! init Form
  private _initForm(): void {
    this.additionDeductionForm = this._formBuilder.group({
      id: [null],
      profileId: [null, Validators.required],
      entityId: [null, [Validators.required]],
      additionTypeId: [1, [Validators.required]],
      deductionTypeId: [1, [Validators.required]],
      value: [null, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$"), this._validationService.positiveIntegersValidator()]],
      notes: [''],
      startMonth: [null, [Validators.required]],
      startYear: [null, [Validators.required]],
      endMonth: [null, [Validators.required]],
      endYear: [null, [Validators.required]],
      from: [moment(new Date(this.startDate))],
      to: [moment(new Date(this.endDate))],
    }, {
      validators: this._validationService.rangeValidator({ name: 'from', label: 'From Date' }, { name: 'to', label: 'To Date' }, true)
    });
  }

  public modeChanged(event$) {
    this.mode = event$.value
    // console.log('addtion mode ', event$.value)
    //!addition mode
    if (event$.value === 0) {
      // this.additionDeductionForm.removeControl('deductionTypeId');
      this.additionDeductionForm.get('deductionTypeId').clearValidators;
      this.additionDeductionForm.get('deductionTypeId').updateValueAndValidity;

      //!deduction mode
    } else {
      // this.additionDeductionForm.removeControl('additionTypeId');
      this.additionDeductionForm.get('additionTypeId').clearValidators;
      this.additionDeductionForm.get('additionTypeId').updateValueAndValidity;
    }
  }

  //! Controlling Form according to mode
  private _controls(): void {
    this.isAddition ? this.selectedTypeName = this.additionTypes[0].name : this.selectedTypeName = this.deductionTypes[0].name

    this.additionDeductionForm.get('startMonth').setValue(this.additionDeductionForm.get('from').value.month() + 1)
    this.additionDeductionForm.get('startYear').setValue(this.additionDeductionForm.get('from').value.year())
    this.additionDeductionForm.get('endMonth').setValue(this.additionDeductionForm.get('to').value.month() + 1)
    this.additionDeductionForm.get('endYear').setValue(this.additionDeductionForm.get('to').value.year())

    this.additionDeductionForm.patchValue(this._additionDeduction)

    //!addition mode
    if (this._additionDeduction.additionTypeId) {
      this.mode = 0
      // this.additionDeductionForm.removeControl('deductionTypeId');
      this.additionDeductionForm.get('deductionTypeId').clearValidators;
      this.additionDeductionForm.get('deductionTypeId').updateValueAndValidity;

      //!deduction mode
    } else {
      this.mode = 1
      // this.additionDeductionForm.removeControl('additionTypeId');
      this.additionDeductionForm.get('additionTypeId').clearValidators;
      this.additionDeductionForm.get('additionTypeId').updateValueAndValidity;
    }
  }


  public positiveOnly(e) {
    if (!((e.keyCode > 95 && e.keyCode < 106)
      || (e.keyCode > 47 && e.keyCode < 58)
      || e.keyCode === 8 || e.keyCode === 9)) {
      return false;
    }
  }

  public get isAddition(): number | boolean {
    return this._additionDeduction.additionTypeId;
  }
  public get isUpdate(): number | boolean {
    return this._additionDeduction.id;
  }


  public submit(): void {
    // console.log(this.additionDeductionForm.value);
    this.backendError = null;

    const actionsMap = {
      addAddition: (!this.isUpdate && this.isAddition) ? true : false,
      editAddition: (this.isUpdate && this.isAddition) ? true : false,
      addDeduction: (!this.isUpdate && !this.isAddition) ? true : false,
      editDeduction: (this.isUpdate && !this.isAddition) ? true : false
    }

    const action =
      (actionsMap.addAddition) ? AddAdditionForProfile :
        (actionsMap.editAddition) ? EditAdditionForProfile :
          (actionsMap.addDeduction) ? AddDeductionForProfile : EditDeductionForProfile;
    // (actionsMap.editDeduction) ? 
    // alert(action)
    this._store.dispatch(new action(this.additionDeductionForm.value))
      // .pipe(
      //   catchError(err => {
      //     this.backendError = err.error;
      //     return of('')
      //   })
      // )
      .subscribe((result) => {
        if (!this.backendError) {
          console.log('additionDeductionForm added added added', result)
          this._snackbarService.openSuccessSnackbar({
            message: this.isUpdate ? OrgConfigInst.CRUD_CONFIG.messages.updated(`${this.isAddition ? this._additionDeduction.additionType.name : this._additionDeduction.deductionType.name}`)
              : OrgConfigInst.CRUD_CONFIG.messages.created(`${this.selectedTypeName}`),
            duration: 5,
            showCloseBtn: false
          })
          this._dialogRef.close();
        }
      });
  }

  // fg: FormGroup;
  // this.fg = new FormGroup(
  //   {
  //     from: new FormControl(""),
  //     to: new FormControl("")
  //   },
  //   [Validators.required, this.dateRangeValidator]
  // );

  // from = new FormControl(moment());
  // to = new FormControl(moment());

  // private dateRangeValidator: ValidatorFn = (): {
  //   [key: string]: any;
  // } | null => {
  //   let invalid = false;
  //   const from = this.additionDeductionForm && this.additionDeductionForm.get("from").value;
  //   const to = this.additionDeductionForm && this.additionDeductionForm.get("to").value;
  //   if (from && to) {
  //     invalid = new Date(from).valueOf() > new Date(to).valueOf();
  //   }
  //   return invalid ? { invalidRange: { from, to } } : null;
  // };

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    // console.log('datepicker', datepicker.panelClass[0]);
    let ctrlValue;
    if (datepicker.panelClass[0] === 'fromDate') {
      ctrlValue = this.additionDeductionForm.get('from').value;
    } else {
      ctrlValue = this.additionDeductionForm.get('to').value;
    }
    ctrlValue.year(normalizedYear.year());
    const selectedYear1 = ctrlValue.year();
    if (datepicker.panelClass[0] === 'fromDate') {
      this.additionDeductionForm.get('startYear').setValue(selectedYear1)
      this.additionDeductionForm.get('from').setValue(ctrlValue);
    } else {
      this.additionDeductionForm.get('endYear').setValue(selectedYear1)
      this.additionDeductionForm.get('to').setValue(ctrlValue);
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    // console.log('datepicker', datepicker.panelClass[0]);
    let ctrlValue;
    if (datepicker.panelClass[0] === 'fromDate') {
      ctrlValue = this.additionDeductionForm.get('from').value;
    } else {
      ctrlValue = this.additionDeductionForm.get('to').value;
    }
    ctrlValue.month(normalizedMonth.month());
    const selectedMonth1 = ctrlValue.month() + 1;
    if (datepicker.panelClass[0] === 'fromDate') {
      this.additionDeductionForm.get('startMonth').setValue(selectedMonth1)
      this.additionDeductionForm.get('from').setValue(ctrlValue);
    } else {
      this.additionDeductionForm.get('endMonth').setValue(selectedMonth1)
      this.additionDeductionForm.get('to').setValue(ctrlValue);
    }

    datepicker.close();
  }

}
