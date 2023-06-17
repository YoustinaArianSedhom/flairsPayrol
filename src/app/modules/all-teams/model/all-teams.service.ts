import { Injectable } from '@angular/core';
import { ApiResponse, PaginationModel } from '@core/http/apis.model';
import { HttpService } from '@core/http/http/http.service';
import { buildQueryString } from '@shared/helpers/build-query-string.helper';
import { PaginationConfigModel } from '@shared/modules/pagination/model/pagination.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { All_TEAMS_ENDPOINTS_BASE } from './all-teams.config';
import {
  TeamMemberModel
} from './all-teams.models';

@Injectable({
  providedIn: 'root',
})
export class AllTeamsService {
  constructor(private _http: HttpService) { }

  public getAllTeams(
    { pageSize, pageNumber }: PaginationConfigModel,
    searchQuery: string
  ): Observable<PaginationModel<TeamMemberModel>> {
    return this._http
      .fetch(
        `${All_TEAMS_ENDPOINTS_BASE}${buildQueryString({
          pageSize,
          pageNumber,
          searchQuery,
        })}`
      )
      .pipe(
        map(
          (res: ApiResponse<PaginationModel<TeamMemberModel>>) => res.result
        )
      );
  }

  public updateTeamPaidAllocation(teamId: number, hasPaidAllocation: boolean): Observable<TeamMemberModel> {
    return this._http.fetch(`${All_TEAMS_ENDPOINTS_BASE}/UpdateTeamPaidAllocation${buildQueryString({ teamId, hasPaidAllocation })}`).pipe(
      map(
        (res: ApiResponse<TeamMemberModel>) => res.result
      )
    )
  }
}
