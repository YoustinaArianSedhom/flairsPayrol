import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EmployeeModel } from './employees.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  constructor(
    private _http: HttpService
  ) { }


  private _endPoint = 'Profiles';


  public get(pagination: PaginationConfigModel, filters): Observable<PaginationModel<EmployeeModel>> {
    return this._http.post(`${this._endPoint}/GetAllProfiles${buildQueryString(pagination)}`, filters).pipe(
      map((res: ApiResponse<PaginationModel<EmployeeModel>>) => {
        return res.result;
      })
    )
  }

  public submit(userId: number): Observable<EmployeeModel> {
    return this._http.post(`${this._endPoint}/SubmitUser${buildQueryString({userId})}`, {}).pipe(
      map((res: ApiResponse<EmployeeModel>) => res.result)
    )
  }

  public archive(userId: number): Observable<EmployeeModel>{
    return this._http.post(`${this._endPoint}/ArchiveUser${buildQueryString({userId})}`, {}).pipe(
      map((res: ApiResponse<EmployeeModel>) => res.result)
    )
  }

  /**
   * @todo Think again where to put this action or method
   */
  public updateEmployeeRoles(body: {profileId: number; newRoles: string[]}): Observable<EmployeeModel> {
    return this._http.post(`${this._endPoint}/UpdateProfileRoles`, body).pipe(
      map((res: ApiResponse<EmployeeModel>) => res.result)
    )
  }



}
