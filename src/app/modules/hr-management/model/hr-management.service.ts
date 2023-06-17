import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HR_MANAGEMENT_ENDPOINTS_BASE } from './hr-management.config';
import {
  HRTeamMemberModel,
  HRTeamFiltrationModel,
  TeamModel,
  AssignHRModel,
} from './hr-management.models';

@Injectable({
  providedIn: 'root',
})
export class HrManagementService {
  constructor(private _http: HttpService) {}

  public getMyHRTeamMembers(
    { pageSize, pageNumber }: PaginationConfigModel,
    searchQuery: string
  ): Observable<PaginationModel<HRTeamMemberModel>> {
    return this._http
      .fetch(
        `${HR_MANAGEMENT_ENDPOINTS_BASE}/Hrs${buildQueryString({
          pageSize,
          pageNumber,
          searchQuery,
        })}`
      )
      .pipe(
        map(
          (res: ApiResponse<PaginationModel<HRTeamMemberModel>>) => res.result
        )
      );
  }

  public searchTeams(searchQuery: string): Observable<TeamModel[]> {
    return this._http
      .fetch(
        `Teams/Search${buildQueryString({
          searchQuery,
        })}`
      )
      .pipe(map((res: ApiResponse<TeamModel[]>) => res.result));
  }

  public assignHrTeam(team: AssignHRModel): Observable<AssignHRModel> {
    return this._http
      .post(`BusinessPartner/Add`, team)
      .pipe(map((res: ApiResponse<AssignHRModel>) => res.result));
  }
  public unAssignHrTeam(team: AssignHRModel): Observable<AssignHRModel> {
    return this._http
      .post(`BusinessPartner/Remove`, team)
      .pipe(map((res: ApiResponse<AssignHRModel>) => res.result));
  }
}
