import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { from, Observable, of, scheduled } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeSalaryDetailsModel } from './salaries.interface';

@Injectable({
  providedIn: 'root'
})
export class SalariesService {

  constructor(
    private _http: HttpService
  ) { }

  private _endpoint = 'Salaries';

  public getEmployeeSalarySummaries(pagination: PaginationConfigModel, sort): Observable<PaginationModel<EmployeeSalaryDetailsModel>> {
    return this._http.post(`${this._endpoint}/GetProfileSalarySummaries${buildQueryString(pagination)}`, sort).pipe(
      map((res: ApiResponse<PaginationModel<EmployeeSalaryDetailsModel>>) => res.result)
    )
  }


  
}
