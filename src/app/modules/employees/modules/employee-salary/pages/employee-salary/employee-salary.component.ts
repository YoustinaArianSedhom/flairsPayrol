import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '@core/http/http/http.service';
import { LayoutService } from '@modules/layout/model/layout.service';
import { ViewSelectSnapshot } from '@ngxs-labs/select-snapshot';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { EmployeeBankDetailsFormComponent } from '../../components/employee-bank-details-form/employee-bank-details-form.component';
import { PersonalInfoFormComponent } from '../../components/personal-info-form/personal-info-form.component';
import { BankInfo, EmployeePersonalInfo, PayrollInfo, JoinedEntityModel } from '../../model/salary-details.model';
import { GetBankInfo, GetEntitiesHistory, GetEntitiesInfo, GetPayrollInfo, GetPersonalInfo } from '../../state/salary-details.actions';
import { SalaryDetailsState } from '../../state/salary-details.state';
import {Location} from '@angular/common';

@Component({ 
  selector: 'app-employee-salary',
  templateUrl: './employee-salary.component.html',
  styles: [
  ]
})
export class EmployeeSalaryComponent implements OnInit {

  constructor(
    private _route: ActivatedRoute,
    private _store: Store,
    private _matDialog: MatDialog,
    private _layoutService: LayoutService,
    private _http: HttpService,
    private _location: Location
  ) { }

  public isEntityEditable: boolean;
  public backendError: {
    errorCode: number
    errorMessage: string
  } = { errorCode: 0, errorMessage: '' }

  @Select(SalaryDetailsState.personalInfo) public personalInfo$: Observable<EmployeePersonalInfo>
  @Select(SalaryDetailsState.bankInfo) public bankInfo$: Observable<BankInfo>
  @Select(SalaryDetailsState.payrollInfo) public payrollInfo$: Observable<PayrollInfo>
  @Select(SalaryDetailsState.entityInfo) public entityInfo$: Observable<JoinedEntityModel[]>
  @Select(SalaryDetailsState.entitiesHistory) public entitiesHistory$: Observable<JoinedEntityModel[]>



  @ViewSelectSnapshot(SalaryDetailsState.personalInfo) public personalInfo: EmployeePersonalInfo;
  @ViewSelectSnapshot(SalaryDetailsState.bankInfo) public bankInfo: BankInfo;
  @ViewSelectSnapshot(SalaryDetailsState.payrollInfo) public payrollInfo: BankInfo;
  @ViewSelectSnapshot(SalaryDetailsState.entityInfo) public entityInfo: JoinedEntityModel;
  @ViewSelectSnapshot(SalaryDetailsState.entitiesHistory) public entitiesHistory: JoinedEntityModel;
  public profileId: number;
  public pageTitle = `Employee Details`;

  // @SelectSnapshot(SalaryDetailsState.employee) public employee: EmployeeModel;
  ngOnInit(): void {
    this.GetEmployeeSalaryDetails(this._route.snapshot.params.id);
    this.profileId = parseInt(this._route.snapshot.params.id, 10);
    this.entityInfo$.subscribe(entity => {
      if (entity) {
        this.getIsEntityEditable(entity[0].entityId);
      }
    })
    this.personalInfo$.subscribe(employee => {
      if (employee) {
        this._layoutService.setTitle(employee.name)
      }
    })
  }

  // Actions
  public GetEmployeeSalaryDetails(id) {
    this._store.dispatch(new GetPersonalInfo(id))
    this._store.dispatch(new GetBankInfo(id))
    this._store.dispatch(new GetPayrollInfo(id))
    this._store.dispatch(new GetEntitiesInfo(id))
    this._store.dispatch(new GetEntitiesHistory(id))
  }
  // ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this._store.reset(SalaryDetailsState.entityInfo);
    // this._store.reset(SalaryDetailsState.payrollInfo);
  // }


  public onBankInfoUpdate() {
    this._matDialog.open(EmployeeBankDetailsFormComponent, {
      data: { ...this.bankInfo, id: this.profileId },
      panelClass: ['FormDialog'],
    })
  }

  public navigateBack(){
    this._location.back();
  }

  private getIsEntityEditable(entityId) {
    this._http.fetch(`Entities/IsEntityEditable?entityId=${entityId}`).subscribe(res => {
      console.log('getEntityState', res.result)
      this.isEntityEditable = res.result
      if (!res.result) {
        this.backendError.errorMessage = 'Entity is not Editable'
        console.log('backendError', this.backendError.errorMessage)
      }
    })
  }

  public onPersonalInfoUpdate() {
    this._matDialog.open(PersonalInfoFormComponent, {
      data: { ...this.personalInfo, id: this.profileId },
      panelClass: ['FormDialog']
    })
  }

}
