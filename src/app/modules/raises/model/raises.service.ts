import { RaisesFilterationModel, RaisesModel } from '@modules/raises/model/raises';
import { Injectable } from '@angular/core';
import { HttpService } from '@core/http/http/http.service';
import { Observable } from 'rxjs';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { map, filter } from 'rxjs/operators';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Injectable({
  providedIn: 'root'
})
export class RaisesService {

  constructor(private _http: HttpService) { }

  private _workflowEndpoint = 'WorkflowReports';

  public getRaiseRequests(pagination: PaginationConfigModel, filter: RaisesFilterationModel): Observable<PaginationModel<RaisesModel>> {
    return this._http.post(`${this._workflowEndpoint}/GetRaiseRequests${buildQueryString(pagination)}`, filter).pipe(
      map((res: ApiResponse<PaginationModel<RaisesModel>>) => res.result)
    )
  }
  public exportRaiseRequestReport(filter: RaisesFilterationModel) {
    return this._http.post(`${this._workflowEndpoint}/ExportRaiseRequestReport`, { ...filter }, { observe: "body", responseType: 'blob' }).pipe(
      map(data => { return data })
    )
  }
}
