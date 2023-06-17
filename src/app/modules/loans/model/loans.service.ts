import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http/http.service';
import { EmployeeModel } from '@modules/employees/model/employees.model';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { ApiResponse } from '@shared/models/api-response';
import { PaginationModel } from '@core/http/apis.model';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { CreateLoanRequestModel, CreateLoanResponseModel, GetLoanByIDResponseModel, loansFiltrationModel, loansModel, LoanStatusModel, PaymentPlanModel, PaymentPlanModelRequest, UpdateLoanRequestModel } from './loans.models';

@Injectable({
  providedIn: 'root',
})
export class LoansService {
  LOANS_ENDPOINTS_BASE = 'Loan';

  constructor(private _http: HttpService) {}

  public findLoanEligableProfiles(query: string): Observable<EmployeeModel[]> {
    return this._http
      .fetch(
        `Profiles/FindLoanEligableProfiles${buildQueryString({
          query,
        })}`
      )
      .pipe(map((res: ApiResponse<EmployeeModel[]>) => res.result));
  }

  public getAllLoans(
    { pageSize, pageNumber }: PaginationConfigModel,
    filtration: loansFiltrationModel
  ): Observable<PaginationModel<loansModel>> {
    return this._http
      .post(
        `${this.LOANS_ENDPOINTS_BASE}/GetFilteredPage${buildQueryString({
          pageSize,
          pageNumber,
        })}`,
        { ...filtration }
      )
      .pipe(map((res: ApiResponse<PaginationModel<loansModel>>) => res.result));
  }

  public deleteLoan(loanId: string) {
    return this._http.fetch(
      `${this.LOANS_ENDPOINTS_BASE}/DeleteById${buildQueryString({
        loanId,
      })}`
    );
  }

  public getPaymentPlan(body: PaymentPlanModelRequest) : Observable<PaymentPlanModel>{
    return this._http.post(
      `${this.LOANS_ENDPOINTS_BASE}/GetPaymentPlan`,body).pipe(
        map(
          (res: ApiResponse<PaymentPlanModel>) => res.result
        )
      );
  }

  public getLoanStatus() : Observable<LoanStatusModel[]>{
    return this._http.fetch(
      `${this.LOANS_ENDPOINTS_BASE}/GetAllLoanStatuses`).pipe(
        map(
          (res: ApiResponse<LoanStatusModel[]>) => res.result
        )
      );
  }

  public createLoan(data: CreateLoanRequestModel) : Observable<CreateLoanResponseModel>{
    return this._http.post(
      `${this.LOANS_ENDPOINTS_BASE}/Create`,data).pipe(
        map(
          (res: ApiResponse<CreateLoanResponseModel>) => res.result
        )
      );
  }

  public createLoanAsDraft(data: CreateLoanRequestModel) : Observable<CreateLoanResponseModel>{
    return this._http.post(
      `${this.LOANS_ENDPOINTS_BASE}/CreateAsDraft`,data).pipe(
        map(
          (res: ApiResponse<CreateLoanResponseModel>) => res.result
        )
      );
  }

  public GetById(loanId: number) : Observable<GetLoanByIDResponseModel>{
    return this._http.fetch(
      `${this.LOANS_ENDPOINTS_BASE}/GetById${buildQueryString({loanId})}`).pipe(
        map(
          (res: ApiResponse<GetLoanByIDResponseModel>) => res.result
        )
      );
  }

  public ApplyDraftLoan(loanId: number) : Observable<CreateLoanResponseModel>{
    return this._http.post(
      `${this.LOANS_ENDPOINTS_BASE}/ApplyDraftLoan${buildQueryString({loanId})}`).pipe(
        map(
          (res: ApiResponse<CreateLoanResponseModel>) => res.result
        )
      );
  }

  public ExportLoan(filter: loansFiltrationModel){
    return this._http.post(
      `${this.LOANS_ENDPOINTS_BASE}/ExportToExcel`,{...filter},{observe: "body",
      responseType: 'blob'
    });
  }

  public updateLoan(data: UpdateLoanRequestModel) : Observable<any>{
    return this._http.post(
      `${this.LOANS_ENDPOINTS_BASE}/Update`,data).pipe(
        map(
          (res: ApiResponse<any>) => res.result
        )
      );
  }

}
