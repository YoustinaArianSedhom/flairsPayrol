import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http/http.service';
import * as REPORTS_MODELS from '@modules/reports/models/reports.model';
import * as REPORTS_CONFIGS from '@modules/reports/models/reports.config';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private _http: HttpService
  ) { }


  public getReports(pagination: PaginationConfigModel, body: REPORTS_MODELS.ReportsFiltrationModel): Observable<PaginationModel<REPORTS_MODELS.ReportModel>> {
    return this._http.post(`${REPORTS_CONFIGS.REPORTS_BASE_ENDPOINT}/GetExpensesReport${buildQueryString(pagination)}`, body).pipe(
      map(
        (res: ApiResponse<PaginationModel<REPORTS_MODELS.ReportModel>>) => res.result
      )
    )
  }


  public searchManagers(searchQuery: string): Observable<REPORTS_MODELS.ManagerModel[]> {
    return this._http.fetch(`${REPORTS_CONFIGS.REPORTS_BASE_ENDPOINT}/SearchManagers${buildQueryString({ searchQuery })}`).pipe(
      map(
        (res: ApiResponse<REPORTS_MODELS.ManagerModel[]>) => res.result
      )
    )
  }



  public getPublishedPayroll(entityId: number): Observable<REPORTS_MODELS.PublishedPayrollModel[]> {
    return this._http.fetch(`${REPORTS_CONFIGS.REPORTS_BASE_ENDPOINT}/GetPublishedPayrolls${buildQueryString({ entityId })}`).pipe(
      map(
        (res: ApiResponse<REPORTS_MODELS.PublishedPayrollModel[]>) => res.result
      )
    )
  }

  public getExpensesReportAsExcel(config: REPORTS_MODELS.ReportsFiltrationModel) {
    return this._http.post(`${REPORTS_CONFIGS.REPORTS_BASE_ENDPOINT}/GetExpensesReportAsExcel`,config, {
      observe: "body",
      responseType: 'blob'
    })
  }
}
