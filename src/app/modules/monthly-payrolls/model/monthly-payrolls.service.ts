import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { LayoutService } from '@modules/layout/model/layout.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { SnackBarsService } from '@shared/modules/snackbars/snackbars.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as MONTHLY_PAYROLL_MODEL from '@modules/monthly-payrolls/model/monthly-payrolls.model'
@Injectable()
export class MonthlyPayrollsService {

  constructor(
    private _http: HttpService,
    private _layout: LayoutService,
    private readonly _snackbar: SnackBarsService
  ) { }

  private _endpoint = 'Payrolls';


  public getAllPayrolls(filtration: MONTHLY_PAYROLL_MODEL.MonthlyPayrollsFiltrationModel, pagination?: PaginationConfigModel): Observable<PaginationModel<MONTHLY_PAYROLL_MODEL.MonthlyPayrollModel>> {
    return this._http.post(`${this._endpoint}/GetAllPayrolls${buildQueryString(pagination)}`, filtration).pipe(
      map((res: ApiResponse<PaginationModel<MONTHLY_PAYROLL_MODEL.MonthlyPayrollModel>>) => res.result)
    )
  }


  public createPayroll(body: MONTHLY_PAYROLL_MODEL.MonthlyPayrollAddingModel): Observable<MONTHLY_PAYROLL_MODEL.MonthlyPayrollModel> {
    return this._http.post(`${this._endpoint}/Create`, body).pipe(
      map((res: ApiResponse<MONTHLY_PAYROLL_MODEL.MonthlyPayrollModel>) => res.result)
    )
  }


  public getMonthlyPayrollSummary(payrollId: number): Observable<MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel> {
    return this._http.post(`${this._endpoint}/GetPayrollSummary${buildQueryString({ payrollId })}`, {}).pipe(
      map((res: ApiResponse<MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel>) => res.result),
      tap((monthlyPayrollSummary) => this._layout.setTitle(monthlyPayrollSummary.name))
    )
  }


  public getPayrollSalariesSummary(payrollId: number): Observable<MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel> {
    return this._http.post(`${this._endpoint}/GetPayrollSalariesSummary${buildQueryString({ payrollId })}`, {}).pipe(
      map((res: ApiResponse<MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel>) => res.result),
      tap((monthlyPayrollSummary) => this._layout.setTitle(monthlyPayrollSummary.name))
    )
  }

  public getMonthlyPayrollDetails(filtration: MONTHLY_PAYROLL_MODEL.MonthlyPayrollDetailsFiltrationModel, pagination: PaginationConfigModel): Observable<PaginationModel<MONTHLY_PAYROLL_MODEL.MonthlyPayrollDetailsModel>> {
    return this._http.post(`${this._endpoint}/GetPayrollDetails${buildQueryString(pagination)}`, filtration).pipe(
      map((res: (ApiResponse<PaginationModel<MONTHLY_PAYROLL_MODEL.MonthlyPayrollDetailsModel>>)) => res.result)
    )
  }


  public deleteMonthlyPayroll(payrollId: number): Observable<boolean> {
    return this._http.post(`${this._endpoint}/Delete${buildQueryString({ payrollId })}`).pipe(
      map((res: ApiResponse<boolean>) => res.result)
    )
  }

  public closeMonthlyPayroll(payrollId: number): Observable<MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel> {
    return this._http.post(`${this._endpoint}/Close${buildQueryString({ payrollId })}`, {}).pipe(
      map((res: ApiResponse<MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel>) => res.result)
    )
  }

  public openMonthlyPayroll(payrollId: number): Observable<MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel> {
    return this._http.post(`${this._endpoint}/Open${buildQueryString({ payrollId })}`, {}).pipe(
      map((res: ApiResponse<MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel>) => res.result)
    )
  }
  public publishMonthlyPayroll(payrollId: number): Observable<MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel> {
    return this._http.post(`${this._endpoint}/Publish${buildQueryString({ payrollId })}`, {}).pipe(
      map((res: ApiResponse<MONTHLY_PAYROLL_MODEL.MonthlyPayrollSummaryModel>) => res.result)
    )
  }

