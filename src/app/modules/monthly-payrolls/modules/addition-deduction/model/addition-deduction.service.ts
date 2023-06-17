import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AdditionDeductionModel, AppliedAddition, AppliedDeductionModel } from './addition-deduction.model';

@Injectable({
  providedIn: 'root'
})
export class AdditionDeductionService {

  constructor(private _http: HttpService) { }

  private _endpoint = 'AdditionDeduction';


  public getAdditionTypes(): Observable<any> {
    return this._http.fetch(`${this._endpoint}/GetAdditionTypes`).pipe(
      map((res: ApiResponse<any>) => res.result)
    )
  }

  public getDeductionTypes(): Observable<any> {
    return this._http.fetch(`${this._endpoint}/GetDeductionTypes`).pipe(
      map((res: ApiResponse<any>) => res.result)
    )
  }


  public getAllSalaryModificationsForProfile(profileId, entityId): Observable<any> {
    return this._http.fetch(`${this._endpoint}/GetAllSalaryModificationsForProfile${buildQueryString({ profileId, entityId })}`).pipe(
      map((res: ApiResponse<any>) => res.result)
    )
  }

  public getAllSalaryModifications(profileId, entityId, PayrollMonth, PayrollYear): Observable<any> {
    return this._http.fetch(`${this._endpoint}/GetAllSalaryModifications${buildQueryString({ profileId, entityId, PayrollMonth, PayrollYear })}`).pipe(
      map((res: ApiResponse<any>) => res.result)
    )
  }

  public addAdditionForProfile(addition): Observable<any> {
    return this._http.post(`${this._endpoint}/addAdditionForProfile`, addition).pipe(
      map((res: ApiResponse<any>) => res.result)
    )
  }
  public addDeductionForProfile(deduction): Observable<any> {
    return this._http.post(`${this._endpoint}/addDeductionForProfile`, deduction).pipe(
      map((res: ApiResponse<any>) => res.result)
    )
  }


  public editAdditionForProfile(addition): Observable<any> {
    return this._http.post(`${this._endpoint}/editAdditionForProfile`, addition).pipe(
      map((res: ApiResponse<any>) => res.result)
    )
  }

  public editDeductionForProfile(deduction): Observable<any> {
    return this._http.post(`${this._endpoint}/editDeductionForProfile`, deduction).pipe(
      map((res: ApiResponse<any>) => res.result)
    )
  }

  public deleteAdditionFromProfile(profileEntityAdditionId): Observable<any> {
    return this._http.post(`${this._endpoint}/DeleteAdditionFromProfile${buildQueryString({ profileEntityAdditionId })}`).pipe(
      map((res: ApiResponse<any>) => res.result)
    )
  }
  public deleteDeductionFromProfile(profileEntityDeductionId): Observable<any> {
    return this._http.post(`${this._endpoint}/DeleteDeductionFromProfile${buildQueryString({ profileEntityDeductionId })}`).pipe(
      map((res: ApiResponse<any>) => res.result)
    )
  }

  /* Additions */
  // Validate additions befor applying
  public validateAdditionExcelFile(MonthlyPayrollId, file, options): Observable<any> {
    const addAdditionData = new FormData();
    addAdditionData.append("File", file);
    addAdditionData.append("MonthlyPayrollId", MonthlyPayrollId);
    return this._http.post(`${this._endpoint}/ValidateAdditionExcelFile`, addAdditionData,options)
  }

  // Applying additions
  public applyAdditionsFromExcel(MonthlyPayrollId, file): Observable<AppliedAddition[]> {
    const addAdditionData = new FormData();
    addAdditionData.append("File", file);
    addAdditionData.append("MonthlyPayrollId", MonthlyPayrollId);
    return this._http.post(`${this._endpoint}/ApplyAdditionsFromExcel`, addAdditionData).pipe(
      map((res : ApiResponse<AppliedAddition[]>) => res.result)
    )
  }

  // View uploaded Additions
  public getUploadedAdditions(MonthlyPayrollId): Observable<AdditionDeductionModel[]>{
    return this._http.fetch(`${this._endpoint}/GetUploadedAdditions${buildQueryString({MonthlyPayrollId})}`).pipe(
      map((res : ApiResponse<AdditionDeductionModel[]>) => res.result)
    )
  }

// Delete uploaded Additions
  public deleteAdditions(monthlyPayrollId:number): Observable<number> {
    return this._http.post(`${this._endpoint}/DeleteAdditions${buildQueryString({monthlyPayrollId})}`).pipe(
      map((res : ApiResponse<number>) => res.result)
    )
  }

    /* Deductions */
  // Validate Deductions befor applying
  public validateDeductionsExcelFile(MonthlyPayrollId, file, options): Observable<any> {
    const addAdditionData = new FormData();
    addAdditionData.append("File", file);
    addAdditionData.append("MonthlyPayrollId", MonthlyPayrollId);
    return this._http.post(`${this._endpoint}/ValidateDeductionExcelFile`, addAdditionData,options)
  }

  // Applying Deductions
  public applyDeductionsFromExcel(MonthlyPayrollId, file): Observable<AppliedDeductionModel[]> {
    const addAdditionData = new FormData();
    addAdditionData.append("File", file);
    addAdditionData.append("MonthlyPayrollId", MonthlyPayrollId);
    return this._http.post(`${this._endpoint}/ApplyDeductionsFromExcel`, addAdditionData).pipe(
      map((res : ApiResponse<AppliedDeductionModel[]>) => res.result)
    )
  }

  // View uploaded Deductions
  public getUploadedDeductions(MonthlyPayrollId): Observable<AdditionDeductionModel[]>{
    return this._http.fetch(`${this._endpoint}/GetUploadedDeductions${buildQueryString({MonthlyPayrollId})}`).pipe(
      map((res : ApiResponse<AdditionDeductionModel[]>) => res.result)
    )
  }

  // Delete uploaded Deductions
  public deleteDeductions(monthlyPayrollId:number): Observable<number> {
    return this._http.post(`${this._endpoint}/DeleteDeductions${buildQueryString({monthlyPayrollId})}`).pipe(
      map((res : ApiResponse<number>) => res.result)
    )
  }
}
