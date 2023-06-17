import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http/http.service';
import { EmployeeModel } from '@modules/employees/model/employees.model';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { ApiResponse } from '@shared/models/api-response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as salaryModel from './salary-details.model';
import { EmployeeBankDetailsModel } from './salary-details.model';

@Injectable({
  providedIn: 'root'
})
export class SalaryDetailsService {

  constructor(
    private _http: HttpService
  ) { }
  private _endpoint = 'SalaryDetails';
  private _humanResources = 'HumanResources'
  private _salaries = 'Salaries'

  public getPersonalInfo(profileId: number): Observable<salaryModel.EmployeePersonalInfo> {
    return this._http.fetch(`${this._endpoint}/GetPersonalInfo${buildQueryString({ profileId })}`).pipe(
      map((res: ApiResponse<salaryModel.EmployeePersonalInfo>) => res.result)
    )
  }

  public getBankInfo(profileId: number): Observable<salaryModel.BankInfo> {
    return this._http.fetch(`${this._endpoint}/GetBankInfo${buildQueryString({ profileId })}`).pipe(
      map((res: ApiResponse<salaryModel.BankInfo>) => res.result)
    )
  }

  public getPayrollInfo(profileId: number): Observable<salaryModel.PayrollInfo> {
    return this._http.fetch(`${this._endpoint}/GetPayrollInfo${buildQueryString({ profileId })}`).pipe(
      map((res: salaryModel.PayrollInfo) => res)
    )
  }
  public getEntitiesInfo(profileId: number): Observable<salaryModel.JoinedEntityModel[]> {
    return this._http.fetch(`${this._endpoint}/GetEntitiesInfo${buildQueryString({ profileId })}`).pipe(
      map((res: salaryModel.JoinedEntityModel[]) => res)
    )
  }
  public getEntitiesHistory(profileId: number): Observable<salaryModel.JoinedEntityModel[]> {
    return this._http.fetch(`${this._endpoint}/GetEntitiesHistory${buildQueryString({ profileId })}`).pipe(
      map((res: salaryModel.JoinedEntityModel[]) => res)
    )
  }

  public updateEmployeeBankDetails(bankDetails: EmployeeBankDetailsModel): Observable<EmployeeModel> {
    return this._http.post(`${this._endpoint}/UpdateBankInfo`, bankDetails).pipe(
      map((res: ApiResponse<EmployeeModel>) => res.result)
    )
  }

  public updateEmployeePersonalInfo(personalInfo: salaryModel.EmployeePersonalInfo): Observable<salaryModel.EmployeePersonalInfo> {
    return this._http.post(`${this._humanResources}/UpdatePersonalInfo`, personalInfo).pipe(
      map((res: ApiResponse<salaryModel.EmployeePersonalInfo>) => res.result)
    )
  }

  public joinEntity(entity: salaryModel.JoinEntityModel): Observable<salaryModel.JoinedEntityModel> {
    return this._http.post(`${this._endpoint}/JoinEntity`, entity).pipe(
      map((res: ApiResponse<salaryModel.JoinedEntityModel>) => res.result)
    )
  }

  public leaveEntity(config: salaryModel.LeaveEntityModel): Observable<salaryModel.JoinedEntityModel> {
    return this._http.post(`${this._endpoint}/leaveEntity`, config).pipe(
      map((res: ApiResponse<salaryModel.JoinedEntityModel>) => res.result)
    )
  }

  public updateEntity(entity: salaryModel.JoinEntityModel) {
    return this._http.post(`${this._endpoint}/UpdateJoinedEntityInfo`, entity).pipe(
      map((res: ApiResponse<salaryModel.JoinedEntityModel>) => res.result)
    )
  }

  public getDefaultMonthlyPersonalExemption(entityId: number) {
    return this._http.fetch(`${this._endpoint}/GetDefaultMonthlyPersonalExemption${buildQueryString({ entityId })}`).pipe(map(({result}: ApiResponse<number>) => result));
  }

  public CalculateMonthlyBaseSocialInsurance(config: salaryModel.CalculateSocialInsuranceModel): Observable<number> {
    return this._http.fetch(`${this._endpoint}/GetMonthlyBaseSocialInsurance${buildQueryString(config)}`).pipe(
      map(({result}: ApiResponse<number>) => result)
    )
  } 

  public calculateMonthlyNetSalaryAndInsurance(config: salaryModel.CalculateMonthlyNetSalaryModel): Observable<any> {
    return this._http.fetch(`SalaryDetails/GetMonthlyNetSalaryAndInsurance${buildQueryString(config)}`).pipe(
      map(({result}: ApiResponse<number>) => result)
    )
  }

  public suspendSalary(suspendSalary: salaryModel.SuspendSalaryModel): Observable<salaryModel.SuspendSalaryModel> {
    return this._http.post(`${this._salaries}/SuspendSalary`, suspendSalary).pipe(
      map(({result}: ApiResponse<salaryModel.SuspendSalaryModel>) => result)
    )
  }

  public getSalarySuspensionReasons(): Observable<salaryModel.SuspensionReasonsModel[]> {
    return this._http.fetch(`${this._salaries}/GetSalarySuspensionReasons`).pipe(
      map((res: ApiResponse<salaryModel.SuspensionReasonsModel[]>) => res.result)
    )
  }

  public getSuspensionDetails(profileId: number): Observable<salaryModel.SuspensionDetailsModel> {
    return this._http.post(`${this._salaries}/GetSuspensionDetails${buildQueryString({profileId})}`).pipe(
      map((res: ApiResponse<salaryModel.SuspensionDetailsModel>) => res.result)
    )
  }

  public unSuspendSalary(unSuspendSalary: salaryModel.UnSuspendSalaryModel): Observable<salaryModel.UnSuspendSalaryModel> {
    return this._http.post(`${this._salaries}/UnsuspendSalary`, unSuspendSalary).pipe(
      map(({result}: ApiResponse<salaryModel.UnSuspendSalaryModel>) => result)
    )
  }

}