  public getPayrollTransferDates(payrollId:number): Observable<MONTHLY_PAYROLL_MODEL.MonthlyPayrollTransferDateModel[]> {
    return this._http.fetch(`${this._endpoint}/GetPayrollTransferDates${buildQueryString({ payrollId })}`).pipe(
      map((res: ApiResponse<MONTHLY_PAYROLL_MODEL.MonthlyPayrollTransferDateModel[]>) => res.result)
    )
  }

///api/Payrolls/
  public applyPayrollTransfers(payrollId: number): Observable<MONTHLY_PAYROLL_MODEL.TransferPayroll> {
    return this._http.post(`${this._endpoint}/ApplyPayrollTransfers${buildQueryString({ payrollId })}`).pipe(
      map((res: ApiResponse<MONTHLY_PAYROLL_MODEL.TransferPayroll>) => res.result)
    )
  }

  public sendMonthlyPayrollNotificationViaEmail(config) {
    return this._http.post(`${this._endpoint}/SendPayrollNotificationEmail${buildQueryString(config)}`, {})
  }

  public exportMonthlyPayroll(config: MONTHLY_PAYROLL_MODEL.MonthlyPayrollExportingModel) {
    return this._http.post(`${this._endpoint}/ExportPayrollDetails${buildQueryString(config)}`, {}, {
      observe: "body",
      responseType: 'blob'
    }).pipe(
      catchError(({error}: HttpErrorResponse) => {
        this._snackbar.openFailureSnackbar({
          message: error.errorMessage,
          duration: 5
        })
        return throwError(error);
      })
    )
  }


  public getIsEntityIsEditable(entityId: number): Observable<boolean> {
    return this._http.fetch(`Entities/IsEntityEditable?entityId=${entityId}`).pipe(
      map(({result}: ApiResponse<boolean>) => result)
    )
  }

  public exportOnePercentDeductionReport(payrollId: number): Observable<any> {
    return this._http.post(`${this._endpoint}/ExportOnePercentDeductionReport${buildQueryString({payrollId})}`, {}, {
      observe: "body",
      responseType: 'blob'
    }).pipe(
      catchError(({error}: HttpErrorResponse) => {
        this._snackbar.openFailureSnackbar({
          message: error.errorMessage,
          duration: 5
        })
        return throwError(error);
      })
    )
  }

  public getCountOfProfilesShouldBeApplied(payrollId: number): Observable<number> {
    return this._http.post(`${this._endpoint}/GetCountOfProfilesShouldBeApplied${buildQueryString({payrollId})}`).pipe(
      map(({result}: ApiResponse<number>) => result)
    )
  }
  
  public getCountOfProfilesShouldBeRemovedFromApplying(payrollId: number): Observable<number> {
    return this._http.post(`${this._endpoint}/GetCountOfProfilesShouldBeRemovedFromApplying${buildQueryString({payrollId})}`).pipe(
      map(({result}: ApiResponse<number>) => result)
    )
  }

  public getProfilesShouldBeApplied(payrollId: number, pagination: PaginationConfigModel): Observable<PaginationModel<MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel>> {
    return this._http.post(`${this._endpoint}/GetProfilesShouldBeApplied${buildQueryString({payrollId, pageNumber :pagination.pageNumber, pageSize: pagination.pageSize})}`).pipe(
      map((res: ApiResponse<PaginationModel<MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel>>) => res.result)
    )
  }

  public getProfilesShouldBeRemovedFromApplying(payrollId: number, pagination: PaginationConfigModel): Observable<PaginationModel<MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel>> {
    return this._http.post(`${this._endpoint}/GetProfilesShouldBeRemovedFromApplying${buildQueryString({payrollId, pageNumber :pagination.pageNumber, pageSize: pagination.pageSize})}`).pipe(
      map((res: ApiResponse<PaginationModel<MONTHLY_PAYROLL_MODEL.LoyaltyBonusModel>>) => res.result)
    )
  }

  public applyLoyalty(payrollId: number,profileIds: number[]) {
    return this._http.post(`${this._endpoint}/ApplyLoyalty${buildQueryString({payrollId})}`,profileIds);
  }

  public removeAppliedLoyalty(payrollId: number,profileIds: number[]) {
    return this._http.post(`${this._endpoint}/RemoveAppliedLoyalty${buildQueryString({payrollId})}`,profileIds);
  }
  
  public exportPayrollLoyaltyDetails(payrollId: number): Observable<any> {
    return this._http.post(`${this._endpoint}/ExportPayrollLoyaltyDetails${buildQueryString({payrollId})}`, {}, {
      observe: "body",
      responseType: 'blob'
    })
  }

}
