import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { OrgEntityModel, OrgSalaryLevelModel } from '@core/modules/organization/model/organization.model';
import { GetOrgEntities } from '@core/modules/organization/state/organization.actions';
import { OrganizationState } from '@core/modules/organization/state/organization.state';
import { CalculateMonthlyNetSalaryModel, JoinEntityModel } from '@modules/employees/modules/employee-salary/model/salary-details.model';
import { JoinEntity, UpdateJoinedEntityInfo } from '@modules/employees/modules/employee-salary/state/salary-details.actions';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { provideReactiveFormGetters } from '@shared/helpers/provide-reactive-form-getters.helper';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ValidationService } from '@shared/modules/validation/validation.service';
import { Observable } from 'rxjs';
import * as dayJS from 'dayjs';
import { SalaryDetailsService } from '../../model/salary-details.service';
import { DatePickerConfigModel } from '@shared/models/snippits.model';
import { delay, tap } from 'rxjs/operators';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { OrgConfigInst } from '@core/config/organization.config';
import * as SALARY_DETAILS_MODELS from '@modules/employees/modules/employee-salary/model/salary-details.model'
import * as SALARY_DETAILS_ACTIONS from '@modules/employees/modules/employee-salary/state/salary-details.actions'
import moment from 'moment';
@Component({
  selector: 'app-employee-entity-form',
  templateUrl: './employee-entity-form.component.html',
  styles: [
  ]
})
export class EmployeeEntityFormComponent implements OnInit {


  constructor(
    private _dialogRef: MatDialogRef<EmployeeEntityFormComponent>,
    private _salaryDetailsService: SalaryDetailsService,
    @Inject(MAT_DIALOG_DATA) private config: { entity: JoinEntityModel },
    private _FB: FormBuilder,
    private _store: Store,
    private _validationService: ValidationService,
    private _snackbarService: SnackBarsService,
    private _modalsService: ModalsService,
  ) { }



  @Select(OrganizationState.salaryLevels) public salaryLevels$: Observable<OrgSalaryLevelModel[]>;
  @ViewSelectSnapshot(OrganizationState.entities) public entities: OrgEntityModel[];
  @ViewSelectSnapshot(OrganizationState.salaryLevels) public salaryLevels: OrgSalaryLevelModel[];

  // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
  public datePickerConfig: DatePickerConfigModel = {
    min: new Date(new Date().getFullYear() - 10, 0, 1),
    max: new Date(new Date().getFullYear() + 1, 11, 31)
  }


  public salaryLevelSubscription;
  public socialInsurancePercentage = null;
  public salaryLevelShowcase: OrgSalaryLevelModel = null;

  public get isEdit(): number | undefined {
    return this.config.entity?.entityId;
  }


  public employeeEntityForm: FormGroup = this._FB.group({
    profileId: [this.config.entity.profileId],
    entityId: [null, Validators.required],
    // salaryLevelId: [null, Validators.required],

    monthlyPersonalExemptionAmount: [{
      value: null,
      disabled: !this.isEdit
    }, [
      Validators.required,
      Validators.min(0),
      this._validationService.positiveDoubleValidator()
    ]],
    monthlyGrossSalary: [{ value: null, disabled: true }, [
      Validators.required,
      Validators.min(1),
      this._validationService.positiveDoubleValidator(),
    ]],
    monthlyBaseSocialInsuranceAmount: [{ value: null, disabled: true }, [
      Validators.required,
      Validators.min(0),
      this._validationService.positiveDoubleValidator()
    ]],
    monthlySocialInsuranceAmount: [{ value: null, disabled: true }, [
      Validators.required,
      Validators.min(0),
      this._validationService.positiveDoubleValidator()
    ]],
    monthlyNetSalary: [{ value: null, disabled: true }, [
      Validators.required,
      Validators.min(0),
      this._validationService.positiveDoubleValidator()
    ]],
    employeeType: [0, [
      Validators.required,
    ]],
    joinedDate: [new Date()]
  }, {
    validators: this._validationService.rangeValidator(
      { name: 'monthlySocialInsuranceAmount', label: 'Social insurance' },
      { name: 'monthlyGrossSalary', label: 'Gross salary' }),
    updateOn: 'change'
  })

  public formControls = provideReactiveFormGetters(this.employeeEntityForm, '');


  ngOnInit(): void {
    this.getEntities();
    // this.getSalaryLevels();
    // this.onGrossValueUpdates();
    // Incase of edit use previous assigned personal exemption and on join use the default
    if (this.isEdit) this._editSetups();
  }


  /**
   * @summary 
   * - Patch from with joined entity
   * - Enable social insurance and gross salary controls
   * - Set the select salary level
   */
  private _editSetups() {
    this._patchSalaryForm();
    this.grossSalaryControl.enable();
    this.baseSocialInsuranceControl.enable();
    // this.salaryLevelSubscription = this.salaryLevels$.subscribe((res: OrgSalaryLevelModel[]) => {
    //   if (res?.length) {
    //     this.onSalaryLevelChange(this.config.entity.salaryLevelId);
    //   }
    // })
  }


  private _patchSalaryForm() {
    console.log(this.config.entity);
    this.employeeEntityForm.patchValue({
      ...this.config.entity,
      monthlyBaseSocialInsuranceAmount: this.config.entity.monthlyBaseSocialInsurance,
      joinedDate: moment(this.config.entity.joinedDate.split('T')[0]).utc(false).format()
    });
    this.socialInsurancePercentage = this.config.entity.socialInsurancePercentage;
  }


