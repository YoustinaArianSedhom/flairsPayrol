import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as USER_MODELS from '@core/modules/user/model/user.model'
import { buildQueryString } from '@shared/helpers/build-query-string.helper';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http: HttpService
  ) {}

  private _endpoint = 'profiles';
  private _workflowsEndpoint = 'WorkflowReports'



  public getMyProfileDetails(): Observable<USER_MODELS.ProfileModel> {
    return this._http.fetch(`${this._endpoint}/GetMyProfileDetails`).pipe(
      map((res: ApiResponse<USER_MODELS.ProfileModel>) => res.result)
    )
  }

  public GetMyUserInfo(): Observable<USER_MODELS.UserModel> {
    return this._http.fetch('Auth/GetMyUserInfo').pipe(
      map((res: ApiResponse<USER_MODELS.UserModel>) => res.result)
    )
  }


  public getMyWorkflows(pagination: PaginationConfigModel): Observable<PaginationModel<USER_MODELS.MyWorkflowsModel>> {
    return this._http.fetch(`${this._workflowsEndpoint}/GetMyWorkflows?PageNumber=${pagination.pageNumber}&PageSize=${pagination.pageSize}`).pipe(
      map(
        (res: ApiResponse<PaginationModel<USER_MODELS.MyWorkflowsModel>>) => res.result
      )
    )
  }

  public getMyWorkflowDetails(instanceId: string): Observable<USER_MODELS.MyWorkflowDetailsModel[]> {
    return this._http.fetch(`${this._workflowsEndpoint}/GetMyWorkflowDetails${buildQueryString({ instanceId })}`).pipe(
      map(
        (res: ApiResponse<USER_MODELS.MyWorkflowDetailsModel[]>) => res.result
      )
    )
  }



}
