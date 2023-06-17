import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrgConfigInst } from '@core/config/organization.config';
import { EntityModel } from '@modules/entities/model/entities.model';
import { AddNewEntity, UpdateEntity } from '@modules/entities/state/entities.actions';
import { EntitiesState } from '@modules/entities/state/entities.state';
import { Select, Store } from '@ngxs/store';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { ValidationService } from '@shared/modules/validation/validation.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrencyType } from '@modules/employees/model/employees.config';
import { HttpService } from '@core/http/http/http.service';
import { ModalsService } from '@shared/modules/modals/model/modals.service';

@Component({
  selector: 'app-entity-form',
  templateUrl: './entity-form.component.html',
  styleUrls: ['./entity-form.component.scss']
})

export class EntityFormComponent implements OnInit {

  public entityForm!: FormGroup;
  public backendError;
  // public isEntityEditable: boolean;
  public selectedCurrency = 'EGP';
  public currencies = CurrencyType;

  // @ViewChild('backendErrors')
  // backendErrorsRef: ElementRef;


  // public currencies = [
  //   {
  //   id:0,
  //   name: 'EGP'
  //   },
  //   {
  //     id:1,
  //     name: 'USD'
  //   },
  //   {
  //     id:2,
  //     name: 'EUR'
  //   }
  // ]

  @Select(EntitiesState.countries) public countries$: Observable<string[]>;
  constructor(
    @Inject(MAT_DIALOG_DATA) private _entity: EntityModel,
    private _dialogRef: MatDialogRef<EntityFormComponent>,
    private _formBuilder: FormBuilder,
    private _store: Store,
    private _validationService: ValidationService,
    private _snackbarService: SnackBarsService,
    private _http: HttpService,
    private _modalsService: ModalsService,
  ) {
    this._initForm();
  }

  public changeActiveCurrency(event){
    this.selectedCurrency = event.source.triggerValue
  }

  ngOnInit(): void {
    this._controls();
  }

  //! init Form
  private _initForm(): void {
    this.entityForm = this._formBuilder.group({
      id: ['', Validators.required],
      name: ['',[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)]],
      monthlyMinimumGrossSalaryForSocialInsurance:[0, [Validators.min(0), Validators.required]],
      monthlyMaximumGrossSalaryForSocialInsurance:[0, [Validators.min(0), Validators.required]],
      socialInsurancePercentage:[0, [Validators.min(0), Validators.max(100), Validators.required]],
      yearlyPersonalExemption:[0, [Validators.min(0), Validators.required]],
      status: [0],
      updateAlreadyJoinedProfiles:false,
      countryId:[1, Validators.required],
      currency:[0, Validators.required],
    }
    , {
      validators: this._validationService.rangeValidator(
        { name: 'monthlyMinimumGrossSalaryForSocialInsurance', label: 'Minimum Gross Salary' },
        { name: 'monthlyMaximumGrossSalaryForSocialInsurance', label: 'Maximum Gross Salary' }),
      updateOn: 'change'
    });
  }

  //! form Controls provider
  // public formControls = provideReactiveFormGetters(this.entityForm);

  //! submit form
  public submit(): void {
    // console.log(this.entityForm.value);
    this.backendError = null;
    const action = this.isUpdate ? UpdateEntity : AddNewEntity;
    this._store.dispatch(new action(this.entityForm.value))
    .pipe(
      catchError(err => {
        this.backendError = err.error;
        return of('')
      })
    )
    .subscribe((result) => {
      if(!this.backendError){
        this._snackbarService.openSuccessSnackbar({
          message: this.isUpdate ? OrgConfigInst.CRUD_CONFIG.messages.updated(`${this.entityForm.value.name} Entity`)
          : OrgConfigInst.CRUD_CONFIG.messages.created(`${this.entityForm.value.name} Entity`),
          duration: 5,
          showCloseBtn: false
        })
        this._dialogRef.close();
      } else {
        // document.querySelector('#backendError').scrollIntoView({ behavior: 'smooth'});
      }
    });
  }

  //! confirmation to apply the change to all employees
  public confirmChange(event) {
    if (event.checked){
      this.entityForm.get('updateAlreadyJoinedProfiles').setValue(false);
      this._modalsService.openConfirmationDialog({
        title: 'Apply on All Employees',
        class: 'danger',
        content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.apply('this change on all joined employees'),
        proceedText: OrgConfigInst.CRUD_CONFIG.actions.confirm,
      }, () => {
        this.entityForm.get('updateAlreadyJoinedProfiles').setValue(true);
      })
    }
  }



  //! Controlling Form according to mode
  private _controls(): void {
    // console.log('isUpdate', this.isUpdate)
    // console.log('isUpdate', this._entity)
    if (this.isUpdate) {
      this._patchForm()
      // this.getIsEntityEditable(this.entityForm.get('id').value)
    } else {
      this.entityForm.removeControl('id');
      this.entityForm.removeControl('updateAlreadyJoinedProfiles');
      this.getDefaultValues();
    }
  }

  private getDefaultValues(){
    this._http.fetch('Entities/GetDefaultEntityConfigurationValues').subscribe(res=>{
      // console.log('res', res.result)
      this.entityForm.patchValue(res.result)
    })
  }
  // private getIsEntityEditable(entityId){
  //   this._http.fetch(`Entities/IsEntityEditable?entityId=${entityId}`).subscribe(res=>{
  //     console.log('getEntityState', res.result)
  //     this.isEntityEditable = res.result
  //     if (!res.result){
  //       this.backendError.errorMessage = 'Entity is not Editable'
  //       console.log('backendError', this.backendError.errorMessage)
  //     }
  //   })
  // }

  //! patch form
  private _patchForm() {
    this.entityForm.patchValue(this._entity);
  }

  public get isUpdate(): number | boolean {
    return this._entity.id;
  }

  //! Mapping Form Keys before submitting
  // private _formMap(object){
  //   const { id, name, countryId, status} = object;
  //   return {id, name, countryId, status}
  // }

  //! close Dialog
  public closeDialog(): void {
    this._dialogRef.close();
  }

}
