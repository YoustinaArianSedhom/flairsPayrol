import { Injectable } from '@angular/core';
import { PaginationModel, ApiResponse } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as HR_MODELS from './hr-data.models'

@Injectable({
  providedIn: 'root'
})
export class HrDataService {
  private _PROFILE_ENDPOINT_BASE = 'profiles'
  constructor(private _http: HttpService) { }
  public getProfilesHRData({ pageSize, pageNumber }: PaginationConfigModel, filter: HR_MODELS.HRDataFilterModel): Observable<PaginationModel<HR_MODELS.HRDataModel>> {
    return this._http.post(
      `${this._PROFILE_ENDPOINT_BASE}/GetProfilesHRData${buildQueryString({
        pageSize,
        pageNumber,
      })}`, { ...filter }
    ).pipe(
      map(
        (res: ApiResponse<PaginationModel<HR_MODELS.HRDataModel>>) => res.result
      )
    );
  }

  public getAllProfileStatuses(): Observable<HR_MODELS.StatusModel[]> {
    return this._http.fetch(`${this._PROFILE_ENDPOINT_BASE}/GetAllProfileStatuses`).pipe(
      map(
        (res: ApiResponse<HR_MODELS.StatusModel[]>) => res.result
      )
    )
  }

  public exportProfilesHRDataToExcel(filter: HR_MODELS.HRDataFilterModel) {
    return this._http.post(
      `${this._PROFILE_ENDPOINT_BASE}/ExportProfilesHRDataToExcel`, { ...filter }, {
      observe: "body",
      responseType: 'blob'
    });
  }
  public findDepartments(): Observable<HR_MODELS.DepartmentModel[]> {
    return this._http.fetch(`${this._PROFILE_ENDPOINT_BASE}/FindDepartments${buildQueryString({ query: '' })}`).pipe(
      map(
        (res: ApiResponse<HR_MODELS.DepartmentModel[]>) => res.result
      )
    )
  }
  public findManagers(): Observable<HR_MODELS.ManagerModel[]> {
    return this._http.fetch(`Profiles/FindManagers${buildQueryString({ query: '' })}`).pipe(
      map((res: ApiResponse<HR_MODELS.ManagerModel[]>) => res.result)
    )
  }

}