  /**
   * @param $event  event param that selected
   * @summary Enable specific fields when entity got selected
   * then register value on form field and get the default personal exemption
   */
  public onEntitySelect($event: MatSelectChange) {
    if ($event.value !== null) {
      this.grossSalaryControl.enable();
      this.baseSocialInsuranceControl.enable();
      this.personalExemptionControl.enable();
      this.socialInsurancePercentage = this._store.selectSnapshot(OrganizationState.entities).find(entity => entity.id === $event.value).socialInsurancePercentage;
      this.employeeEntityForm.get('entityId').setValue($event.value);
      this._salaryDetailsService.getDefaultMonthlyPersonalExemption($event.value).subscribe((res => this.personalExemptionControl.setValue(res)));
    }
    else this.grossSalaryControl.disable();

  }


  /**
   * Update social insurance after gross salary level been update
   */
  public onGrossSalaryChange() {
    const monthlyGrossSalary = this.grossSalaryControl.value;
    if (monthlyGrossSalary !== null && !isNaN(monthlyGrossSalary)) {
      this._salaryDetailsService.CalculateMonthlyBaseSocialInsurance({
        entityId: this.employeeEntityForm.get('entityId').value,
        monthlyGrossSalary
      }).pipe(
        tap((result) => this.baseSocialInsuranceControl.setValue(result)),
        delay(500),
        tap(() => this.onSalaryNetFactorsChange())
      ).subscribe()
    }
  }


  // onGrossValueUpdates(): void {
  //   this.grossSalaryControl.valueChanges.subscribe(val => {
  //     this.onGrossSalaryChange();
  //   })
  // }




  /**
   * @summary Fired whenever any value of the three fields below got changed 
   * it validates their value first then send request to calculate the net salary and insurance
   * After that it updates their fields values
   */
  public onSalaryNetFactorsChange() {
    if (this.personalExemptionControl.value >= 0
      && this.grossSalaryControl.value >= 1
      && this.baseSocialInsuranceControl.value >= 0) {
      const body: CalculateMonthlyNetSalaryModel = {
        entityId: this.formControls.entityId.value,
        monthlyGrossSalary: this.grossSalaryControl.value,
        monthlyPersonalExemptionAmount: this.personalExemptionControl.value,
        monthlyBaseSocialInsurance: this.baseSocialInsuranceControl.value
      }
      this._salaryDetailsService.calculateMonthlyNetSalaryAndInsurance(body).subscribe((result) => {
        this.netSalaryControl.setValue(result.netSalary);
        this.socialInsuranceControl.setValue(result.socialInsurance)
      })
    }
  }


  // public onSalaryLevelChange(value) {
  //   this.salaryLevelShowcase = this.salaryLevels.find(salaryLevel => salaryLevel.id == value);
  //   // this.formControls.salaryLevelId.setValue(value);
  // }


  public submit(): void {
    const joinedDate = dayJS(this.employeeEntityForm.get('joinedDate').value).add(1, 'date').format('YYYY-MM-DD');
    const action = this.isEdit ? UpdateJoinedEntityInfo : JoinEntity;
    this._store.dispatch(new action({ ...this.employeeEntityForm.getRawValue(), joinedDate }))
    .subscribe((res) => {
      let currentEntity = res.employees.employeeProfile.salaryDetails.entityInfo.filter(entity=>{
        return entity.entityId === this.formControls.entityId.value
      })
      if (currentEntity[0].allocatedDays > 0) {
        this._modalsService.openConfirmationDialog({
          title: 'Allocation Added Successfully',
          class: 'success',
          content: `${currentEntity[0].allocatedDays > 1 ? currentEntity[0].allocatedDays+' days have' : currentEntity[0].allocatedDays+' day has'} been added as an allocation`,
          proceedText: OrgConfigInst.CRUD_CONFIG.actions.ok,
          noCancelButton: true
        },() => {
          this._dialogRef.close();
        })
      } else {
        this._snackbarService.openSuccessSnackbar({
          message: this.isEdit ? 'Entity relationship has been updated Successfully' :
          'Employee has been joined to entity successfully',
          duration: 5,
          showCloseBtn: true
        })
        this._dialogRef.close();
      }
      this._store.dispatch(new SALARY_DETAILS_ACTIONS.GetPersonalInfo(this.config.entity.profileId))
    });
  }


  public closeDialog(): void {
    this._dialogRef.close();
  }



  // controls
  public get socialInsuranceControl(): AbstractControl {
    return this.employeeEntityForm.get('monthlySocialInsuranceAmount');
  }

  public get baseSocialInsuranceControl(): AbstractControl {
    return this.employeeEntityForm.get('monthlyBaseSocialInsuranceAmount');
  }
  public get grossSalaryControl(): AbstractControl {
    return this.employeeEntityForm.get('monthlyGrossSalary');
  }

  public get personalExemptionControl(): AbstractControl {
    return this.employeeEntityForm.get('monthlyPersonalExemptionAmount');
  }

  public get netSalaryControl(): AbstractControl {
    return this.employeeEntityForm.get('monthlyNetSalary');
  }


  // Actions
  @Dispatch() getEntities() { return new GetOrgEntities() }
  // @Dispatch() getSalaryLevels() { return new GetOrgSalaryLevels() }




  // ngOnDestroy() {
    // if (this.salaryLevelSubscription) this.salaryLevelSubscription.unsubscribe()
  // }


}
