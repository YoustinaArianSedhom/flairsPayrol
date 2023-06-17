import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { EmployeeModel } from '@modules/employees/model/employees.model';
import { PaymentPlanModelRequest } from '@modules/loans/model/loans.models';
import { LoansService } from '@modules/loans/model/loans.service';
import * as LOANS_MODEL from '@modules/loans/model/loans.models';
import { CreateLoan, CreateLoanAsDraft, DeleteLoan, GetById, getPaymentPlan, ResetPaymentPlan, UpdateLoan } from '@modules/loans/state/loans.actions';
import { Dispatch } from '@ngxs-labs/dispatch-decorator';
import { DatePickerConfigModel } from '@shared/models/snippits.model';
import { Observable } from 'rxjs/internal/Observable';
import { startWith, switchMap, debounceTime, catchError } from 'rxjs/operators';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Select, Store } from '@ngxs/store';
import { LoansState } from '@modules/loans/state/loans.state';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import moment from 'moment';
import { ConfirmationDialogDataModel } from '@shared/modules/modals/model/modals.model';
import { OrgConfigInst } from '@core/config/organization.config';
import { ModalsService } from '@shared/modules/modals/model/modals.service';
import { of } from 'rxjs';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-create-loan',
  templateUrl: './create-loan.component.html',
  styleUrls: ['./create-loan.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class CreateLoanComponent implements OnInit, OnDestroy {

  public pageTitle = 'Create New Loan';
  public id: number;
  public editMode: boolean;
  public createLoanForm!: FormGroup;
  public filteredEmployees: Observable<EmployeeModel[]>;
  public transferDatePickerConfig: DatePickerConfigModel = {
    min: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    max: new Date(new Date().getFullYear() + 2, 11, 31)
  }
  public firstInstallmentdatePickerConfig: DatePickerConfigModel = {
    min: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    max: new Date(new Date().getFullYear() + 2, 11, 31)
  }
  public paymentPlanData: PaymentPlanModelRequest;
  public showTable :  boolean;

  public selectedMonth = new Date();
  public backendError!: {
    errorCode: number
    errorMessage: string
  };
  public selectedProfile: any;
  private _formValue;


  @Select(LoansState.paymentPlanList) public paymentPlanList$: Observable<LOANS_MODEL.PaymentPlanListModel[]>;
  @Select(LoansState.paymentPlan) public paymentPlan$: Observable<LOANS_MODEL.PaymentPlanModel>;
  @SelectSnapshot(LoansState.paymentPlan) private paymentPlan: LOANS_MODEL.PaymentPlanModel;
  @Select(LoansState.createLoanResponse) createLoanResponse$: Observable<LOANS_MODEL.CreateLoanResponseModel>;
  @Select(LoansState.createLoanAsDraftResponse) createLoanAsDraftResponse$:  Observable<LOANS_MODEL.CreateLoanResponseModel>;
  @SelectSnapshot(LoansState.loan) loan: LOANS_MODEL.GetLoanByIDResponseModel;
  
  @ViewChild('formDirective') documentEditForm: FormGroupDirective; 

  @Dispatch() private _fireGetPaymentPlanAction() {
    this.paymentPlanData = {
      loanGrossAmount: this.createLoanForm.controls.grossAmount.value,
      firstInstallmentDate: {
        month:
          this.createLoanForm.controls.firstInstallmentMonth.value + 1,
        year: this.createLoanForm.controls.firstInstallmentYear.value,
      },
      numberOfInstallment:
        this.createLoanForm.controls.numberOfInstallments.value,
      loanId: this.id ? +this.id : null,
      numberOfRemainingInstallments:
                this.createLoanForm.controls.numberOfRemainingInstallments?.value
    };
    return new getPaymentPlan({...this.paymentPlanData});
  }

  @Dispatch() private _fireCreateLoanAction(results) {
    return new CreateLoan(results);
  }

  @Dispatch() private _fireCreateLoanAsDraftAction(results) {
    return new CreateLoanAsDraft(results);
  }

  constructor(
    private _formBuilder:FormBuilder, 
    private _loansService: LoansService,
    private _snackbarService: SnackBarsService,
    private _router: Router,
    private _store: Store,
    private _route: ActivatedRoute,
    private _dialog: ModalsService,
  ) { }


  ngOnInit(): void {
    this._initForm();
    this._route.params.subscribe(data =>{
      this.id = data.id;
      if (this.id) {
        this._store.dispatch(new GetById(this.id)).subscribe((data) => {
          if (data) {
            this.fillFormData(this.loan);
            this._fireGetPaymentPlanAction();
          }
        });
      }
    });
    this.showTable = false;
    this.paymentPlan$.subscribe(data => {
      if (data) {
        this.showTable = true;
        if(this.loan?.status.id === 3 && this.paymentPlan.numberOfPaidInstallments != null && this.paymentPlan.numberOfUnpaidInstallments != null){
          this.createLoanForm.controls.numberOfInstallments.setValue(this.paymentPlan.numberOfPaidInstallments + this.paymentPlan.numberOfUnpaidInstallments)
          this._formValue = { ...this.createLoanForm.getRawValue() };
        }
      }
    });
    
    this.createLoanForm.valueChanges.pipe(debounceTime(100)).subscribe(() => {

      if (
        JSON.stringify(this._formValue) !==
        JSON.stringify(this.createLoanForm.getRawValue())
      ) {
        this._formValue = { ...this.createLoanForm.getRawValue() };
        // if(!this._isEditFromApi){
        if (
          (this.createLoanForm.controls.grossAmount.valid &&
            this.createLoanForm.controls.firstInstallmentDateMoment.valid &&
            this.createLoanForm.controls.numberOfInstallments.valid) ||
          (this.editMode &&
            this.loan)
        ) {
          
            this._fireGetPaymentPlanAction();
          
        }
      }
    });
  }

  //! init Form
  private _initForm(): void {
    this.createLoanForm = this._formBuilder.group({
      name: [null, Validators.required],
      eMail: [{value: '', disabled: true}, Validators.required],
      profileId: [null, Validators.required],
      grossAmount: ['', {validators:[Validators.required, Validators.min(1), Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)], updateOn: 'blur'}],
      transferDateMoment: ['', [Validators.required]],
      transferDateMonth: ['', Validators.required],
      transferDateYear: ['', Validators.required],
      firstInstallmentDateMoment: ['', Validators.required],
      firstInstallmentMonth: ['', Validators.required],
      firstInstallmentYear: ['', Validators.required],
      numberOfInstallments: ['', {validators: [Validators.required,Validators.max(700), Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)], updateOn: 'blur'}],
      purpose: ['', {validators: [Validators.maxLength(500)], emitEvent:false, onlySelf: true}]
    } );
    
    this.filteredEmployees = this.createLoanForm.controls.name.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      switchMap(value => this._filter(value || ''))
      );
    
  }

  private _filter(value) {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : value.name;
    return this._loansService.findLoanEligableProfiles(filterValue);
  }

  public displayFunction(object) {    
    return object ? object.name : object;
  }

  public setEmployee(profile) {    
    this.selectedProfile = profile
    this.createLoanForm.controls.profileId.setValue(profile.id);
    this.createLoanForm.controls.eMail.setValue(profile.organizationEmail);
    this.transferDatePickerConfig = {
      ...this.transferDatePickerConfig,
      min:null
    }
    this.updateTransferDate(profile)
    // if(profile.profileEntityLastPublishedPayrollDate){
      this.createLoanForm.controls.transferDateMoment.reset();
      this.createLoanForm.controls.firstInstallmentDateMoment.reset();
    // }
  }

  updateTransferDate(item, transferDate?){
    this.selectedProfile = item;

    let lastPublishedDate = new Date(this?.selectedProfile?.profileEntityLastPublishedPayrollDate);
    let transferDateVar = new Date(new Date(transferDate).getFullYear(), new Date(transferDate).getMonth(), 1)
    
    if (!transferDate && lastPublishedDate) {
      this.firstInstallmentdatePickerConfig = {
        min: new Date(lastPublishedDate.getFullYear(), lastPublishedDate.getMonth()+1, lastPublishedDate.getDate() )
        , max: new Date(new Date().getFullYear() + 2, 11, 31)
      }
    }
    else if (transferDate && lastPublishedDate){
      this.firstInstallmentdatePickerConfig = {
        min: new Date(lastPublishedDate.getFullYear(), lastPublishedDate.getMonth()+1, lastPublishedDate.getDate() )
        , max: new Date(new Date().getFullYear() + 2, 11, 31)
      }
      this.transferDatePickerConfig = {
        ...this.transferDatePickerConfig,
        min:null
      }
      // if(transferDateVar.getTime() <= lastPublishedDate.getTime()){
      //   this.firstInstallmentdatePickerConfig = {
      //     min: new Date(lastPublishedDate.getFullYear(), lastPublishedDate.getMonth()+1, lastPublishedDate.getDate() )
      //     , max: new Date(new Date().getFullYear() + 2, 11, 31)
      //   }
      // }else{
      //   this.firstInstallmentdatePickerConfig = {
      //     min: new Date(transferDateVar.getFullYear(), transferDateVar.getMonth()+1, transferDateVar.getDate() )
      //     , max: new Date(new Date().getFullYear() + 2, 11, 31)
      //   }
      // }
    }
    
    else {
      this.firstInstallmentdatePickerConfig = { min: transferDateVar, max: new Date(new Date().getFullYear() + 2, 11, 31) };
    }

    
      //!this is the previous condition if anything went wrong with the above condition.
    // if(item.profileEntityLastPublishedPayrollDate){
    //   let lastPublishedPayrollDate = new Date(item.profileEntityLastPublishedPayrollDate);
    //   this.transferDatePickerConfig = { max: new Date(new Date().getFullYear() + 2, 11, 31)};
    //   this.firstInstallmentdatePickerConfig = {min: new Date(lastPublishedPayrollDate.getFullYear(),lastPublishedPayrollDate.getMonth()+2 ), max: new Date(new Date().getFullYear() + 2, 11, 31)};
    
    // }
    // if(transferDate){
    //   if(new Date(this.firstInstallmentdatePickerConfig.min).getTime() > new Date(transferDate).getTime() || new Date(this.firstInstallmentdatePickerConfig.max).getTime() < new Date(new Date(transferDate).getFullYear() + 2, 11, 31).getTime()) {
    //     this.firstInstallmentdatePickerConfig = {min: new Date(new Date(transferDate).getFullYear(),new Date(transferDate).getMonth()+1 ), max: new Date(new Date(transferDate).getFullYear() + 2, 11, 31)};
   
    //   }
    // }


  }

  public clearEmployee() {
    this.createLoanForm.controls.profileId.setValue(null);
    this.createLoanForm.controls.name.setValue(null);
    this.transferDatePickerConfig = {
      ...this.transferDatePickerConfig,
      min: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    }
  }

  public transferMonthChanged(normalizedMonthAndYear: Moment, widget: any): void {
    let lastPublishedDate = new Date(this?.selectedProfile?.profileEntityLastPublishedPayrollDate);
    let selectedDateDate = new Date(normalizedMonthAndYear.year(), normalizedMonthAndYear.month(), 1)
    if (selectedDateDate.getTime() <= lastPublishedDate.getTime()) {
      this.firstInstallmentdatePickerConfig = {
        min: new Date(lastPublishedDate.getFullYear(), lastPublishedDate.getMonth()+1, lastPublishedDate.getDate() )
        , max: new Date(new Date().getFullYear() + 2, 11, 31)
      }
    } else {
      this.firstInstallmentdatePickerConfig = { min: new Date(normalizedMonthAndYear.year(), normalizedMonthAndYear.month() +1), max: new Date(new Date().getFullYear() + 2, 11, 31) };
    }
    this.createLoanForm.controls.transferDateMoment.setValue(normalizedMonthAndYear);
    this.createLoanForm.controls.transferDateMonth.setValue(normalizedMonthAndYear.month());
    this.createLoanForm.controls.transferDateYear.setValue(normalizedMonthAndYear.year());
    widget?.close();

    this.createLoanForm.controls.firstInstallmentDateMoment.reset();
    
  }

  public firstInstallmentMonthChanged(normalizedMonthAndYear: Moment, widget: any): void {
    this.createLoanForm.controls.firstInstallmentDateMoment.setValue(normalizedMonthAndYear);
    this.createLoanForm.controls.firstInstallmentMonth.setValue(normalizedMonthAndYear.month());
    this.createLoanForm.controls.firstInstallmentYear.setValue(normalizedMonthAndYear.year());
    widget?.close();
  }

  public onSubmit(event) {
    
    if(this.createLoanForm.valid){
      let results = {
          profileId: this.createLoanForm.controls.profileId.value,
          grossAmount: this.createLoanForm.controls.grossAmount.value,
          transferDate: {
            month: this.createLoanForm.controls.transferDateMonth.value + 1,
            year: this.createLoanForm.controls.transferDateYear.value,
          },
          firstInstallmentDate: {
            month: this.createLoanForm.controls.firstInstallmentMonth.value + 1,
            year: this.createLoanForm.controls.firstInstallmentYear.value,
          }, 
          numberOfInstallments: this.createLoanForm.controls.numberOfInstallments.value,  
          purpose: this.createLoanForm.controls.purpose.value,
          numberOfRemainingInstallments: this.createLoanForm.controls.numberOfRemainingInstallments?.value,
          loanId: this.id ? +this.id : null
      }
      
      if(event === 'proceed-action'){
        this._fireCreateLoanAction(results);
        this.createLoanResponse$.subscribe( data => {
          if(data){
            this._snackbarService.openSuccessSnackbar({message: 'The loan has been saved and will be proceeded on all payrolls.'});
            this._router.navigate(['/loan-management/view/', data.id]);
            // this.clear(event, formDirective);
          }
        });
      }else if(event === 'save-action'){
        this._fireCreateLoanAsDraftAction(results);
        this.createLoanAsDraftResponse$.subscribe( data => {
          if(data?.id){
            this._snackbarService.openSuccessSnackbar({message: 'The Loan has been saved as a draft successfully.'});
            this._router.navigate(['/loan-management/view/', data.id]);
            // this.clear(event, formDirective);
          }
        });
      }else if(event === 'update-action'){
        this._store.dispatch(new UpdateLoan(results)).subscribe(()=>{
          this._snackbarService.openSuccessSnackbar({message: 'The Loan has been updated successfully.'});
          this._router.navigate(['/loan-management/view/', this.id]);
        })
      }
    }
  }

  private fillFormData(loan : LOANS_MODEL.GetLoanByIDResponseModel) {
    this.selectedProfile = loan;
    this.editMode = true;
    this.pageTitle = 'Edit ' + loan.employeeName + "'s Loan";
    this.createLoanForm.controls.name.setValue({ name: loan.employeeName });
    this.createLoanForm.controls.name.disable();
    this.createLoanForm.controls.profileId.setValue(loan.profileId);
    this.createLoanForm.controls.eMail.setValue(loan.employeeOrganizationEmail);
    this.createLoanForm.controls.purpose.setValue(loan.purpose, {emitEvent: false, onlySelf: true});
    this.createLoanForm.controls.grossAmount.setValue(loan.grossAmount);
    this.transferMonthChanged(moment(loan.transferDate), null);
    this.firstInstallmentMonthChanged(moment(loan.startDate), null);
    this.createLoanForm.controls.numberOfInstallments.setValue(loan.numberOfInstallments);
    this.updateTransferDate(loan, loan.transferDate)
    if(loan.status.id === 3){
      // in-progress loan
      this.createLoanForm.addControl('remaingAmount',new FormControl({value: loan.unpaidLoanAmount.toFixed(2), disabled: true}));
      this.createLoanForm.addControl('numberOfRemainingInstallments',new FormControl(loan.numberOfUnpaidInstallments, {validators:[Validators.min(1), Validators.pattern(/^-?\d*[.,]?\d{0,2}$/)], updateOn: 'blur'}));

      this.createLoanForm.controls.profileId.disable();
      this.createLoanForm.controls.grossAmount.disable();
      this.createLoanForm.controls.transferDateMoment.disable();
      this.createLoanForm.controls.transferDateMonth.disable();
      this.createLoanForm.controls.transferDateYear.disable();
      this.createLoanForm.controls.firstInstallmentDateMoment.disable();
      this.createLoanForm.controls.firstInstallmentMonth.disable();
      this.createLoanForm.controls.firstInstallmentYear.disable();
      this.createLoanForm.controls.numberOfInstallments.disable();
      this.createLoanForm.controls.purpose.disable();
    }else if(loan.status.id === 2){
      // transferred loan
      this.createLoanForm.controls.grossAmount.disable();
      this.createLoanForm.controls.transferDateMoment.disable();
      this.createLoanForm.controls.transferDateMonth.disable();
      this.createLoanForm.controls.transferDateYear.disable();
    }

    this._formValue = { ...this.createLoanForm.getRawValue() };
  }

  ngOnDestroy(): void {
    this._store.dispatch(new ResetPaymentPlan());
  }

  public deleteLoan() {
    this.backendError = null;
    const data: ConfirmationDialogDataModel = {
      title: "Delete Loan",
      content: OrgConfigInst.CRUD_CONFIG.confirmationMessages.delete(`${this.loan.employeeName} loan`),
      proceedText: OrgConfigInst.CRUD_CONFIG.actions.delete,
      class: "danger",
    };

    this._dialog.openConfirmationDialog(data, () => {
      this._store.dispatch(new DeleteLoan(this.loan.id))
      .pipe(
        catchError(err => {
          this.backendError = err.error;
          return of('')
        })
      )
      .subscribe((result)=>{
        if(!this.backendError){
          this._snackbarService.openSuccessSnackbar({
            message: OrgConfigInst.CRUD_CONFIG.messages.deleted(`"${this.loan.employeeName}" Loan`),
            duration: 5,
            showCloseBtn: false
          })
          this._router.navigate(['/loan-management/']);

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
