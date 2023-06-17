import { Injectable } from '@angular/core';
import { PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { EmployeeModel } from '@modules/employees/model/employees.model';
import { LayoutService } from '@modules/layout/model/layout.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { ApiResponse } from '@shared/models/api-response';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as EMPLOYEE_PROFILE_MODELS from '@modules/employees/modules/employee-profile/model/employee-profile.model'
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeProfileService {

  constructor(
    private _http: HttpService,
    private _layout: LayoutService
  ) { }


  private _endpoint = 'profiles';
  private _workflowsEndpoint = 'WorkflowReports'



  public getEmployeeDetails(profileId: number): Observable<EmployeeModel> {
    return this._http.fetch(`${this._endpoint}/GetProfileDetailsById${buildQueryString({ profileId })}`).pipe(
      map((res: ApiResponse<EmployeeModel>) => res.result),
      tap((employee: EmployeeModel) => this._layout.setTitle(employee.name))
    )
  }


  public getEmployeeWorkflows(pagination: PaginationConfigModel, memberOrganizationEmail: string): Observable<PaginationModel<EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowsModel>> {
    return this._http.fetch(`${this._workflowsEndpoint}/GetMemberWorkflows?PageNumber=${pagination.pageNumber}&PageSize=${pagination.pageSize}&memberOrganizationEmail=${memberOrganizationEmail}`).pipe(
      map(
        (res: ApiResponse<PaginationModel<EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowsModel>>) => res.result
      )
    )
  }

  public getEmployeeWorkflowDetails(instanceId: string): Observable<EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowDetailsModel[]> {
    return this._http.fetch(`${this._workflowsEndpoint}/GetMemberWorkflowDetails${buildQueryString({ instanceId })}`).pipe(
      map(
        (res: ApiResponse<EMPLOYEE_PROFILE_MODELS.EmployeeWorkflowDetailsModel[]>) => res.result
      )
    )
  }

}
