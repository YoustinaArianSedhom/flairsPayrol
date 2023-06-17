import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AllocationService {

  constructor(
    private _http: HttpService
  ) { }

  private _endpoint = 'Allocations';


  public addAllocations(MonthlyPayrollId, AllocationsSheet, options): Observable<any> {
    const addAllocationData = new FormData();
    addAllocationData.append("AllocationsSheet", AllocationsSheet);
    addAllocationData.append("MonthlyPayrollId", MonthlyPayrollId);
    return this._http.post(`${this._endpoint}/AddAllocations`, addAllocationData, options);
  }
  
  public applyAllocations(MonthlyPayrollId, AllocationsSheet): Observable<any> {
    const applyAllocationData = new FormData();
    applyAllocationData.append("AllocationsSheet", AllocationsSheet);
    applyAllocationData.append("MonthlyPayrollId", MonthlyPayrollId);
    return this._http.post(`${this._endpoint}/ApplyAllocations`, applyAllocationData).pipe(
      map((res : ApiResponse<any>) => res.result)
    )
  }

  public deleteAllocations(monthlyPayrollId): Observable<any> {
    return this._http.post(`${this._endpoint}/DeleteAllocations${buildQueryString({monthlyPayrollId})}`).pipe(
      map((res : ApiResponse<any>) => res.result)
    )
  }
  public getUploadedAllocations(payrollId): Observable<any> {
    return this._http.fetch(`${this._endpoint}/getUploadedAllocations${buildQueryString({payrollId})}`).pipe(
      map((res : ApiResponse<any>) => res.result)
    )
  }



}
